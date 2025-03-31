<script lang='ts'>
	import { onMount } from 'svelte';
	let results = [];
	let loading = true;
	let error = '';
	let query = '';
	let category = '';
	let sortBy = 'relevance';
	let page = 1;
	let totalPages = 0;

	async function fetchResults() {
		loading = true;
		error = '';
		try {
			const res = await fetch(
				`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&sort=${sortBy}&page=${page}&limit=10`
			);
			const data = await res.json();
			if (data.results) {
				results = data.results;
				totalPages = data.totalPages || 1;
			} else {
				error = data.error || 'No results found.';
			}
		} catch (err) {
			error = 'Failed to fetch results.';
		}
		loading = false;
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		query = params.get('q') || '';
		category = params.get('category') || '';
		fetchResults();
	});
</script>

<div class="mx-auto min-h-screen max-w-4xl bg-white p-6">
	<h1 class="mb-4 text-lg text-gray-500">
		Search Results for <span class="font-semibold">"{query}"</span>
	</h1>

	<div class="mb-4 flex items-center justify-between border-b pb-2">
		{#if category}
			<p class="text-sm text-gray-600">Category: <strong>{category}</strong></p>
		{/if}
		<select bind:value={sortBy} on:change={fetchResults} class="rounded border p-2 text-sm">
			<option value="relevance">Sort by Relevance</option>
			<option value="recent">Sort by Most Recent</option>
		</select>
	</div>

	{#if loading}
		<div class="flex justify-center">
			<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500"></div>
		</div>
	{:else if error}
		<p class="font-semibold text-red-600">{error}</p>
	{:else}
		<div class="space-y-6">
			{#each results as result}
				<div class="pb-3">
					<div class="flex items-end gap-2">
						{#each result.thumbnail as thumbnail}
							<img src={thumbnail.src} alt="Thumbnail" class={`h-16 w-16 rounded object-cover`} />
						{/each}
						<div>
							<a href={result.url} target="_blank" class="text-sm text-gray-600 hover:underline"
								>{@html result.htmlUrl}</a
							>
							<h2>
								<a
									href={result.url}
									target="_blank"
									class="text-lg font-semibold text-blue-700 hover:underline">{result.title}</a
								>
							</h2>
						</div>
					</div>
					<p class="text-sm text-gray-700">{@html result.htmlSnippet}</p>
				</div>
			{/each}
		</div>

		<div class="mt-6 flex items-center justify-between border-t pt-4">
			<button
				on:click={() => {
					if (page > 1) {
						page--;
						fetchResults();
					}
				}}
				class="rounded-md bg-gray-200 px-4 py-2 text-sm"
				disabled={page === 1}
			>
				Previous
			</button>
			<span class="text-sm text-gray-700">Page {page} of {totalPages}</span>
			<button
				on:click={() => {
					if (page < totalPages) {
						page++;
						fetchResults();
					}
				}}
				class="rounded-md bg-gray-200 px-4 py-2 text-sm"
				disabled={page === totalPages}
			>
				Next
			</button>
		</div>
	{/if}
</div>
