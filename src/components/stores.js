import { writable } from 'svelte/store';

export const showControl = writable(true);

export const navActive = writable(false);

export const showIntro = writable(false);

export const loadBabylon = writable(false);