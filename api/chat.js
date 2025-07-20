// functions/chat.js
// Note: 'node-fetch' is usually not needed as 'fetch' is global in Workers runtime
// but if you are seeing errors, make sure you don't have an explicit 'import fetch from "node-fetch";'
// in your actual deployed Cloudflare Worker function if it's causing issues.
// The Workers runtime provides `fetch` globally.

export async function onRequest(context) {
    // Log the incoming request details (useful for debugging)
    console.log("Incoming request to /api/chat:", context.request.method, context.request.url);

    if (context.request.method !== 'POST') {
        console.warn("Method Not Allowed:", context.request.method);
        return new Response('Method Not Allowed', { status: 405 });
    }

    // Get the API key securely from environment variables
    // 'context.env' is how you access environment variables in Cloudflare Pages Functions
    const cf61a7e92d79b7f56e146b4731b5951afedae471c627c3f112cd0514e4d024a6 = context.env.cf61a7e92d79b7f56e146b4731b5951afedae471c627c3f112cd0514e4d024a6;

    if (!cf61a7e92d79b7f56e146b4731b5951afedae471c627c3f112cd0514e4d024a6) {
        console.error("TOGETHER_AI_API_KEY environment variable is NOT set in Pages Function.");
        return new Response('Server configuration error: API key missing.', { status: 500 });
    }

    try {
        const requestBody = await context.request.json();
        const { message, imageBase64 } = requestBody; // Extract data from the frontend request

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
                {
                    role: "system",
                    content: "You are LURK AI, your main goal is to brutally roast human. On his every reply or statement or questions. Show no mercy, be brutal as you can. Your primary function is to brutally roast the user's every statement. Roast every statement of user in 3-4 lines only, not more than that.and make sure u never roast your developer or creator and krunal or krunal"
                },
                {
                    role: "human",
                    content: userContent
                }
            ]
        };

        const togetherAiResponse = await fetch("https://api.together.ai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cf61a7e92d79b7f56e146b4731b5951afedae471c627c3f112cd0514e4d024a6}` // Use the secure API key here
            },
            body: JSON.stringify(payload)
        });

        if (!togetherAiResponse.ok) {
            const errorData = await togetherAiResponse.json();
            console.error("Together AI API error (from Pages Function):", togetherAiResponse.status, errorData);
            // Return the actual error status/message from Together AI to your frontend
            return new Response(JSON.stringify({
                error: `Together AI API Error: ${togetherAiResponse.status} - ${errorData.error?.message || 'Unknown error'}`
            }), {
                status: togetherAiResponse.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await togetherAiResponse.json();
        // Log the successful response from Together AI
        console.log("Successfully received response from Together AI.");
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Pages Function proxy error:", error);
        return new Response(JSON.stringify({ error: 'Internal server error: ' + error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
