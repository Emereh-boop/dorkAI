<script lang="ts">
	import { goto } from '$app/navigation';
	import { X } from 'lucide-svelte';
	import { isDork } from '../store/stores';
	import { slide } from 'svelte/transition';
	import { AiEnabled } from '$lib/AiEnabled';
	import { AiDisabled } from '$lib/AIDisabled';
	import { aiResponse } from '../store/ollamaStore.js';
	import Ai from '../media/edit_.png';

	let userQuery = '';
	let generatedDork = '';
	let isExpanded = false;
	let suggestions = [];

	let fileType = '';
	let site = '';
	let dateBefore = '';
	let dateAfter = '';

	function buildQuery() {
		let query = generatedDork || userQuery;
		if (fileType) query += ` filetype:${fileType}`;
		if (site) query += ` site:${site}`;
		if (dateBefore) query += ` before:${dateBefore}`;
		if (dateAfter) query += ` after:${dateAfter}`;
		return query.trim();
	}

	async function search() {
		const query = buildQuery();
		if (query) goto(`/results?q=${encodeURIComponent(query)}`);
	}

	async function fetchSuggestions() {
		if (userQuery.length > 2) {
			try {
				const res = await fetch(`/api/suggestions?q=${encodeURIComponent(userQuery)}`);
				if (!res.ok) throw new Error('Failed to fetch suggestions');
				const data = await res.json();
				suggestions = data.suggestions;
			} catch (error) {
				console.error('Error fetching suggestions:', error);
				suggestions = [];
			}
		} else {
			suggestions = [];
		}
	}
</script>

<div class="relative flex w-full flex-col items-center gap-2 sm:w-auto">
	<div class="flex h-[60px] flex-col justify-end text-center">
		<div>
			<h1 class="px-4 text-4xl font-bold text-blue-600">DorkAI Search</h1>
			<h2 class="mb-4 px-4 text-sm text-blue-600">
				Build, customize and refine your search advancely
			</h2>
		</div>
		<div class="relative flex w-full items-end justify-center gap-2 sm:w-auto">
			<form
				transition:slide
				class="relative flex items-start transition-all duration-300 ease-in-out md:items-center"
				on:focusin={() => (isExpanded = true)}
				on:submit={(e) => (e.preventDefault(), search())}
			>
				<!-- Search Bar -->
				<input
					type="text"
					bind:value={userQuery}
					placeholder={'Search for something...'}
					class={`${isDork? '':''} w-56 rounded-full border-2 border-gray-300 p-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64 md:focus:w-96`}
					on:input={fetchSuggestions}
				/>

				<!-- Search Icon -->
				<button
					type="submit"
					class="absolute right-3 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-white shadow-md transition-all hover:bg-gray-100"
				>
					<img src="https://www.freeiconspng.com/uploads/search-icon-png-1.png" alt="search icon" />
				</button>
			</form>
			<button
				transition:slide
				on:click={() => isDork.update((val) => !val)}
				class={`relative flex h-12 w-20 items-center rounded-full  font-bold transition-colors duration-300 ease-in-out ${
					$isDork ? 'bg-blue-600 ' : 'bg-gray-600 pl-1'
				} hover:bg-blue-500`}
			>
				<div
					class={`absolute flex h-10 w-10 items-center justify-center rounded-full bg-white py-2 text-center transition-all duration-300 ease-in-out ${
						$isDork ? 'translate-x-[36px] text-blue-600' : 'translate-x-0 text-gray-600'
					}`}
				>
					{#if $isDork}
						<!-- Ai id enabled -->
						<img src={AiEnabled} alt="AI enabled icon" />
					{:else}
						<!-- Ai id disabled  -->
						<img src={AiDisabled} alt="AI disabled icon" />
					{/if}
				</div>
			</button>
		</div>
	</div>
</div>
