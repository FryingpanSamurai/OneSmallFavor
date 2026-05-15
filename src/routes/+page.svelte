<script>
	import SideBar from '../components/SideBar.svelte';
	import TopBar from '../components/TopBar.svelte';
	import CyberDeck from '../components/CyberDeck.svelte';
</script>

<div class="page-container">
	<!-- top bar -->
	<TopBar />
	<div class="board-and-bar">
		<!-- side nav -->
		<SideBar />
		<!-- board container -->
		<CyberDeck />
			<!-- columns for todo, doing, done -->
				<!-- Tasks will populate the columns -->
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
	}
</style>