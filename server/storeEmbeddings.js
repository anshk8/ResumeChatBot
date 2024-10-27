const {openai, supabase} = require("./utils/config");


//Only Ran Seperately by me (Ansh) to update Supabase Vector Database

//Information to create embeddings out of
const resumeContent = [
    "2nd Year Computer Science student specializing in AI and Machine Learning studying at Carleton University.",
    "My LinkedIn is at this url: https://www.linkedin.com/in/ansh-kakkar-471a0a288/",
    "I can be contacted via email at: anshkakkar05@gmail.com.",
    "My Hobbies include Riding my bike, weightlifting, spending time with family."
];



async function main(input) {

    //Create embedding through each line in array via OPENAI API
  await Promise.all(
    input.map( async (textChunk) => {
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: textChunk
        });
        const data = { 
          content: textChunk, 
          embedding: embeddingResponse.data[0].embedding 
        }
        
        // Insert content and embedding into Supabase
        const {info, error} = await supabase.from('documents').insert(data) 

        //Error Checking
        if (error){
            console.log(error)
        } else{
            //Double check information
            console.log(`Info Added: ${info}`)
            console.log('Embedding complete!');
        }

    })    
  );
 
}

//Run Function
main(resumeContent)