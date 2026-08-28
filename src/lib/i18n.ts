import type { Locale } from './types';

export interface UiMessages {
	appTagline: string;
	themeToggle: string;
	langToggle: string;
	langName: string;

	algorithmsHeading: string;
	best: string;
	average: string;
	worst: string;
	space: string;

	dataHeading: string;
	randomCountLabel: string;
	shuffle: string;
	manualLabel: string;
	manualPlaceholder: string;
	apply: string;
	errInvalidNumbers: string;
	errCountRange: string;

	animationHeading: string;
	restart: string;
	stepBack: string;
	stepForward: string;
	play: string;
	pause: string;
	speed: string;
	stepLabel: string;

	emptyHint: string;

	resetView: string;
	resetViewTitle: string;

	codeHeading: string;
	copy: string;
	copied: string;
	copyCodeTitle: string;
	fontIncrease: string;
	fontDecrease: string;
	closePanel: string;
	openPanel: string;
	resizeHandle: string;
}

export const messages: Record<Locale, UiMessages> = {
	en: {
		appTagline: 'Sorting Algorithm Visualizer',
		themeToggle: 'Toggle light/dark theme',
		langToggle: 'Switch language',
		langName: 'EN',

		algorithmsHeading: 'Algorithms',
		best: 'Best',
		average: 'Avg',
		worst: 'Worst',
		space: 'Space',

		dataHeading: 'Data',
		randomCountLabel: 'Random element count (2–30)',
		shuffle: '🎲 Shuffle',
		manualLabel: 'Manual values (comma-separated)',
		manualPlaceholder: 'e.g. 5, 3, 8, 1, 9',
		apply: 'Apply',
		errInvalidNumbers: 'Enter valid numbers, separated by commas.',
		errCountRange: 'The number of elements must be between 2 and 30.',

		animationHeading: 'Animation Controls',
		restart: 'Restart from the beginning',
		stepBack: 'Step back',
		stepForward: 'Step forward',
		play: 'Play',
		pause: 'Pause',
		speed: 'Speed',
		stepLabel: 'Step',

		emptyHint: 'Choose an algorithm and press Shuffle or Apply to begin.',

		resetView: 'Reset view',
		resetViewTitle: 'Return to the initial camera angle',

		codeHeading: 'Code',
		copy: 'Copy',
		copied: 'Copied!',
		copyCodeTitle: 'Copy code',
		fontIncrease: 'Increase font size',
		fontDecrease: 'Decrease font size',
		closePanel: 'Close code panel',
		openPanel: 'Open code panel',
		resizeHandle: 'Resize panel'
	},
	id: {
		appTagline: 'Visualisasi Algoritma Sorting',
		themeToggle: 'Ganti tema terang/gelap',
		langToggle: 'Ganti bahasa',
		langName: 'ID',

		algorithmsHeading: 'Algoritma',
		best: 'Terbaik',
		average: 'Rerata',
		worst: 'Terburuk',
		space: 'Ruang',

		dataHeading: 'Data',
		randomCountLabel: 'Jumlah data acak (2–30)',
		shuffle: '🎲 Acak',
		manualLabel: 'Nilai manual (pisahkan dengan koma)',
		manualPlaceholder: 'mis. 5, 3, 8, 1, 9',
		apply: 'Terapkan',
		errInvalidNumbers: 'Masukkan angka yang valid, dipisahkan koma.',
		errCountRange: 'Jumlah data harus antara 2 dan 30.',

		animationHeading: 'Kontrol Animasi',
		restart: 'Ulang dari awal',
		stepBack: 'Langkah mundur',
		stepForward: 'Langkah maju',
		play: 'Putar',
		pause: 'Jeda',
		speed: 'Kecepatan',
		stepLabel: 'Langkah',

		emptyHint: 'Pilih algoritma dan tekan Acak atau Terapkan untuk memulai.',

		resetView: 'Atur ulang tampilan',
		resetViewTitle: 'Kembalikan sudut pandang awal',

		codeHeading: 'Kode',
		copy: 'Salin',
		copied: 'Tersalin!',
		copyCodeTitle: 'Salin kode',
		fontIncrease: 'Perbesar ukuran font',
		fontDecrease: 'Perkecil ukuran font',
		closePanel: 'Tutup panel kode',
		openPanel: 'Buka panel kode',
		resizeHandle: 'Ubah lebar panel'
	}
};
