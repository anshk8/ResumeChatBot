import React, { useState } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(message) {
    setLoading(true);
    console.log("Sending message:", message);  // Log the message being sent
    try {
        const res = await axios.post('http://localhost:5001/api/message', { message });

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
    e.preventDefault();  // Prevent page refresh on form submit
    if (input.trim()) {
      sendMessage(input);
      setInput("");  // Clear input field after sending
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <p className="sub-heading">Less Words, More Chatting! Talk with AI Ansh below!</p>
      </div>

      {/* Response Display */}
      <div id="insert" className="chatbot-conversation-container">
        {loading ? "Loading..." : response}
      </div>

      {/* User Input Form */}
      <form id="form" className="chatbot-input-container" onSubmit={handleSubmit}>
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
