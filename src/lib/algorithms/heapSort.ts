import type { AlgorithmDef, SortStep, VizNode, VizEdge, NodeRole } from '../types';
import { initElems, StepBuilder, L } from './_shared';

const java = [
	'public static void heapSort(int[] arr) {',
	'    int n = arr.length;',
	'    for (int i = n / 2 - 1; i >= 0; i--) {',
	'        heapify(arr, n, i);',
	'    }',
	'    for (int i = n - 1; i > 0; i--) {',
	'        int temp = arr[0];',
	'        arr[0] = arr[i];',
	'        arr[i] = temp;',
	'        heapify(arr, i, 0);',
	'    }',
	'}',
	'',
	'private static void heapify(int[] arr, int size, int root) {',
	'    int largest = root;',
	'    int left = 2 * root + 1;',
	'    int right = 2 * root + 2;',
	'    if (left < size && arr[left] > arr[largest]) {',
	'        largest = left;',
	'    }',
	'    if (right < size && arr[right] > arr[largest]) {',
	'        largest = right;',
	'    }',
	'    if (largest != root) {',
	'        int temp = arr[root];',
	'        arr[root] = arr[largest];',
	'        arr[largest] = temp;',
	'        heapify(arr, size, largest);',
	'    }',
	'}'
];

const python = [
	'def heap_sort(arr):',
	'    n = len(arr)',
	'    for i in range(n // 2 - 1, -1, -1):',
	'        heapify(arr, n, i)',
	'    for i in range(n - 1, 0, -1):',
	'        arr[0], arr[i] = arr[i], arr[0]',
	'        heapify(arr, i, 0)',
	'',
	'def heapify(arr, size, root):',
	'    largest = root',
	'    left = 2 * root + 1',
	'    right = 2 * root + 2',
	'    if left < size and arr[left] > arr[largest]:',
	'        largest = left',
	'    if right < size and arr[right] > arr[largest]:',
	'        largest = right',
	'    if largest != root:',
	'        arr[root], arr[largest] = arr[largest], arr[root]',
	'        heapify(arr, size, largest)'
];

function generate(values: number[]): SortStep[] {
	const sb = new StepBuilder();
	const arr = initElems(values);
	const n = arr.length;
	const totalDepth = n > 0 ? Math.floor(Math.log2(n)) : 0;
	const sorted = new Set<string>();

	function heapPos(i: number) {
		const depth = Math.floor(Math.log2(i + 1));
		const levelStart = Math.pow(2, depth) - 1;
		const posInLevel = i - levelStart;
		const scale = Math.pow(2, totalDepth - depth);
		return { x: (posInLevel + 0.5) * scale, y: depth };
	}
	function sortedRowPos(i: number) {
		const width = Math.pow(2, totalDepth);
		return { x: (i + 0.5) * (width / n), y: totalDepth + 2 };
	}
	function snap(heapSize: number, extra: Record<string, NodeRole> = {}): { nodes: VizNode[]; edges: VizEdge[] } {
		const nodes: VizNode[] = arr.map((el, i) => {
			const p = i < heapSize ? heapPos(i) : sortedRowPos(i);
			const role = extra[el.id] ?? (sorted.has(el.id) ? 'sorted' : 'default');
			return { id: el.id, value: el.value, x: p.x, y: p.y, role };
		});
		const edges: VizEdge[] = [];
		for (let i = 0; i < heapSize; i++) {
			const l = 2 * i + 1;
			const r = 2 * i + 2;
			if (l < heapSize) edges.push({ id: `e-${arr[i].id}-${arr[l].id}`, source: arr[i].id, target: arr[l].id });
			if (r < heapSize) edges.push({ id: `e-${arr[i].id}-${arr[r].id}`, source: arr[i].id, target: arr[r].id });
		}
		return { nodes, edges };
	}

	{
		const { nodes, edges } = snap(n);
		sb.push(
			[1, 2],
			[1, 2],
			L('Array direpresentasikan sebagai complete binary tree.', 'The array is represented as a complete binary tree.'),
			nodes,
			edges
		);
	}

	if (n <= 1) {
		if (n === 1) sorted.add(arr[0].id);
		const { nodes, edges } = snap(n);
		sb.push([], [], L('Array sudah terurut.', 'The array is already sorted.'), nodes, edges);
		return sb.steps;
	}

	function heapify(size: number, root: number) {
		const left = 2 * root + 1;
		const right = 2 * root + 2;
		let largest = root;
		{
			const { nodes, edges } = snap(size, { [arr[root].id]: 'active' });
			sb.push(
				[14, 15, 16, 17],
				[9, 10, 11, 12],
				L(
					`Heapify di root indeks ${root}: cari elemen terbesar antara root dan anak-anaknya.`,
					`Heapify at root index ${root}: find the largest among the root and its children.`
				),
				nodes,
				edges
			);
		}
		if (left < size) {
			const { nodes, edges } = snap(size, { [arr[root].id]: 'active', [arr[left].id]: 'compare' });
			sb.push(
				[18, 19, 20],
				[13, 14],
				L(
					`Bandingkan anak kiri (${arr[left].value}) dengan largest saat ini (${arr[largest].value}).`,
					`Compare the left child (${arr[left].value}) with the current largest (${arr[largest].value}).`
				),
				nodes,
				edges
			);
			if (arr[left].value > arr[largest].value) largest = left;
		}
		if (right < size) {
			const { nodes, edges } = snap(size, {
				[arr[root].id]: 'active',
				[arr[right].id]: 'compare',
				[arr[largest].id]: 'active'
			});
			sb.push(
				[21, 22, 23],
				[15, 16],
				L(
					`Bandingkan anak kanan (${arr[right].value}) dengan largest saat ini (${arr[largest].value}).`,
					`Compare the right child (${arr[right].value}) with the current largest (${arr[largest].value}).`
				),
				nodes,
				edges
			);
			if (arr[right].value > arr[largest].value) largest = right;
		}
		if (largest !== root) {
			const a = arr[root];
			const b = arr[largest];
			arr[root] = b;
			arr[largest] = a;
			const { nodes, edges } = snap(size, { [a.id]: 'swap', [b.id]: 'swap' });
			sb.push(
				[25, 26, 27],
				[18],
				L(
					`Tukar ${a.value} dan ${b.value} karena anak lebih besar dari root.`,
					`Swap ${a.value} and ${b.value} because the child is larger than the root.`
				),
				nodes,
				edges
			);
			heapify(size, largest);
		}
	}

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		const { nodes, edges } = snap(n, { [arr[i].id]: 'active' });
		sb.push(
			[3, 4],
			[3, 4],
			L(`Bangun max-heap: heapify dari indeks ${i}.`, `Build the max-heap: heapify from index ${i}.`),
			nodes,
			edges
		);
		heapify(n, i);
	}
	{
		const { nodes, edges } = snap(n);
		sb.push([5], [], L('Max-heap selesai dibangun.', 'The max-heap has been built.'), nodes, edges);
	}

	for (let i = n - 1; i > 0; i--) {
		{
			const { nodes, edges } = snap(i + 1, { [arr[0].id]: 'swap', [arr[i].id]: 'swap' });
			sb.push(
				[7, 8, 9],
				[6],
				L(
					`Tukar root (maksimum: ${arr[0].value}) dengan elemen terakhir heap (indeks ${i}).`,
					`Swap the root (maximum: ${arr[0].value}) with the last heap element (index ${i}).`
				),
				nodes,
				edges
			);
		}
		const top = arr[0];
		arr[0] = arr[i];
		arr[i] = top;
		sorted.add(arr[i].id);
		{
			const { nodes, edges } = snap(i, { [arr[i].id]: 'sorted' });
			sb.push(
				[9],
				[6],
				L(`${arr[i].value} sudah pada posisi terurutnya.`, `${arr[i].value} is now in its sorted position.`),
				nodes,
				edges
			);
		}
		const { nodes: n2, edges: e2 } = snap(i, { [arr[0].id]: 'active' });
		sb.push([10], [7], L(`Heapify ulang heap berukuran ${i}.`, `Re-heapify the heap of size ${i}.`), n2, e2);
		heapify(i, 0);
	}
	sorted.add(arr[0].id);
	{
		const { nodes, edges } = snap(0);
		sb.push([12], [], L('Selesai! Array sudah terurut.', 'Done! The array is sorted.'), nodes, edges);
	}
	return sb.steps;
}

export const heapSort: AlgorithmDef = {
	id: 'heap',
	name: 'Heap Sort',
	shortDescription: {
		id: 'Membangun struktur max-heap, lalu berulang kali mengambil elemen terbesar ke posisi akhirnya.',
		en: 'Builds a max-heap, then repeatedly moves the largest element to its final position.'
	},
	layout: 'tree',
	timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
	spaceComplexity: 'O(1)',
	java,
	python,
	generate
};
