import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const userProfile = writable(null);
