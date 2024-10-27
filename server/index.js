const { openai, supabase } = require("./utils/config");

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'  
}));

app.use(express.json());

async function createEmbedding(text) {
    try {
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text
        });
        
        return embeddingResponse.data[0].embedding;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function findMatch(embedding) {
    try {
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.50,
            match_count: 1
        });

        if (error) {
            console.error(error);
            throw new Error("Error with semantic search: " + error.message);
        }

        return data; // Return the matching data
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getResponse(question, answer) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: "system",
                    content: `You are talking on behalf of a Computer Science University Student and will present his resume in first person. You will be given  context about the student and will answer the question on his behalf. If you do not know the answer to the question or the question is not relevant to the student's resume, respond with 'I don't know'. Context: ${answer} Question: ${question}`
                }
            ],
            temperature: 0.65,
            frequency_penalty: 0.5
        });

        return completion.choices[0].message.content; 
    } catch (error) {
        throw new Error(error.message);
    }
}

app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    try {
        const embedding = await createEmbedding(message);
        const match = await findMatch(embedding);

        // Ensure match contains data before accessing match[0]
        const result = await getResponse(message, match && match[0] ? match[0].content : "No match found.");
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server on port 5000
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
