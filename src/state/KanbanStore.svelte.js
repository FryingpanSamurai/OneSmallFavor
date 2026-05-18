import { writable } from 'svelte/store';
export const kanbanStoreWritable = writable({
	decks: [],
	planks: [],
	nails: [],
	completed: []
})