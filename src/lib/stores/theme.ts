import { writable } from 'svelte/store';
import type { ThemeMode } from '../types';

function createThemeStore() {
	const stored = typeof localStorage !== 'undefined' ? (localStorage.getItem('argos-theme') as ThemeMode | null) : null;
	const prefersDark = typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
	const initial: ThemeMode = stored ?? (prefersDark ? 'dark' : 'light');

	const { subscribe, set, update } = writable<ThemeMode>(initial);

	function apply(mode: ThemeMode) {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', mode);
		}
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('argos-theme', mode);
		}
	}

	apply(initial);

	return {
		subscribe,
		toggle: () => update((m) => {
			const next = m === 'light' ? 'dark' : 'light';
			apply(next);
			return next;
		}),
		set: (mode: ThemeMode) => {
			apply(mode);
			set(mode);
		}
	};
}

export const theme = createThemeStore();
