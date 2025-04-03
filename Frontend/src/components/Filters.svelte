<script lang="ts">
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { aiResponse } from '../store/ollamaStore.js';
	import Ai from '../media/edit_.png';
	import { X } from 'lucide-svelte';

	let userQuery = '';
	let generatedDork = '';
	let advancedOpen = false;
	let isLoading = false; // Track loading state

	async function generateDork() {
		isLoading = true;
		generatedDork = ''; // Clear previous result
		try {
			const res = await fetch('/api/ollama-generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: `Create a Google hacking query to find information about: ${userQuery}. 
					- Only return Google Dork queries, no additional explanation or anything else.
					- Response MUST be google hacking query.
					- Format response in backticks like this:
					
					\`\`\`
					\`<GOOGLE_DORK_QUERY>\`
					\`\`\`
					`
				})
			});

			if (res.ok) {
				const data = await res.json();
				// console.log('Ollama Raw Response:', data);

				// // Ensure `data.answer` exists
				// const rawResponse = data.answer || 'No valid response received';

				// // Remove any HTML/XML-style tags
				// const cleanedResponse = rawResponse.replace(/<[^>]+>/g, '').trim();
				// console.log('Cleaned Response:', cleanedResponse);

				// // Extract content inside backticks
				// const match = cleanedResponse.match(/`([^`]+)`/);
				// generatedDork = match ? match[1] : 'No query generated, please retry';
				generatedDork = data ? data.answer : 'No query generated, please retry';

				console.log('Generated Dork:', generatedDork);
			} else {
				console.error('Error in response:', res.statusText);
				generatedDork = 'Error generating dork';
			}
		} catch (error) {
			console.error('Error fetching dork:', error);
			generatedDork = 'Error generating dork';
		} finally {
			isLoading = false;
		}
	}

	async function search() {
		const query = generatedDork;
		if (query) goto(`/results?q=${encodeURIComponent(query)}`);
	}
</script>

<form class="relative w-full max-w-2xl p-3" transition:slide on:submit|preventDefault={search}>
	<h3 class="mb-2 font-semibold text-gray-800">Describe your search</h3>
	<div class="relative">
		<textarea
			bind:value={userQuery}
			class="mb-3 w-full rounded-2xl border border-gray-300 bg-gray-50 p-3 text-gray-800 focus:ring-2 focus:ring-gray-400"
			placeholder="Find admin logins for government sites..."
			on:focus={() => (advancedOpen = true)}
			on:blur={() => setTimeout(() => (advancedOpen = false), 200)}
		></textarea>{#if advancedOpen}
			<div
				class="absolute bottom-full left-0 m-1 mt-1 w-64 rounded-md border border-gray-400 bg-white p-2 text-xs text-gray-700"
			>
				<h4 class="font-black">Advanced Search Tips</h4>
				<p>
					You can refine your search using special filters. Use <strong>"exact phrase"</strong> for
					precise matches,
					<strong>+keyword</strong> to include a word, or <strong>-keyword</strong> to exclude one.
					Focus on specific sites with <strong>site:example.com</strong> or limit results by file
					type (<strong>filetype:pdf</strong>). For precise targeting, try <strong>intitle:</strong>
					or <strong>inurl:</strong>. To filter by date, use
					<strong>before:YYYY-MM-DD</strong> and <strong>after:YYYY-MM-DD</strong>.
				</p>

				<button
					on:click={() => (advancedOpen = false)}
					class="absolute right-0 top-0 mr-2 mt-2 text-xs text-gray-600"
					><X class="h-4 w-4" /></button
				>
			</div>
		{/if}
	</div>

	<div
		class="mb-3 flex w-[40%] items-center rounded-full bg-blue-600 p-1 font-thin text-white hover:bg-blue-500 disabled:cursor-not-allowed md:w-1/4"
	>
		{#if isLoading}
			<div class=" inset-0 z-50 flex w-full items-center justify-center">
				<div
					class="m-1 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
				></div>
			</div>
		{:else}
			<img src={Ai} alt="AI Icon" class="h-10 w-10" />
			<button
				class="text-white"
				on:click={() => generateDork()}
				type="button"
				disabled={!userQuery}
			>
				Generate Query
			</button>
		{/if}
	</div>
	<p class="font-medium">Generated Query:</p>
	<input
		type="text"
		class="mb-3 w-full rounded-full border-0 border-gray-300 bg-gray-50 p-3 text-xs text-gray-800 focus:ring-0 focus:ring-blue-400"
		placeholder="AI-generated query will appear here"
		bind:value={generatedDork}
	/>
	<button
		class="w-[100px] rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed"
		disabled={!generatedDork}
		type="submit"
	>
		Search
	</button>
</form>
