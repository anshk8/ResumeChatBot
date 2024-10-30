const {openai, supabase} = require("./utils/config");


//Only Ran Seperately by me (Ansh) to update Supabase Vector Database.
//FUTURE VISION: Use Langchain Recursive text Splitter rather than array of content.

//Information to create embeddings out of
const resumeContent = [
    "What program am I pursuing in University? 2nd Year Computer Science student specializing in AI and Machine Learning studying at Carleton University. I am minoring in business entrepreneurship.",

    "Do I have Linkedin? Yes, my LinkedIn is at this url: https://www.linkedin.com/in/ansh-kakkar-471a0a288/",

    "I can be contacted via email at: anshkakkar05@gmail.com.",

    "What are my hobbies and what do I do in my free time? My Hobbies include Riding my bike, weightlifting, spending time with family.",

    "What is my favourite food? My favourite food is Shahi Paneer with Garlic Naan Bread",

    "What programming languages, frameworks or technologies do I know? The programming languages I know are Python, Java, a bit of C++, Javascript and SQL. I am familiar with frameworks/libraries such as React.js, Tailwind CSS, Numpy, Tensorflow. ",

    "What are my strengths? I am a very dedicated student and have a passion to learn new things. I am a strong public speaker, collaboartor and work well with others.",
    
    "What are my weaknesses? I came into Computer Science without knowing any coding. I struggle to discover new topics at times, but tackle my weakness by spending time self learning programming! ",

    "Do I have prior internship experience? I do not have any prior internship or CO-OP terms completed but I am looking for Summer 2025 roles to kickstart my career. My self learning projects and passion for learning make me a strong candidate prepared to enter the workforce! ",

    "How are you involved in the community? I volunteered for CUSA (Carleton University Students' Association) in my first year, I am currently a Partnerships Coordinator for Hack The Hill and helped to run one of the largest hackathons in Ottawa with over 800 attendees. I am also currently a TA for Discrete Math 1.",

  "Have you attended any Hackathons? Yes, I have attened uOttaHack6, Discover Technata Hacks, DreamLaunch Startup Weekend, The Defi Crunch and ENGCOMM X MONTREAL. I look forward to attending more events and conecting with others in the community.",

  "What projects have you done? All of my projects have been completed via self-learning. I have made a React Fitness Website using Restful API's as I am super passionate about fitness. I have explored React with Typescript and Tailwind CSS by making a Bookmarking Chrome Extension. My Machine Learning Projects include exploring supervised learning algorithms such as SVM (Support Vector Machines) and Logistic Regression by applying them on a Diabetes Prediction Dataset. I have also user Deep Neural Networks with the CIFAR-10 Dataset and used Convolutional Neural Networks. Check out all my projects on github: https://github.com/anshk8.",

  "Why should I be hired? I am a team leader who brings a positive attitude and encouragment to teams. With my strong work ethic, passion for learning and collaborative approach at solving complex problems, I will be an asset to your team!",

  "What year are you in? I am in my 2nd year but took Summer Classes, so i am currently enrolled in lots of third year courses.",

  "Are you in the Co-Op Program? Yes, I am enrolled in Carleton University CO-OP Program.",

  "What do you want to acomplish? I want to gain hands on experience solving real world problems that make the world a better place. I hope to learn lots, be a leader whereever I can and have a positive impact on my peers around me.",

  "What roles interest you? I am interested in roles around Data Science, AI/ML and Software Development in general!",

  "When are you available for a CO-OP Term? I am actively searching CO-OP positions for Summer 2025 and Fall 2025.",

  "What are some academic Achievements? I have maintained a high GPA of 11.7/12 and was the recipient of Tracey and Siva Ananmalay Scholarship in Computer Science from Carleton University. I was also awarded a Golden Key Honour Society Membership. ",

  "What relevent work experience do you have? I participated in Riipen Level Up Program where I worked on a divorce coaching website. My main contribution was making a assessment form which assessed client's and acted as an entry point to reccomend additional services. I used HTML/CSS, Javascript and a custom Data Storage method where I had Data sent to a Google Sheet. I am also currently a TA for Discrete Math 1.",

  "What languages do you speak? I speak fluent English, Intermediate French and fluent Hindi. I have a DELF B1 certificate for Intermediate French skills. Je veux ameliorer mes compétences en francais :)."
  
];



async function main(input) {

    //Create embedding through each line in array via OPENAI API
  await Promise.all(
    input.map(async (textChunk) => {
      
      //OpenAI Embedding function
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: textChunk
        });
      
      //Store embedding and actual text
        const data = { 
          content: textChunk, 
          embedding: embeddingResponse.data[0].embedding 
        }
        
        // Insert data into Supabase
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