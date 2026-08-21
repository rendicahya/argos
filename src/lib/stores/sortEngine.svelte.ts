import type { AlgorithmId, SortStep, CodeLang } from '../types';
import { algorithms } from '../algorithms';

function randomValues(count: number, min = 5, max = 99): number[] {
	return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

class SortEngine {
	algorithmId = $state<AlgorithmId>('bubble');
	values = $state<number[]>(randomValues(10));
	steps = $state<SortStep[]>([]);
	stepIndex = $state(0);
	playing = $state(false);
	speed = $state(5);
	codeLang = $state<CodeLang>('java');

	private timer: ReturnType<typeof setInterval> | null = null;

	constructor() {
		this.regenerate();
	}

	get algorithm() {
		return algorithms[this.algorithmId];
	}

	get currentStep(): SortStep | undefined {
		return this.steps[this.stepIndex];
	}

	get totalSteps() {
		return this.steps.length;
	}

	get isAtEnd() {
		return this.stepIndex >= this.steps.length - 1;
	}

	get isAtStart() {
		return this.stepIndex <= 0;
	}

	get progress() {
		if (this.steps.length <= 1) return 0;
		return this.stepIndex / (this.steps.length - 1);
	}

	get minValue() {
		return this.values.length ? Math.min(...this.values) : 0;
	}

	get maxValue() {
		return this.values.length ? Math.max(...this.values) : 1;
	}

	setValues(values: number[]) {
		this.values = values;
		this.regenerate();
	}

	randomize(count: number, min = 5, max = 99) {
		this.setValues(randomValues(count, min, max));
	}

	setAlgorithm(id: AlgorithmId) {
		if (this.algorithmId === id) return;
		this.algorithmId = id;
		this.regenerate();
	}

	regenerate() {
		this.pause();
		try {
			this.steps = this.algorithm.generate(this.values);
		} catch (e) {
			console.error('Failed to generate steps', e);
			this.steps = [];
		}
		this.stepIndex = 0;
	}

	goTo(index: number) {
		this.stepIndex = Math.max(0, Math.min(index, this.steps.length - 1));
	}

	stepForward() {
		if (this.stepIndex < this.steps.length - 1) {
			this.stepIndex++;
		} else {
			this.pause();
		}
	}

	stepBack() {
		if (this.stepIndex > 0) {
			this.stepIndex--;
		}
	}

	reset() {
		this.pause();
		this.stepIndex = 0;
	}

	play() {
		if (this.playing) return;
		if (this.isAtEnd) this.stepIndex = 0;
		this.playing = true;
		const tick = () => {
			if (this.stepIndex >= this.steps.length - 1) {
				this.pause();
				return;
			}
			this.stepIndex++;
			const delay = 1050 - this.speed * 90;
			this.timer = setTimeout(tick, Math.max(150, delay));
		};
		const delay = 1050 - this.speed * 90;
		this.timer = setTimeout(tick, Math.max(150, delay));
	}

	pause() {
		this.playing = false;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	togglePlay() {
		if (this.playing) this.pause();
		else this.play();
	}
}

export const sortEngine = new SortEngine();
