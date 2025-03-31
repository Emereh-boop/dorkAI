<script lang="ts">
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { aiResponse } from '../store/ollamaStore.js';
	import Ai from '../media/edit_.png';

	export let query = '';

	let fileType = '';
	let site = '';
	let keyword = '';
	let selectedDork = '';

	function buildQuery() {
		let newQuery = '';

		if (selectedDork) {
			newQuery = selectedDork; // If a dork is selected, start with it
		}

		if (keyword) newQuery += ` "${keyword}"`;
		if (fileType) newQuery += ` filetype:${fileType}`;
		if (site) newQuery += ` site:${site}`;

		query = newQuery.trim();
	}
	async function search(query: string) {
		if (query.trim() !== '') {
			// Fetch search results from your local API
			goto(`/results?q=${encodeURIComponent(query)}`);
		}
	}
	async function askDorkAI(prompt: string) {
		const res = await fetch('/api/ollama', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt })
		});
		const data = await res.json();
		aiResponse.set(data.answer);
	}
</script>

<form
	class="w-full max-w-2xl p-3"
	transition:slide
	on:submit={(event) => {
		event.preventDefault();
		search(query);
	}}
>
	<h3 class="mt-4 font-semibold text-gray-800">Choose Filters</h3>

	<input
		type="text"
		class="mb-3 w-full rounded-full border border-gray-300 bg-gray-50 p-3 text-gray-800 focus:ring-2 focus:ring-gray-400"
		placeholder="Enter keyword (e.g. confidential, admin, report)"
		bind:value={keyword}
		on:input={buildQuery}
	/>

	<div class="flex w-full gap-2">
		<div class="w-1/2">
			<h3 class="mt-2 font-semibold text-gray-800">Select file type</h3>
			<select
				bind:value={fileType}
				on:change={buildQuery}
				class="mb-3 w-full rounded-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 focus:ring-2 focus:ring-gray-400"
			>
				<option value=""> Select File Type</option>
				<optgroup label="📄 Documents">
					<option value="pdf"> PDF</option>
					<option value="docx"> Word (DOCX)</option>
					<option value="doc"> Word (DOC)</option>
					<option value="rtf"> Rich Text (RTF)</option>
					<option value="odt"> OpenDocument (ODT)</option>
				</optgroup>
				<optgroup label=" Spreadsheets">
					<option value="xlsx"> Excel (XLSX)</option>
					<option value="xls"> Excel (XLS)</option>
					<option value="csv"> CSV</option>
					<option value="ods"> OpenDocument Spreadsheet (ODS)</option>
				</optgroup>
				<optgroup label="📽 Presentations">
					<option value="pptx">PowerPoint (PPTX)</option>
					<option value="ppt"> PowerPoint (PPT)</option>
					<option value="odp"> OpenDocument Presentation (ODP)</option>
				</optgroup>
			</select>
		</div>

		<div class="w-1/2">
			<h3 class="mt-2 font-semibold text-gray-800">Select site</h3>
			<input
				type="text"
				class="mb-3 w-full rounded-full border border-gray-300 bg-gray-50 p-3 text-gray-800 focus:ring-2 focus:ring-gray-400"
				placeholder="Enter site (e.g. example.com)"
				bind:value={site}
				on:input={buildQuery}
			/>
		</div>
	</div>
	<div
		class="mb-3 flex w-1/4 items-center rounded-full bg-blue-600 p-2 font-thin text-white hover:bg-blue-500 disabled:cursor-not-allowed"
	>
		<img src={Ai} alt="AI Icon" class="h-10 w-10" />
		<button
			class="text-white"
			disabled={!query}
			on:click={() => askDorkAI(`generate a google dorking query for this purpose input${query}`)}
			type="submit">Generate Dork</button
		>
	</div>

	<p class="font-medium">Generated Query:</p>
	<input
		type="text"
		class="mb-3 w-full rounded-full border-0 border-gray-300 bg-gray-50 p-3 text-gray-800 focus:ring-0 focus:ring-blue-400"
		placeholder="Generated query will appear here"
		bind:value={$aiResponse}
	/>

	<button
		class="w-[100px] rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed"
		disabled={!query}
		type="submit"
	>
		Search
	</button>
</form>
