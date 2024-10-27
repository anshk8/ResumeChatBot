const OpenAI = require('openai');
const { createClient } = require("@supabase/supabase-js");
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/** OpenAI config */
if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

/** Supabase config */
const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
const supabase = createClient(url, privateKey);

module.exports = { openai, supabase };
