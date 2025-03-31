<script>
	export let query = "";
</script>

<div class="m-4 p-3  bg-white rounded-lg text-black text-base">
	<p class="font-medium">Generated Query:</p>
	<input
		type="text"
		class="w-full p-2 rounded-md border border-gray-300 bg-gray-50 text-gray-800 mb-3 focus:ring-2 focus:ring-blue-400"
		placeholder="Enter keyword (e.g. confidential, admin, report)"
		bind:value={query}
	/>
	<!-- <p class="text-blue-600 break-all">{query || "No query generated yet..."}</p> -->
</div>
