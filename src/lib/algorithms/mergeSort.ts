import type { AlgorithmDef, SortStep, VizNode, NodeRole } from '../types';
import { initElems, StepBuilder, L, type Elem } from './_shared';

const java = [
	'public static void mergeSort(int[] arr, int left, int right) {',
	'    if (left < right) {',
	'        int mid = (left + right) / 2;',
	'        mergeSort(arr, left, mid);',
	'        mergeSort(arr, mid + 1, right);',
	'        merge(arr, left, mid, right);',
	'    }',
	'}',
	'',
	'private static void merge(int[] arr, int left, int mid, int right) {',
	'    int[] leftArr = Arrays.copyOfRange(arr, left, mid + 1);',
	'    int[] rightArr = Arrays.copyOfRange(arr, mid + 1, right + 1);',
	'    int i = 0, j = 0, k = left;',
	'    while (i < leftArr.length && j < rightArr.length) {',
	'        if (leftArr[i] <= rightArr[j]) {',
	'            arr[k++] = leftArr[i++];',
	'        } else {',
	'            arr[k++] = rightArr[j++];',
	'        }',
	'    }',
	'    while (i < leftArr.length) arr[k++] = leftArr[i++];',
	'    while (j < rightArr.length) arr[k++] = rightArr[j++];',
	'}'
];

const python = [
	'def merge_sort(arr, left, right):',
	'    if left < right:',
	'        mid = (left + right) // 2',
	'        merge_sort(arr, left, mid)',
	'        merge_sort(arr, mid + 1, right)',
	'        merge(arr, left, mid, right)',
	'',
	'def merge(arr, left, mid, right):',
	'    left_arr = arr[left:mid + 1]',
	'    right_arr = arr[mid + 1:right + 1]',
	'    i = j = 0',
	'    k = left',
	'    while i < len(left_arr) and j < len(right_arr):',
	'        if left_arr[i] <= right_arr[j]:',
	'            arr[k] = left_arr[i]',
	'            i += 1',
	'        else:',
	'            arr[k] = right_arr[j]',
	'            j += 1',
	'        k += 1',
	'    while i < len(left_arr):',
	'        arr[k] = left_arr[i]',
	'        i += 1',
	'        k += 1',
	'    while j < len(right_arr):',
	'        arr[k] = right_arr[j]',
	'        j += 1',
	'        k += 1'
];

function generate(values: number[]): SortStep[] {
	const sb = new StepBuilder();
	const arr = initElems(values);
	const n = arr.length;
	const pos = new Map<string, { x: number; y: number }>();
	const sorted = new Set<string>();

	const snap = (extra: Record<string, NodeRole> = {}): VizNode[] =>
		arr.map((el, i) => {
			const p = pos.get(el.id);
			const role = extra[el.id] ?? (sorted.has(el.id) ? 'sorted' : 'default');
			return { id: el.id, value: el.value, x: p?.x ?? i, y: p?.y ?? 0, role };
		});

	sb.push([1], [1], L('Array awal sebelum diurutkan.', 'Initial array before sorting.'), snap());

	if (n <= 1) {
		arr.forEach((e) => sorted.add(e.id));
		sb.push([], [], L('Array sudah terurut.', 'The array is already sorted.'), snap());
		return sb.steps;
	}

	function mergeRange(left: number, mid: number, right: number, isTop: boolean) {
		const leftArr: Elem[] = arr.slice(left, mid + 1);
		const rightArr: Elem[] = arr.slice(mid + 1, right + 1);
		const activeRoles: Record<string, NodeRole> = {};
		for (const e of [...leftArr, ...rightArr]) {
			pos.set(e.id, { x: arr.indexOf(e), y: 1 });
			activeRoles[e.id] = 'active';
		}
		sb.push(
			[11, 12],
			[9, 10],
			L(
				`Salin sub-array kiri [${left}..${mid}] dan kanan [${mid + 1}..${right}] untuk digabung.`,
				`Copy the left sub-array [${left}..${mid}] and right sub-array [${mid + 1}..${right}] to merge.`
			),
			snap(activeRoles)
		);

		let i = 0;
		let j = 0;
		let k = left;
		while (i < leftArr.length && j < rightArr.length) {
			sb.push(
				[14, 15],
				[13, 14],
				L(
					`Bandingkan ${leftArr[i].value} (kiri) dengan ${rightArr[j].value} (kanan).`,
					`Compare ${leftArr[i].value} (left) with ${rightArr[j].value} (right).`
				),
				snap({ [leftArr[i].id]: 'compare', [rightArr[j].id]: 'compare' })
			);
			if (leftArr[i].value <= rightArr[j].value) {
				arr[k] = leftArr[i];
				pos.set(leftArr[i].id, { x: k, y: 0 });
				if (isTop) sorted.add(leftArr[i].id);
				sb.push(
					[16],
					[15, 16],
					L(
						`Tempatkan ${leftArr[i].value} dari kiri ke indeks ${k}.`,
						`Place ${leftArr[i].value} from the left into index ${k}.`
					),
					snap({ [leftArr[i].id]: isTop ? 'sorted' : 'active' })
				);
				i++;
			} else {
				arr[k] = rightArr[j];
				pos.set(rightArr[j].id, { x: k, y: 0 });
				if (isTop) sorted.add(rightArr[j].id);
				sb.push(
					[18],
					[17, 18],
					L(
						`Tempatkan ${rightArr[j].value} dari kanan ke indeks ${k}.`,
						`Place ${rightArr[j].value} from the right into index ${k}.`
					),
					snap({ [rightArr[j].id]: isTop ? 'sorted' : 'active' })
				);
				j++;
			}
			k++;
		}
		while (i < leftArr.length) {
			arr[k] = leftArr[i];
			pos.set(leftArr[i].id, { x: k, y: 0 });
			if (isTop) sorted.add(leftArr[i].id);
			sb.push(
				[21],
				[20, 21, 22, 23],
				L(
					`Sisa elemen kiri ${leftArr[i].value} ditempatkan di indeks ${k}.`,
					`Remaining left element ${leftArr[i].value} is placed at index ${k}.`
				),
				snap({ [leftArr[i].id]: isTop ? 'sorted' : 'active' })
			);
			i++;
			k++;
		}
		while (j < rightArr.length) {
			arr[k] = rightArr[j];
			pos.set(rightArr[j].id, { x: k, y: 0 });
			if (isTop) sorted.add(rightArr[j].id);
			sb.push(
				[22],
				[24, 25, 26, 27],
				L(
					`Sisa elemen kanan ${rightArr[j].value} ditempatkan di indeks ${k}.`,
					`Remaining right element ${rightArr[j].value} is placed at index ${k}.`
				),
				snap({ [rightArr[j].id]: isTop ? 'sorted' : 'active' })
			);
			j++;
			k++;
		}
		sb.push([6], [6], L(`Sub-array [${left}..${right}] telah digabung.`, `Sub-array [${left}..${right}] has been merged.`), snap());
	}

	function mergeSortRec(left: number, right: number) {
		if (left >= right) return;
		const mid = Math.floor((left + right) / 2);
		sb.push(
			[2, 3],
			[2, 3],
			L(
				`Bagi sub-array [${left}..${right}] menjadi [${left}..${mid}] dan [${mid + 1}..${right}].`,
				`Split sub-array [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}].`
			),
			snap()
		);
		mergeSortRec(left, mid);
		mergeSortRec(mid + 1, right);
		mergeRange(left, mid, right, left === 0 && right === n - 1);
	}

	mergeSortRec(0, n - 1);
	arr.forEach((e) => sorted.add(e.id));
	sb.push([8], [], L('Selesai! Array sudah terurut.', 'Done! The array is sorted.'), snap());
	return sb.steps;
}

export const mergeSort: AlgorithmDef = {
	id: 'merge',
	name: 'Merge Sort',
	shortDescription: {
		id: 'Membagi array menjadi dua bagian secara rekursif, mengurutkannya, lalu menggabungkan kembali.',
		en: 'Recursively splits the array in half, sorts each half, then merges them back together.'
	},
	layout: 'row',
	timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
	spaceComplexity: 'O(n)',
	java,
	python,
	generate
};
