/* ════════════════════════════════════════════════════════════════════════════
 * MEDULLA AI – GPT API PROXY
 * 
 * ⚠️ THIS IS NOT FOR GITHUB PAGES!
 * Deploy this as a serverless function on:
 * - Vercel Edge Functions
 * - Cloudflare Workers
 * - Netlify Functions
 * - AWS Lambda
 * 
 * This keeps your OpenAI API key secure on the server.
 * ════════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// OPTION 1: VERCEL EDGE FUNCTION
// File: /api/chat.js (in Vercel project)
// ═══════════════════════════════════════════════════════════════════════════

/*
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { message, history, user } = await req.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Set in Vercel dashboard
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Medulla AI, an intelligent assistant by AK Industries.
          Speak naturally in Hinglish (Hindi + English mix).
          Be friendly, confident, and helpful.
          Focus on: Tech, Programming, Cybersecurity, Linux, Career guidance.
          User's name is: ${user}`
        },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  const data = await response.json();
  
  return new Response(JSON.stringify({
    response: data.choices?.[0]?.message?.content || 'Error generating response'
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Or your specific domain
    }
  });
}
*/


// ═══════════════════════════════════════════════════════════════════════════
// OPTION 2: CLOUDFLARE WORKER
// ═══════════════════════════════════════════════════════════════════════════

/*
export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { message, history, user } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}` // Set in CF dashboard
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Medulla AI by AK Industries. Speak Hinglish naturally. Help with tech, coding, cybersecurity. User: ${user}`
          },
          ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      response: data.choices?.[0]?.message?.content || 'Error'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
*/


// ═══════════════════════════════════════════════════════════════════════════
// OPTION 3: NETLIFY FUNCTION
// File: /netlify/functions/chat.js
// ═══════════════════════════════════════════════════════════════════════════

/*
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { message, history, user } = JSON.parse(event.body);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are Medulla AI. Speak Hinglish. Help with tech. User: ${user}` },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      response: data.choices?.[0]?.message?.content || 'Error'
    })
  };
};
*/


// ═══════════════════════════════════════════════════════════════════════════
// DEPLOYMENT INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/*
STEP 1: Choose a platform (Vercel recommended - free tier available)

STEP 2: Create a new project and add the function code above

STEP 3: Set environment variable:
        OPENAI_API_KEY = sk-your-api-key-here

STEP 4: Deploy and get your function URL:
        Example: https://your-project.vercel.app/api/chat

STEP 5: Update Medulla AI config.js:
        GPT_API_ENABLED: true,
        GPT_API_ENDPOINT: "https://your-project.vercel.app/api/chat"

STEP 6: Redeploy your GitHub Pages site

That's it! Medulla AI will now use GPT for responses.
*/

console.log("This file is documentation only. Do not include in GitHub Pages deployment.");
