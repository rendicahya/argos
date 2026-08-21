<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		SvelteFlowProvider,
		type Node as FlowNode,
		type Edge as FlowEdge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import BlockNode from './BlockNode.svelte';
	import { sortEngine } from '../stores/sortEngine.svelte';
	import { theme } from '../stores/theme';

	const nodeTypes = { block: BlockNode };

	const COL_WIDTH = 62;
	const ROW_HEIGHT = 108;
	const MIN_BAR_H = 30;
	const MAX_BAR_H = 148;
	const PADDING = 50;

	let flowNodes = $derived.by((): FlowNode[] => {
		const step = sortEngine.currentStep;
		if (!step || step.nodes.length === 0) return [];
		const minVal = sortEngine.minValue;
		const maxVal = sortEngine.maxValue;
		const range = maxVal - minVal || 1;
		const minX = Math.min(...step.nodes.map((n) => n.x));
		const minY = Math.min(...step.nodes.map((n) => n.y));
		return step.nodes.map((n) => {
			const heightPx = MIN_BAR_H + ((n.value - minVal) / range) * (MAX_BAR_H - MIN_BAR_H);
			return {
				id: n.id,
				type: 'block',
				position: {
					x: (n.x - minX) * COL_WIDTH + PADDING,
					y: (n.y - minY) * ROW_HEIGHT + PADDING + (MAX_BAR_H - heightPx)
				},
				data: { value: n.value, role: n.role, heightPx },
				draggable: false,
				selectable: false,
				focusable: false
			} satisfies FlowNode;
		});
	});

	let flowEdges = $derived.by((): FlowEdge[] => {
		const step = sortEngine.currentStep;
		if (!step) return [];
		return step.edges.map(
			(e) =>
				({
					id: e.id,
					source: e.source,
					target: e.target,
					type: 'straight',
					style: 'stroke: var(--edge-color); stroke-width: 2px;'
				}) satisfies FlowEdge
		);
	});
</script>

<div class="canvas-wrap">
	<SvelteFlowProvider>
		<SvelteFlow
			nodes={flowNodes}
			edges={flowEdges}
			{nodeTypes}
			colorMode={$theme}
			fitView
			fitViewOptions={{ padding: 0.25, duration: 300 }}
			minZoom={0.15}
			maxZoom={2.5}
			nodesDraggable={false}
			nodesConnectable={false}
			elementsSelectable={false}
			panOnScroll
			proOptions={{ hideAttribution: true }}
		>
			<Background gap={28} />
			<Controls showLock={false} />
		</SvelteFlow>
	</SvelteFlowProvider>
</div>

<style>
	.canvas-wrap {
		width: 100%;
		height: 100%;
		min-height: 0;
	}
	:global(.svelte-flow__node) {
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	:global(.svelte-flow__edge-path) {
		transition: d 0.35s ease;
	}
	:global(.svelte-flow) {
		background: transparent;
	}
</style>
