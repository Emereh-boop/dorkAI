export async function POST({ request }) {
	const { query } = await request.json();
	console.log("Prompt:", query);
	try {
		const response = await fetch('http://localhost:11434/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: 'phi4-mini', // Custom model
				prompt: query,
				stream: false,
				// keepAlive: "30m",
				// system: "You are dorkie, an expert in crafting advanced search queries for researching and hacking"
			})
		});

		if (!response.ok) {
			throw new Error(`Ollama API error: ${response.statusText}`);
		}

		const data = await response.json();
		console.log("Ollama Response:", data);

		return new Response(JSON.stringify({ answer: data.response }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Ollama API Error:', error);
		return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
	}
}
