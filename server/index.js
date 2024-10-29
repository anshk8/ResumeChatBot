const { openai, supabase } = require("./utils/config");

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'  
}));

app.use(express.json());


//Function to create embedding from user input from Front end
async function createEmbedding(text) {

    //OpenAI embedding function
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

//Function to find a match via comparing embeddings in supabase vector databse
async function findMatch(embedding) {
    try {

        //Finds 2 matches
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.50,
            match_count: 2
        });

        if (error) {
            console.error(error);
            throw new Error("Error with semantic search: " + error.message);
        }

        //Returns two matches joined via newline character
        const match = data.map(obj => obj.content).join('\n');
        return match;
  

    } catch (error) {
        throw new Error(error.message);
    }
}

//Function to get chat completion via OpenAI. (More detailed breakdown: We get user input (front end), create an embedding from input, compare embedding with info in supabase, find content similar to embedding, pass the content as answer, pass the user original question as question and ask gpt-4 model to present the answer to us from the question acting as Ansh)
async function getResponse(question, answer) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: "system",
                    content: `You are talking on behalf of Ansh Kakkar, a Computer Science University Student and will present his resume in first person. You will be given  context about the student and will answer the question on his behalf. If you do not know the answer to the question or the question is not relevant to the student's resume, respond with 'I don't have that information'. Please do not make up any answers. When greeted, encourage the user to ask about yourself or be enthusiastic to have a conversation. Context: ${answer} Question: ${question}`
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

    //User input from react
    const { message } = req.body;

    //Create embedding, find a match, get response in conversational form and return
    try {
        const embedding = await createEmbedding(message);
        const match = await findMatch(embedding);
        console.log(match);

        // Ensure match contains data before accessing match[0]
        const result = await getResponse(message, match ? match: "No match found.");
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Resume Chat Bot API!');
});


// Start the server on port 5000
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
