<script>
	import { kanbanStoreWritable } from '../../state/KanbanStore.svelte';
</script>

<!-- Side Bar will hold completed items -->

<div class="sidebar-container">
	<h6>Completed</h6>
	<div class="complete-container">
	{#each $kanbanStoreWritable.completed as c}
		<!-- completed nails and planks, by date -->
		<span class="navitem">{c.name}</span>
	{/each}
	</div>
</div>

<style>
	h6 {
		color: slateblue;
		text-align: center;
	}

	.complete-container {
		display: flex;
		flex-direction: column;
		min-width: 100px;
		height: 60%;
		padding-left: 10px;
		overflow-y: scroll;
	}

	.navitem {
		color: #444;
		min-height: 20px;
		text-wrap: nowrap;
		text-overflow: ellipsis;
		max-width: 80px;
		overflow: hidden;
	}
</style>