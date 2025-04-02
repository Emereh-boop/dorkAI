<script lang="ts">
	import Filters from './Filters.svelte';
	import { goto } from '$app/navigation';
	import SearchBar from './SearchBar.svelte';
	import { isDork } from '../store/stores';

	const dorkData = {
		dorks: [
			{ name: ' Confidential Docs', query: 'intitle:"confidential" filetype:pdf' },
			{ name: ' Admin Portals', query: 'intitle:"admin login" site:.gov' },
			{ name: ' Database Dumps', query: 'ext:sql intext:password' },
			{ name: ' Passwords & Logs', query: 'filetype:log intext:password' },
			{ name: ' Open Directories', query: 'index of / "backup.zip"' },
			{ name: ' Website Source Code', query: 'filetype:php inurl:/config/' },
			{ name: ' Financial Reports', query: 'filetype:xlsx "balance sheet"' },
			{ name: ' Leaked Images', query: 'filetype:jpg "confidential"' }
		]
	};
	async function search(query: string) {
		if (query.trim() !== '') {
			// Fetch search results from your local API
			goto(`/results?q=${encodeURIComponent(query)}`);
		}
	}
</script>

<div
	class="relative mx-auto flex h-svh max-w-2xl flex-col items-center justify-center rounded-xl"
>
	<SearchBar />
	{#if $isDork}
		<Filters />
	{/if}
	<div class="w-full mt-4 max-h-48 overflow-y-auto rounded-lg bg-gray-50/50 p-3">
		<h3 class="mb-2 font-semibold text-gray-800">Quick Dorks</h3>
		<ul class="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-4">
			{#each dorkData.dorks as dork}
				<button
					class="p- cursor-pointer rounded-lg text-sm text-blue-600 transition hover:bg-blue-50 hover:text-blue-400"
					on:click={() => {
						// selectedDork = dork.query;
						// buildQuery();
						search(dork.query);
					}}
				>
					{dork.name}
				</button>
			{/each}
		</ul>
	</div>
</div>
