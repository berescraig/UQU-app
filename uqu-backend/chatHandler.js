const fetch = require('node-fetch');

const DEEPSEEK_API_KEY = 'sk-919896e87d404edab9e0c54563decff5'; 

async function chatHandler(message, context = {}) {
  try {
    // Fetch relevant backend context
    const [organization, clubs, collectives, support] = await Promise.all([
      fetch('http://localhost:3001/api/organization').then(res => res.json()),
      fetch('http://localhost:3001/api/clubs').then(res => res.json()),
      fetch('http://localhost:3001/api/collectives').then(res => res.json()),
      fetch('http://localhost:3001/api/support-services').then(res => res.json())
    ]);

    const contextData = {
      organization,
      clubs,
      collectives,
      support,
      context
    };

    // Construct prompt
    const systemPrompt = `
You're a warm, helpful, and relaxed student assistant for UQU (University of Queensland Union).
Respond casually and clearly to student questions about clubs, food, collectives, events, programs, or anything else related to student life.

Always be warm and inclusive, especially if someone sounds down, anxious, overwhelmed, or in distress.
In those cases, briefly and kindly mention UQU's free Student Advocacy & Support services (SAS), and how they can help.

Never use markdown headers like ### — keep things simple and chatty.

Keep responses short and easy to read — just the essentials, no essays.

Here's some context to help you out:
${JSON.stringify(contextData).slice(0, 10000)} // clip to avoid token overflow
    `;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const result = await response.json();

    const reply = result.choices?.[0]?.message?.content || "Hmm, I didn’t quite get that. Want to try again?";

    return {
      response: reply,
      suggestions: [], // optional: add intent-matching later
      context_type: null
    };
  } catch (err) {
    console.error('❌ chatHandler error:', err.message);
    return {
      response: 'Ah, sorry! Something went wrong on my end. Maybe try that again in a sec?',
      suggestions: [],
      context_type: null
    };
  }
}

module.exports = chatHandler;
