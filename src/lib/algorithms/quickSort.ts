import type { AlgorithmDef, SortStep, NodeRole } from '../types';
import { initElems, snapshotRow, StepBuilder } from './_shared';

const java = [
	'public static void quickSort(int[] arr, int low, int high) {',
	'    if (low < high) {',
	'        int pivotIndex = partition(arr, low, high);',
	'        quickSort(arr, low, pivotIndex - 1);',
	'        quickSort(arr, pivotIndex + 1, high);',
	'    }',
	'}',
	'',
	'private static int partition(int[] arr, int low, int high) {',
	'    int pivot = arr[high];',
	'    int i = low - 1;',
	'    for (int j = low; j < high; j++) {',
	'        if (arr[j] < pivot) {',
	'            i++;',
	'            int temp = arr[i];',
	'            arr[i] = arr[j];',
	'            arr[j] = temp;',
	'        }',
	'    }',
	'    int temp = arr[i + 1];',
	'    arr[i + 1] = arr[high];',
	'    arr[high] = temp;',
	'    return i + 1;',
	'}'
];

const python = [
	'def quick_sort(arr, low, high):',
	'    if low < high:',
	'        pivot_index = partition(arr, low, high)',
	'        quick_sort(arr, low, pivot_index - 1)',
	'        quick_sort(arr, pivot_index + 1, high)',
	'',
	'def partition(arr, low, high):',
	'    pivot = arr[high]',
	'    i = low - 1',
	'    for j in range(low, high):',
	'        if arr[j] < pivot:',
	'            i += 1',
	'            arr[i], arr[j] = arr[j], arr[i]',
	'    arr[i + 1], arr[high] = arr[high], arr[i + 1]',
	'    return i + 1'
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

	sb.push([1], [1], 'Array awal sebelum diurutkan.', snapshotRow(arr, roles()));

	if (n <= 1) {
		arr.forEach((e) => sorted.add(e.id));
		sb.push([], [], 'Array sudah terurut.', snapshotRow(arr, roles()));
		return sb.steps;
	}

	function partition(low: number, high: number): number {
		const pivot = arr[high];
		sb.push(
			[9, 10],
			[7, 8],
			`Pilih pivot: elemen di indeks ${high} (${pivot.value}).`,
			snapshotRow(arr, roles({ [pivot.id]: 'pivot' }))
		);
		let i = low - 1;
		for (let j = low; j < high; j++) {
			sb.push(
				[12, 13],
				[10, 11],
				`Bandingkan indeks ${j} (${arr[j].value}) dengan pivot (${pivot.value}).`,
				snapshotRow(arr, roles({ [pivot.id]: 'pivot', [arr[j].id]: 'compare' }))
			);
			if (arr[j].value < pivot.value) {
				i++;
				if (i !== j) {
					const a = arr[i];
					const b = arr[j];
					arr[i] = b;
					arr[j] = a;
					sb.push(
						[14, 15, 16, 17],
						[12, 13],
						`Tukar indeks ${i} dan ${j} karena ${b.value} < pivot.`,
						snapshotRow(arr, roles({ [pivot.id]: 'pivot', [a.id]: 'swap', [b.id]: 'swap' }))
					);
				}
			}
		}
		const pv = arr[i + 1];
		arr[i + 1] = arr[high];
		arr[high] = pv;
		sorted.add(arr[i + 1].id);
		sb.push(
			[20, 21, 22, 23],
			[14, 15],
			`Tempatkan pivot pada posisi akhirnya di indeks ${i + 1}.`,
			snapshotRow(arr, roles({ [arr[i + 1].id]: 'sorted' }))
		);
		return i + 1;
	}

	function quickSortRec(low: number, high: number) {
		if (low < high) {
			sb.push(
				[2],
				[2],
				`Urutkan sub-array indeks ${low} sampai ${high}.`,
				snapshotRow(arr, roles())
			);
			const p = partition(low, high);
			quickSortRec(low, p - 1);
			quickSortRec(p + 1, high);
		} else if (low === high) {
			sorted.add(arr[low].id);
		}
	}

	quickSortRec(0, n - 1);
	arr.forEach((e) => sorted.add(e.id));
	sb.push([7], [], 'Selesai! Array sudah terurut.', snapshotRow(arr, roles()));
	return sb.steps;
}

export const quickSort: AlgorithmDef = {
	id: 'quick',
	name: 'Quick Sort',
	shortDescription: 'Memilih pivot, memisahkan elemen lebih kecil/lebih besar, lalu mengurutkan tiap bagian secara rekursif.',
	layout: 'row',
	timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
	spaceComplexity: 'O(log n)',
	java,
	python,
	generate
};
