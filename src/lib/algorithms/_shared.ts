import type { VizNode, VizEdge, NodeRole, SortStep } from '../types';

export interface Elem {
	id: string;
	value: number;
}

export function initElems(values: number[]): Elem[] {
	return values.map((v, i) => ({ id: `el-${i}`, value: v }));
}

export function snapshotRow(arr: Elem[], roles: Record<string, NodeRole> = {}): VizNode[] {
	return arr.map((el, i) => ({
		id: el.id,
		value: el.value,
		x: i,
		y: 0,
		role: roles[el.id] ?? 'default'
	}));
}

export class StepBuilder {
	steps: SortStep[] = [];

	push(java: number[], python: number[], description: string, nodes: VizNode[], edges: VizEdge[] = []) {
		this.steps.push({ line: { java, python }, description, nodes, edges });
	}
}
