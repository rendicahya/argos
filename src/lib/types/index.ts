export type AlgorithmId = 'bubble' | 'quick' | 'merge' | 'heap' | 'bucket' | 'bst';

export type NodeRole =
	| 'default'
	| 'compare'
	| 'swap'
	| 'pivot'
	| 'sorted'
	| 'active'
	| 'min'
	| 'inserted'
	| 'visiting'
	| 'output'
	| 'bucket';

export interface VizNode {
	id: string;
	value: number;
	x: number;
	y: number;
	role: NodeRole;
}

export interface VizEdge {
	id: string;
	source: string;
	target: string;
	dashed?: boolean;
}

export interface SortStep {
	line: { java: number[]; python: number[] };
	description: string;
	nodes: VizNode[];
	edges: VizEdge[];
}

export type Layout = 'row' | 'grid' | 'tree';

export interface AlgorithmDef {
	id: AlgorithmId;
	name: string;
	shortDescription: string;
	layout: Layout;
	timeComplexity: { best: string; average: string; worst: string };
	spaceComplexity: string;
	java: string[];
	python: string[];
	generate: (values: number[]) => SortStep[];
}

export type ThemeMode = 'light' | 'dark';

export type CodeLang = 'java' | 'python';
