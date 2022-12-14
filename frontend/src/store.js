import { writable } from 'svelte/store';

export const currentNote = writable(null);
export const appState = writable('editor');

// Get the value out of storage on load.
export const allNotes = writable(localStorage.allNotes || '[]');
export const currentId = writable(parseInt(localStorage.currentId) || 0);

export const current_FC_index = writable(0);
export const current_Q_index = writable(0);

export const currentTitle = writable(
  'Note ' + parseInt(localStorage.currentId || 0)
);

export const loading = writable(false);

// Anytime the store changes, update the local storage value.
allNotes.subscribe((value) => (localStorage.allNotes = value));
currentId.subscribe((value) => (localStorage.currentId = value));
