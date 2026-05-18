<script>
	let { plank, deck } = $props();

	import { onMount } from 'svelte';
	import { kanbanStoreWritable } from '../../state/KanbanStore.svelte';

	function createNewPlank(deck_id) {
		let newPlank = {
			id: 0,
			name:"default", 
			description:"this is some default text", 
			deck_id:deck_id, 
			status:false
		};

		// POST request
		fetch("http://localhost:3000/planks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newPlank)
		}).then(async (res) => {
			// message for success
			const result = await res.json();
			newPlank.id = result.id;
			// update the list of decks
			kanbanStoreWritable.update(currentState => {
				return {
					...currentState,
					planks: [
						newPlank,
						...currentState.planks
					]
				}
			});
		});
	}

	function completePlank(plank) {
		// PUT request to update the plank
		plank.updated_at = new Date();
		fetch(`http://localhost:3000/planks/${plank.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(plank)
		}).then((res) => {
			const result = res.json();

			// update the list of decks
			kanbanStoreWritable.update(currentState => {
				return {
					...currentState,
					completed: [
						plank,
						...currentState.completed
					]
				}
			})
		})
	}

	function updatePlank(plank) {
		console.log(plank);
		plank.updated_at = new Date();

		fetch(`http://localhost:3000/planks/${plank.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(plank)
		}).then((res) => {
			const result = res.json();

			kanbanStoreWritable.update(currentState => {
				return {
					...currentState
				}
			})
		})
	}
</script>

{#if plank.name == "new"}
<div class="new-container">
	<span class="new-plank">{plank.name}</span>
	<span class="new-icon" onclick={() => createNewPlank(deck.id)}>+</span>
</div>
{:else}
<div class="plank-container">
	<input 
		maxlength="99" 
		class="plank-content" 
		bind:value={plank.name} 
		onchange={() => 
			setTimeout(async () => 
				await updatePlank(plank), 250
		)} />
	<span class="plank-status">
		<input type="checkbox" 
			bind:checked={plank.status}
			onchange={() => completePlank(plank)}>
		<span class="checkmark"></span>
	</span>
</div>

{/if}

<style>
	.plank-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid rgb(54,56,68);
		padding: 5px;
		border-radius: 5px;
		max-width: 160px;
	}

	.new-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: rgba(120,250,120,0.03);
		border: 1px solid rgb(54,56,68);
		padding: 5px;
		border-radius: 5px;
		max-width: 80px;
		margin: auto;
		margin-top: 10px;
	}

	.plank-content {
		background-color: rgba(0,0,0,0);
		font-family: 'system';
		color: rgb(154,156,198);
		border: 0px;
		font-size: medium;
		max-width: 120px;
	}

	.plank-status {
		display: block;
		position: relative;
		cursor: pointer;
		font-size: 22px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.plank-status input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}

	/* Create a custom checkbox */
	.checkmark {
		display: flex;
		height: 15px;
		width: 15px;
		background-color: #333;
		border-radius: 5px;
		transition: 1s background-color;
	}

	/* On mouse-over, add a grey background color */
	.plank-status:hover input ~ .checkmark {
	  	background-color: rgba(255,255,255,0.2);
	}

	/* When the checkbox is checked, add a blue background */
	.plank-status input:checked ~ .checkmark {
	  	background-color: #2196F3;
	}

	/* Create the checkmark/indicator (hidden when not checked) */
	.checkmark:after {
	  	content: "";
	  	position: absolute;
	  	display: none;
	}

	/* Show the checkmark when checked */
	.plank-status input:checked ~ .checkmark:after {
	  	display: flex;
	}

	/* Style the checkmark/indicator */
	.plank-status .checkmark:after {
	  left: 9px;
	  top: 5px;
	  width: 5px;
	  height: 10px;
	  border: solid white;
	  border-width: 0 3px 3px 0;
	  -webkit-transform: rotate(45deg);
	  -ms-transform: rotate(45deg);
	  transform: rotate(45deg);
	}

	.new-plank {
		width: 25px;
	}

	.new-icon {
		text-align: center;
		font-size: large;
		font-style: bold;
		font-family: monospace;
		color: silver;
		border: 1px solid rgba(255,255,255,0.3);
		border-radius: 5px;
		min-width: 17px;
		transition: background-color 1s;
	}

	.new-icon:hover {
		background-color: rgba(255,255,255,0.1);
		cursor: pointer;
	}
</style>