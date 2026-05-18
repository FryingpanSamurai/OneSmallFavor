<script>
	import { onMount } from 'svelte';
	import { kanbanStoreWritable } from '../../state/KanbanStore.svelte';
	import Plank from '../Plank/Plank.svelte';

	let { deck } = $props();
	let { confirmDelete } = $state(false);
	let x = $state();
	let y = $state();
	let modal;
	let offsetX;
	let offsetY;

	function createNewDeck() {
		const newDeck = {
			id: 0,
			name:"default", 
			description:"this is some default text"
		};

		// POST request to insert new deck
		fetch("http://localhost:3000/decks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newDeck)
		}).then(async (res) => {
			// message for success and update id of component
			const result = await res.json();
			newDeck.id = result.id;

			// update the list of decks
			kanbanStoreWritable.update(currentState => {
				return {
					...currentState,
					decks: [
						newDeck,
						...currentState.decks
					]
				}
			})
		});
	}

	function deleteDeck() {
		const updatedDeckList = $kanbanStoreWritable.decks.filter(d => d.id != deck.id) ?? [];

		const updatedCompleted = updatedDeckList.filter(d => d.status == true) ?? [];

		fetch(`http://localhost:3000/decks/${deck.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(deck)
		}).then((res) => {
			const result = res.json();

			kanbanStoreWritable.update(currentState => {
				return {
					...currentState,
					decks: updatedDeckList,

				}
			})
		})

		confirmDelete = !confirmDelete;
	}

	function startDrag(e) {
		modal.dragged = true;
		offsetX = event.clientX - modal.offsetLeft;
  		offsetY = event.clientY - modal.offsetTop;
	}

	function dragModal(e) {
		if (modal.dragged) {
			x = event.clientX - offsetX;
			y = event.clientY - offsetY;
			modal.style.left = `${x}px`;
  			modal.style.top = `${y}px`;
		}
	}

	function endDrag(e) {
		modal.dragged = false;
	}
</script>

{#if confirmDelete}
<div class="delete-modal" 
	draggable
	bind:this={modal}
	onmousedown={(e) => startDrag(e)}
	onmousemove={(e) => dragModal(e)}
	onmouseup={(e) => endDrag(e)}>
	<section class="modal-header">
		<span class="modal-header-content">
			<span class="modal-header-icon">
				{@html '&#9888;'}
			</span>
			<span class="modal-title">
				CONFIRM - Delete?
			</span>
		</span>
		<div class="modal-options">
			<button class="modal-min" disabled>
				<span>{@html '&#95;'}</span>
			</button>
			<button class="modal-max" disabled>
				<span>{@html '&#9723;'}</span>
			</button>
			<button 
				class="modal-close"
				onclick={() => confirmDelete = !confirmDelete}>
				<span>{@html '&#128937;'}</span>
			</button>
		</div>
	</section>
	<section class="modal-body">
		<span class="modal-message">
			<p>{@html '&#9888;'}Confirm deleting {deck.name}</p>
		</span>
	</section>
	<section class="modal-footer">
		<button class="cancel-btn" onclick={() => confirmDelete = !confirmDelete}>Cancel</button>
		<button class="confirm-btn" onclick={() => deleteDeck()}>OK</button>
	</section>
</div>
{/if}


{#if deck.name == "new"}
	<div class="new-container">
		<section class="deck-header">{deck.description}</section>
		<section class="new-footer" onclick={() => createNewDeck()}>+++</section>
	</div>
{:else}
	<div class="deck-container">
		<input 
			maxlength="49" 
			class="deck-header" 
			bind:value={deck.name} 
			onchange={() => 
				setTimeout(async () => 
					await updateDeck(deck), 250
			)} />
		<section class="deck-body">
			{#each $kanbanStoreWritable.planks as plank}
				<!-- map planks to their decks and only grab those that are not complete, don't forget the newPlank -->
				{#if (plank.deck_id == deck.id && plank.status == false) || plank.name == "new"}
				 	<Plank {plank} {deck} />
				{/if}
			{/each}
		</section>
		<section class="deck-footer">
			<span 
				class="delete-deck"
				onclick={() => confirmDelete = !confirmDelete}>
				{@html '&#128937'}
			</span>
		</section>
	</div>
{/if}

<style>
	@font-face {
		font-family: w95fa;
		src: url(w95f.woff);
	}

	.delete-modal {
		z-index: 10;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 40%;
		top: 20px;
		width: 300px;
		height: 150px;
		background-color: #BBB;
		padding: 2px;
		border-top: 1px solid rgba(255,255,255,0.6);
		border-left: 1px solid rgba(255,255,255,0.6);
		border-right: 1px solid #333;
		border-bottom: 1px solid #333;
		border-radius: 1px;
		font-family: w95fa;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 15px;
		background-color: navy;
		padding:1px;
	}

	.modal-header:hover {
		cursor: all-scroll;
	}

	.modal-header-icon {
		color: red;
		font-size: 8pt;
		padding:1px;
	}

	.modal-header-content {
		display: flex;

	}

	.modal-title {
		display: flex;
		align-items: center;
		font-family:w95fa;
		font-size:x-small;
		color: white;
	}

	.modal-options {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-right: 1px;
		gap: 1px;
	}

	.modal-options button {
		padding: 0;
		background-color: #CCC;
	}

	.modal-options button:hover {
		cursor: pointer;
	}

	.modal-min, .modal-close, .modal-max {
		width: 13px;
		height: 12px;
		border-radius: 0;
		font-size: 8pt;
	}

	.modal-min>span, .modal-max>span, .modal-close>span {
		display: block;
		position: relative;
		top: -4px;
	}

	.modal-max>span {
		top:-3px;
		font-size: 7pt;
	}

	.modal-body {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		padding: 10px;
		gap: 3px;
	}

	.modal-footer>button {
		border-radius: 1px;
		background-color: #CCC;
		border-top: 1px solid beige;
		border-left: 1px solid beige;
		font-family: w95fa;
		padding: 3px;
		min-width: 75px;
	}

	.modal-footer>button:hover {
		cursor: pointer;
	}


	.new-container {
		display: flex;
		flex-direction: column;
		max-width: 150px;
		padding: 10px;
		background-image: linear-gradient(to bottom, rgba(48,52,68,0.3), rgba(98,120,150,0.3));
		border-radius: 10px;
		border: 1px solid rgb(54,56,68);
		color: rgb(154,156,198);
		max-height: 80px;
	}

	.deck-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		max-width: 150px;
		padding: 10px;
		background-image: linear-gradient(to top, rgba(34,36,48,0.3), rgba(55,55,55,0.3));
		border-radius: 10px;
		border: 1px solid rgb(54,56,68);
		color: rgb(154,156,198);
	}

	.deck-header {
		text-align: center;
		padding:10px;
		flex-grow: 0;
		background-color: rgba(0, 0, 0, 0.0);
		border:0;
		font-family: w95fa;
		font-size: large;
		color: rgb(154,156,198);
	}

	.deck-body {
		height: 100%;
	}

	.deck-footer {
		display: flex;
		justify-content: flex-end;
	}

	.delete-deck {
		border: 1px solid rgb(77,88,99);
		background-image: linear-gradient(to top, rgba(56,64,78,0.1), rgba(64,64,68,0.5));
		width: 100%;
		height: 25px;
		border-radius: 5px;
		transition: background-color 1s, color 1s;
		text-align: center;
	}

	.delete-deck:hover {
		background-color: rgba(120,76,52,0.3);
		cursor: pointer;
		color: crimson;
	}

	.new-footer {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		border: 1px solid rgb(77,88,99);
		border-radius: 5px;
		transition: background-color 1s;
	}

	.new-footer:hover {
		background-color: rgba(125,255,125,0.1);
		cursor: pointer;
	}
</style>