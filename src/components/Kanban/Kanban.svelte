<script>
	import Deck from "../Deck/Deck.svelte";

	import { onMount } from 'svelte';
	import { kanbanStoreWritable } from '../../state/KanbanStore.svelte';
	let newDeck = {
		name:'new',
		description:'create a new deck'
	};
	let newPlank = {
		name: "new",
		description: "My new plank."
	}

	onMount(async () => {
		let completed = [];
		const decks_resp = await fetch("http://localhost:3000/decks");
		let decks = await decks_resp.json();
		decks = decks.rows;
		
		const planks_resp = await fetch("http://localhost:3000/planks");
		let planks = await planks_resp.json();
		planks = planks.rows;
		planks.forEach((p) => {
			p.status == true ? completed.push(p) : ""
		});

		const nails_resp = await fetch("http://localhost:3000/nails");
		let nails = await nails_resp.json();
		nails = nails.rows;
		nails.forEach((n) => {
			n.status == true ? completed.push(n) : ""
		});


		kanbanStoreWritable.update(currentState => {
			return {
				...currentState,
				decks: decks,
				planks: planks,
				nails: nails,
				completed: completed
			}
		});

		decks.push(newDeck);
		planks.push(newPlank);
	})
</script>

<div class="board-container">
	<!-- in the board, we have 'decks' which contain objectives -->
	<!-- decks are the columns of the kanban board -->
	<!-- planks map the tasks for each deck -->
	{#each $kanbanStoreWritable.decks as deck}
		<Deck {deck} />
	{/each}
</div>

<style>
	.board-container {
		background-color: rgba(255, 255, 255, 0.05);
		display: flex;
		width: 100%;
		border-radius: 10px 0 0 0;
		gap: 10px;
		padding: 10px;
		overflow-x: scroll;
	}
</style>