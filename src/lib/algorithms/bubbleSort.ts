import type { AlgorithmDef, SortStep, NodeRole } from '../types';
import { initElems, snapshotRow, StepBuilder } from './_shared';

const java = [
	'public static void bubbleSort(int[] arr) {',
	'    int n = arr.length;',
	'    for (int i = 0; i < n - 1; i++) {',
	'        boolean swapped = false;',
	'        for (int j = 0; j < n - i - 1; j++) {',
	'            if (arr[j] > arr[j + 1]) {',
	'                int temp = arr[j];',
	'                arr[j] = arr[j + 1];',
	'                arr[j + 1] = temp;',
	'                swapped = true;',
	'            }',
	'        }',
	'        if (!swapped) break;',
	'    }',
	'}'
];

const python = [
	'def bubble_sort(arr):',
	'    n = len(arr)',
	'    for i in range(n - 1):',
	'        swapped = False',
	'        for j in range(n - i - 1):',
	'            if arr[j] > arr[j + 1]:',
	'                arr[j], arr[j + 1] = arr[j + 1], arr[j]',
	'                swapped = True',
	'        if not swapped:',
	'            break'
];

function generate(values: number[]): SortStep[] {
	const sb = new StepBuilder();
	const arr = initElems(values);
	const n = arr.length;
	const sorted = new Set<string>();

	const roles = (extra: Record<string, NodeRole> = {}) => {
		const r: Record<string, NodeRole> = {};
		for (const id of sorted) r[id] = 'sorted';
		Object.assign(r, extra);
		return r;
	};

	sb.push([1, 2], [1, 2], 'Array awal sebelum diurutkan.', snapshotRow(arr, roles()));

	if (n <= 1) {
		arr.forEach((e) => sorted.add(e.id));
		sb.push([], [], 'Array sudah terurut (kurang dari 2 elemen).', snapshotRow(arr, roles()));
		return sb.steps;
	}

	for (let i = 0; i < n - 1; i++) {
		let swappedAny = false;
		sb.push([3, 4], [3, 4], `Mulai pass ke-${i + 1}.`, snapshotRow(arr, roles()));
		for (let j = 0; j < n - i - 1; j++) {
			const a = arr[j];
			const b = arr[j + 1];
			sb.push(
				[5, 6],
				[5, 6],
				`Bandingkan elemen indeks ${j} (${a.value}) dengan indeks ${j + 1} (${b.value}).`,
				snapshotRow(arr, roles({ [a.id]: 'compare', [b.id]: 'compare' }))
			);
			if (a.value > b.value) {
				arr[j] = b;
				arr[j + 1] = a;
				swappedAny = true;
				sb.push(
					[7, 8, 9, 10],
					[7, 8],
					`Tukar posisi karena ${a.value} > ${b.value}.`,
					snapshotRow(arr, roles({ [a.id]: 'swap', [b.id]: 'swap' }))
				);
			}
		}
		sorted.add(arr[n - 1 - i].id);
		sb.push(
			[13],
			[9, 10],
			`Elemen indeks ${n - 1 - i} (${arr[n - 1 - i].value}) sudah pada posisi akhirnya.`,
			snapshotRow(arr, roles())
		);
		if (!swappedAny) {
			arr.forEach((e) => sorted.add(e.id));
			sb.push([13], [9, 10], 'Tidak ada penukaran pada pass ini, array sudah terurut.', snapshotRow(arr, roles()));
			break;
		}
	}
	arr.forEach((e) => sorted.add(e.id));
	sb.push([15], [], 'Selesai! Array sudah terurut.', snapshotRow(arr, roles()));
	return sb.steps;
}

export const bubbleSort: AlgorithmDef = {
	id: 'bubble',
	name: 'Bubble Sort',
	shortDescription: 'Membandingkan pasangan elemen bersebelahan dan menukarnya berulang kali hingga terurut.',
	layout: 'row',
	timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
	spaceComplexity: 'O(1)',
	java,
	python,
	generate
};
