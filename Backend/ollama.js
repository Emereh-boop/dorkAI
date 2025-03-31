import { runDorkAIQuery } from '../../backend/ollama.js';

export async function POST({ request }) {
   const { query } = await request.json();
   const answer = await runDorkAIQuery(query);
   return new Response(JSON.stringify({ answer }), { headers: { 'Content-Type': 'application/json' } });
}
