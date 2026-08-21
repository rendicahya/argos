import type { AlgorithmDef, SortStep, VizNode, NodeRole } from '../types';
import { initElems, StepBuilder, type Elem } from './_shared';

const BUCKET_COUNT = 10;

const java = [
	'public static void bucketSort(int[] arr) {',
	'    int n = arr.length;',
	'    int min = Arrays.stream(arr).min().getAsInt();',
	'    int max = Arrays.stream(arr).max().getAsInt();',
	'    int bucketCount = 10;',
	'    List<List<Integer>> buckets = new ArrayList<>();',
	'    for (int i = 0; i < bucketCount; i++) buckets.add(new ArrayList<>());',
	'',
	'    for (int value : arr) {',
	'        int index = (int) ((long) (value - min) * bucketCount / (max - min + 1));',
	'        buckets.get(index).add(value);',
	'    }',
	'',
	'    for (List<Integer> bucket : buckets) {',
	'        Collections.sort(bucket);',
	'    }',
	'',
	'    int k = 0;',
	'    for (List<Integer> bucket : buckets) {',
	'        for (int value : bucket) {',
	'            arr[k++] = value;',
	'        }',
	'    }',
	'}'
];

const python = [
	'def bucket_sort(arr):',
	'    n = len(arr)',
	'    min_value = min(arr)',
	'    max_value = max(arr)',
	'    bucket_count = 10',
	'    buckets = [[] for _ in range(bucket_count)]',
	'',
	'    for value in arr:',
	'        index = (value - min_value) * bucket_count // (max_value - min_value + 1)',
	'        buckets[index].append(value)',
	'',
	'    for bucket in buckets:',
	'        bucket.sort()',
	'',
	'    k = 0',
	'    for bucket in buckets:',
	'        for value in bucket:',
	'            arr[k] = value',
	'            k += 1'
];

function generate(values: number[]): SortStep[] {
	const sb = new StepBuilder();
	const arr = initElems(values);
	const n = arr.length;
	const sorted = new Set<string>();
	const pos = new Map<string, { x: number; y: number }>();
	arr.forEach((el, i) => pos.set(el.id, { x: i, y: 0 }));

	const snap = (extra: Record<string, NodeRole> = {}): VizNode[] =>
		arr.map((el) => {
			const p = pos.get(el.id)!;
			const role = extra[el.id] ?? (sorted.has(el.id) ? 'sorted' : 'default');
			return { id: el.id, value: el.value, x: p.x, y: p.y, role };
		});

	sb.push([1, 2], [1, 2], 'Array awal sebelum diurutkan.', snap());

	if (n <= 1) {
		if (n === 1) sorted.add(arr[0].id);
		sb.push([], [], 'Array sudah terurut.', snap());
		return sb.steps;
	}

	const max = Math.max(...values);
	const min = Math.min(...values);
	sb.push(
		[3, 4, 5],
		[3, 4, 5],
		`Cari nilai minimum (${min}) & maksimum (${max}), siapkan ${BUCKET_COUNT} bucket kosong.`,
		snap()
	);

	const buckets: Elem[][] = Array.from({ length: BUCKET_COUNT }, () => []);

	for (const el of [...arr]) {
		const idx = Math.min(
			BUCKET_COUNT - 1,
			Math.max(0, Math.floor(((el.value - min) * BUCKET_COUNT) / (max - min + 1)))
		);
		sb.push(
			[10],
			[9],
			`Hitung indeks bucket untuk nilai ${el.value}: masuk ke bucket ${idx}.`,
			snap({ [el.id]: 'active' })
		);
		buckets[idx].push(el);
		pos.set(el.id, { x: buckets[idx].length - 1, y: idx + 1 });
		sb.push([11], [10], `Masukkan ${el.value} ke bucket ${idx}.`, snap({ [el.id]: 'bucket' }));
	}

	for (let b = 0; b < BUCKET_COUNT; b++) {
		if (buckets[b].length > 1) {
			const before = buckets[b].map((e) => e.value).join(', ');
			const roleBefore: Record<string, NodeRole> = {};
			for (const e of buckets[b]) roleBefore[e.id] = 'active';
			sb.push([15], [13], `Urutkan isi bucket ${b}: [${before}].`, snap(roleBefore));
			buckets[b].sort((a, c) => a.value - c.value);
			buckets[b].forEach((e, i) => pos.set(e.id, { x: i, y: b + 1 }));
			const after = buckets[b].map((e) => e.value).join(', ');
			const roleAfter: Record<string, NodeRole> = {};
			for (const e of buckets[b]) roleAfter[e.id] = 'bucket';
			sb.push([15], [13], `Bucket ${b} setelah diurutkan: [${after}].`, snap(roleAfter));
		}
	}

	let k = 0;
	for (let b = 0; b < BUCKET_COUNT; b++) {
		for (const el of buckets[b]) {
			pos.set(el.id, { x: k, y: 0 });
			sorted.add(el.id);
			sb.push(
				[21],
				[18, 19],
				`Ambil ${el.value} dari bucket ${b} ke indeks ${k} pada array hasil.`,
				snap({ [el.id]: 'sorted' })
			);
			k++;
		}
	}

	sb.push([24], [], 'Selesai! Array sudah terurut.', snap());
	return sb.steps;
}

export const bucketSort: AlgorithmDef = {
	id: 'bucket',
	name: 'Bucket Sort',
	shortDescription: 'Menyebar elemen ke beberapa "ember" berdasarkan nilainya, mengurutkan tiap ember, lalu menggabungkannya.',
	layout: 'grid',
	timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' },
	spaceComplexity: 'O(n + k)',
	java,
	python,
	generate
};
