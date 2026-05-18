<script>
	import SideBar from '../components/Nav/SideBar.svelte';
	import TopBar from '../components/Nav/TopBar.svelte';
	import Kanban from '../components/Kanban/Kanban.svelte';
</script>

<div class="page-container">
	<!-- top bar -->
	<TopBar />
	<div class="board-and-bar">
		<!-- side nav -->
		<SideBar />
		<!-- board container -->
		<Kanban />
	</div>
</div>

<style>
	.page-container {
		height: 100%;
		width: 100%;
		background-color: rgb(12,14,22);
	}

	.board-and-bar {
		display: flex;
		height: calc(100% - 64px);
	}
</style>