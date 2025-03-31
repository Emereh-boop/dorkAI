<script>
	export let results = [];
	export let loading = false;
</script>

<div class="mt-4">
	{#if loading}
		<p class="text-gray-500">Searching...</p>
	{:else if results.length === 0}
		<p class="text-gray-500">No results found.</p>
	{:else}
		<ul class="space-y-2">
			{#each results as result}
				<li class="border-b p-2">
					<a href={result.url} target="_blank" class="text-blue-500 hover:underline">
						{result.title}
					</a>
					<p class="text-sm text-gray-500">{result.snippet}</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>
