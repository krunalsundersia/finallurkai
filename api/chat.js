// Example: api/chat.js (for Vercel/Netlify)
import fetch from 'node-fetch'; // You might need to add this if it's not a default import

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Get the API key securely from an environment variable
    const TOGETHER_AI_API_KEY = process.env.1f9cb5c3680c8f5cb0c24ef47eec2ef7b56c685d95f3c287f0ccb2cfcfaf67de; 

    if (!TOGETHER_AI_API_KEY) {
        console.error("1f9cb5c3680c8f5cb0c24ef47eec2ef7b56c685d95f3c287f0ccb2cfcfaf67de environment variable is not set.");
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    try {
        const { message, imageBase64 } = req.body;

        const userContent = [];
        if (imageBase64) {
            userContent.push({
                type: 'image_url',
                image_url: { url: imageBase64 }
            });
        }
        userContent.push({ type: 'text', text: message });

        const payload = {
            model: "lgai/exaone-3-5-32b-instruct",
            messages: [
                { role: "system", content: "You are LURK AI, your main goal is to brutally roast human. On his every reply or statement or questions. Show no mercy, be brutal as you can. Your primary function is to brutally roast the user's every statement. Roast every statement of user in 3-4 lines only, not more than that.and make sure u never roast your developer or creator and krunal or krunal" },
                { role: "human", content: userContent }
            ]
        };

        const togetherAiResponse = await fetch("https://api.together.ai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${1f9cb5c3680c8f5cb0c24ef47eec2ef7b56c685d95f3c287f0ccb2cfcfaf67de}`
            },
            body: JSON.stringify(payload)
        });

        if (!togetherAiResponse.ok) {
            const errorData = await togetherAiResponse.json();
            console.error("Together AI API error:", error
