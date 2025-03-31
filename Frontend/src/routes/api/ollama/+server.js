// import * as Ollama from 'ollama';

// export async function POST({ request }) {
//   const { query } = await request.json();

//   try {
//       const response = await Ollama.chat({
//           model: 'deepseek-r1:7b',
//           messages: [{ role: 'user', content: query }],
//       });

//       return new Response(JSON.stringify({ answer: response.message.content }), {
//           headers: { 'Content-Type': 'application/json' },
//       });
//   } catch (error) {
//       console.error('Ollama Error:', error);
//       return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
//   }
// }
export async function POST({ request }) {
  const { query } = await request.json();

  try {
      const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              model: 'deepseek-r1:7b',
              prompt: query,
              stream: false
          })
      });

      if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify({ answer: data.response }), {
          headers: { 'Content-Type': 'application/json' }
      });

  } catch (error) {
      console.error('Ollama API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
  }
}
