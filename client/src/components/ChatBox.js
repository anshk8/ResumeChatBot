import React, { useState } from 'react';
import axios from 'axios';
import {ReactAnimatedEllipsis} from 'react-animated-ellipsis';
import LoadingDots from './LoadingDots';

const ChatBox = () => {

  //For user input, loading and displaying response
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("Please Note I am AI Ansh and SOMETIMES may be inaccurate :) ");
  const [loading, setLoading] = useState(false);

  //Connect with server
  async function sendMessage(message) {

    //Load Screen
    setLoading(true);

    //Debug Purposes
    console.log("Sending message:", message);  


    try {

      //Response from backend
        const res = await axios.post('https://resume-chat-bot-server-dhixfnhlb-anshs-projects-01f89063.vercel.app/api/message', { message });

        //Debuging log
        console.log("Received response:", res.data.result);  
        setResponse(res.data.result);
      

    } catch (error) {

      //Debuging log
        console.error("Error sending message:", error.response ? error.response.data : error.message);
        setResponse("Error sending message: " + error.message);

    } finally {

        setLoading(false);
        //Debuging log
        console.log("Loading finished");  
        
    }
}


  const handleSubmit = (e) => {
    // Prevent page refresh on form submit
    e.preventDefault();  
    if (input.trim()) {
      sendMessage(input);

      // Clear input field after sending response
      setInput("");  
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <p className="sub-heading">Ansh's Interactive Portfolio Website. Chat with me!</p>
      </div>

      {/* Response Display and Loading screen if loading */}
      <div id="insert" className="chatbot-conversation-container">
        {loading ? (
          <LoadingDots />
        ) : (
          <div className="message message-bot">{response}</div>
        )}


      </div>


      {/* User Input Form. On submit, send input to server*/}
      <form id="form" className="chatbot-input-container" onSubmit={handleSubmit}>

        {/*User input */}
        <input
          onChange={(e) => setInput(e.target.value)}
          name="user-input"
          type="text"
          id="user-input"
          value={input}
          placeholder="Chat with Ansh!"
          required
        />

        <button id="submit-btn" className="submit-btn" type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
