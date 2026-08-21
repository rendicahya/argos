import type { AlgorithmDef, SortStep, VizNode, VizEdge, NodeRole } from '../types';
import { StepBuilder } from './_shared';

const java = [
	'static class Node {',
	'    int value;',
	'    Node left, right;',
	'    Node(int value) { this.value = value; }',
	'}',
	'',
	'public static int[] treeSort(int[] arr) {',
	'    Node root = null;',
	'    for (int value : arr) {',
	'        root = insert(root, value);',
	'    }',
	'    List<Integer> result = new ArrayList<>();',
	'    inorder(root, result);',
	'    return result.stream().mapToInt(Integer::intValue).toArray();',
	'}',
	'',
	'private static Node insert(Node node, int value) {',
	'    if (node == null) {',
	'        return new Node(value);',
	'    }',
	'    if (value < node.value) {',
	'        node.left = insert(node.left, value);',
	'    } else {',
	'        node.right = insert(node.right, value);',
	'    }',
	'    return node;',
	'}',
	'',
	'private static void inorder(Node node, List<Integer> result) {',
	'    if (node == null) return;',
	'    inorder(node.left, result);',
	'    result.add(node.value);',
	'    inorder(node.right, result);',
	'}'
];

const python = [
	'class Node:',
	'    def __init__(self, value):',
	'        self.value = value',
	'        self.left = None',
	'        self.right = None',
	'',
	'def tree_sort(arr):',
	'    root = None',
	'    for value in arr:',
	'        root = insert(root, value)',
	'    result = []',
	'    inorder(root, result)',
	'    return result',
	'',
	'def insert(node, value):',
	'    if node is None:',
	'        return Node(value)',
	'    if value < node.value:',
	'        node.left = insert(node.left, value)',
	'    else:',
	'        node.right = insert(node.right, value)',
	'    return node',
	'',
	'def inorder(node, result):',
	'    if node is None:',
	'        return',
	'    inorder(node.left, result)',
	'    result.append(node.value)',
	'    inorder(node.right, result)'
];

interface TNode {
	id: string;
	value: number;
	left: TNode | null;
	right: TNode | null;
}

function generate(values: number[]): SortStep[] {
	const sb = new StepBuilder();
	const ids = values.map((_, i) => `el-${i}`);
	const n = values.length;
	let root: TNode | null = null;
	const insertedIds = new Set<string>();
	const outputIds = new Set<string>();

	function treeDepth(node: TNode | null): number {
		if (!node) return -1;
		return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
	}

	function layoutTree(): Map<string, { x: number; y: number }> {
		const positions = new Map<string, { x: number; y: number }>();
		let counter = 0;
		function walk(node: TNode | null, depth: number) {
			if (!node) return;
			walk(node.left, depth + 1);
			positions.set(node.id, { x: counter++, y: depth });
			walk(node.right, depth + 1);
		}
		walk(root, 0);
		return positions;
	}

	function snap(extra: Record<string, NodeRole> = {}): { nodes: VizNode[]; edges: VizEdge[] } {
		const treePos = layoutTree();
		const depth = treeDepth(root);
		const outputY = Math.max(depth, 0) + 2;
		const remainingQueue = ids.filter((id) => !insertedIds.has(id));
		const outputOrder = [...outputIds];
		const nodes: VizNode[] = ids.map((id, i) => {
			const value = values[i];
			let x: number;
			let y: number;
			if (outputIds.has(id)) {
				x = outputOrder.indexOf(id);
				y = outputY;
			} else if (insertedIds.has(id)) {
				const p = treePos.get(id)!;
				x = p.x;
				y = p.y;
			} else {
				x = remainingQueue.indexOf(id);
				y = -2;
			}
			const role = extra[id] ?? (outputIds.has(id) ? 'sorted' : 'default');
			return { id, value, x, y, role };
		});
		const edges: VizEdge[] = [];
		function collectEdges(node: TNode | null) {
			if (!node) return;
			if (node.left) edges.push({ id: `e-${node.id}-${node.left.id}`, source: node.id, target: node.left.id });
			if (node.right) edges.push({ id: `e-${node.id}-${node.right.id}`, source: node.id, target: node.right.id });
			collectEdges(node.left);
			collectEdges(node.right);
		}
		collectEdges(root);
		return { nodes, edges };
	}

	{
		const { nodes, edges } = snap();
		sb.push([9], [9], 'Semua nilai akan dimasukkan satu per satu ke Binary Search Tree.', nodes, edges);
	}

	if (n === 0) return sb.steps;

	function insert(node: TNode | null, value: number, id: string): TNode {
		if (!node) {
			insertedIds.add(id);
			return { id, value, left: null, right: null };
		}
		const { nodes, edges } = snap({ [node.id]: 'visiting', [id]: 'active' });
		const dir = value < node.value ? 'kiri' : 'kanan';
		sb.push(
			[19, 20, 21, 22],
			[18, 19, 20, 21],
			`Bandingkan ${value} dengan ${node.value}: lanjut ke anak ${dir}.`,
			nodes,
			edges
		);
		if (value < node.value) {
			node.left = insert(node.left, value, id);
		} else {
			node.right = insert(node.right, value, id);
		}
		return node;
	}

	for (let i = 0; i < n; i++) {
		const id = ids[i];
		const value = values[i];
		{
			const { nodes, edges } = snap({ [id]: 'active' });
			sb.push([8, 9], [8, 9], `Ambil nilai ${value} berikutnya untuk dimasukkan ke BST.`, nodes, edges);
		}
		root = insert(root, value, id);
		{
			const { nodes, edges } = snap({ [id]: 'inserted' });
			sb.push([17, 18], [16, 17], `Posisi kosong ditemukan, sisipkan ${value} sebagai node baru.`, nodes, edges);
		}
	}

	{
		const { nodes, edges } = snap();
		sb.push([11], [11], 'Semua nilai sudah dimasukkan ke BST.', nodes, edges);
	}

	{
		const { nodes, edges } = snap();
		sb.push([12], [12], 'Mulai traversal in-order untuk menghasilkan array terurut.', nodes, edges);
	}

	function inorder(node: TNode | null) {
		if (!node) return;
		inorder(node.left);
		outputIds.add(node.id);
		const { nodes, edges } = snap({ [node.id]: 'sorted' });
		sb.push([28, 29, 30], [27, 28, 29], `Kunjungi (in-order) node ${node.value}, tambahkan ke hasil terurut.`, nodes, edges);
		inorder(node.right);
	}
	inorder(root);

	{
		const { nodes, edges } = snap();
		sb.push([13], [13], 'Selesai! Hasil traversal in-order adalah array yang terurut.', nodes, edges);
	}
	return sb.steps;
}

export const bstSort: AlgorithmDef = {
	id: 'bst',
	name: 'BST Sort',
	shortDescription: 'Memasukkan seluruh elemen ke Binary Search Tree, lalu membaca hasilnya lewat traversal in-order.',
	layout: 'tree',
	timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
	spaceComplexity: 'O(n)',
	java,
	python,
	generate
};
