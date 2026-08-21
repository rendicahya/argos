import type { AlgorithmDef, AlgorithmId } from '../types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { heapSort } from './heapSort';
import { bucketSort } from './bucketSort';
import { bstSort } from './bstSort';

export const algorithms: Record<AlgorithmId, AlgorithmDef> = {
	bubble: bubbleSort,
	quick: quickSort,
	merge: mergeSort,
	heap: heapSort,
	bucket: bucketSort,
	bst: bstSort
};

export const algorithmList: AlgorithmDef[] = Object.values(algorithms);
