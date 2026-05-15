<script>
	import Plank from "./Plank.svelte";
</script>

<div class="board-container">
	<!-- in the board, we have 'decks' which contain objectives -->
	<!-- decks are the columns of the kanban board -->
	<!-- planks map the tasks for each deck -->
	<Plank />
</div>

<style>
	.board-container {
		background-color: rgba(255, 255, 255, 0.05);
		width: 100%;
		height: calc(100vh - 64px);
		border-radius: 10px;
	}
</style>