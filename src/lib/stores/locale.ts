import { writable, derived } from 'svelte/store';
import type { Locale } from '../types';
import { messages } from '../i18n';

function createLocaleStore() {
	const stored =
		typeof localStorage !== 'undefined' ? (localStorage.getItem('argos-locale') as Locale | null) : null;
	const navLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
	const initial: Locale = stored ?? (navLang.startsWith('id') ? 'id' : 'en');

	const { subscribe, set, update } = writable<Locale>(initial);

	function persist(value: Locale) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('argos-locale', value);
		}
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('lang', value);
		}
	}

	persist(initial);

	return {
		subscribe,
		set: (value: Locale) => {
			persist(value);
			set(value);
		},
		toggle: () =>
			update((current) => {
				const next: Locale = current === 'en' ? 'id' : 'en';
				persist(next);
				return next;
			})
	};
}

export const locale = createLocaleStore();

/** Reactive dictionary of UI strings for the current locale. Use as `$t.someKey`. */
export const t = derived(locale, ($locale) => messages[$locale]);
