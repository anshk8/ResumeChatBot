const {openai, supabase} = require("./utils/config");

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'  
  }));

app.use(express.json())

app.post('/api/message', (req, res) => {
    const { message } = req.body;
    const modifiedMessage = `Server received: ${message}`; // Modify as needed
    res.json({ modifiedMessage });
});




// Start the server on port 5000
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});