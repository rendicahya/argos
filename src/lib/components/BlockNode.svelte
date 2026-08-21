<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';

	interface BlockData {
		value: number;
		role: string;
		heightPx: number;
	}

	let { data }: { data: BlockData } = $props();
</script>

<Handle type="target" position={Position.Top} style="opacity:0;pointer-events:none;" />
<div class="block role-{data.role}" style="--h:{data.heightPx}px">
	<div class="face top"></div>
	<div class="face side"></div>
	<div class="face front">
		<span class="value">{data.value}</span>
	</div>
</div>
<Handle type="source" position={Position.Bottom} style="opacity:0;pointer-events:none;" />

<style>
	.block {
		position: relative;
		width: 44px;
		height: var(--h);
		transition:
			height 0.35s ease,
			filter 0.25s ease;
	}

	.face {
		position: absolute;
	}

	.front {
		left: 0;
		top: 0;
		width: 44px;
		height: 100%;
		border-radius: 4px 4px 3px 3px;
		background: linear-gradient(180deg, var(--c-1) 0%, var(--c-2) 100%);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.25),
			0 3px 8px rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 5px;
	}

	.top {
		left: 2px;
		top: -7px;
		width: 40px;
		height: 14px;
		background: var(--c-0);
		transform: perspective(60px) rotateX(45deg);
		transform-origin: bottom;
		border-radius: 3px 3px 0 0;
	}

	.side {
		left: 42px;
		top: 4px;
		width: 10px;
		height: calc(100% - 4px);
		background: var(--c-3);
		transform: skewY(38deg);
		border-radius: 0 2px 3px 0;
	}

	.value {
		position: relative;
		z-index: 2;
		font-size: 12px;
		font-weight: 700;
		color: white;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
		font-variant-numeric: tabular-nums;
	}

	.role-default {
		--c-0: var(--role-default-0);
		--c-1: var(--role-default-1);
		--c-2: var(--role-default-2);
		--c-3: var(--role-default-3);
	}
	.role-compare {
		--c-0: var(--role-compare-0);
		--c-1: var(--role-compare-1);
		--c-2: var(--role-compare-2);
		--c-3: var(--role-compare-3);
	}
	.role-swap {
		--c-0: var(--role-swap-0);
		--c-1: var(--role-swap-1);
		--c-2: var(--role-swap-2);
		--c-3: var(--role-swap-3);
	}
	.role-pivot {
		--c-0: var(--role-pivot-0);
		--c-1: var(--role-pivot-1);
		--c-2: var(--role-pivot-2);
		--c-3: var(--role-pivot-3);
	}
	.role-sorted,
	.role-output {
		--c-0: var(--role-sorted-0);
		--c-1: var(--role-sorted-1);
		--c-2: var(--role-sorted-2);
		--c-3: var(--role-sorted-3);
	}
	.role-active,
	.role-min {
		--c-0: var(--role-active-0);
		--c-1: var(--role-active-1);
		--c-2: var(--role-active-2);
		--c-3: var(--role-active-3);
	}
	.role-inserted {
		--c-0: var(--role-inserted-0);
		--c-1: var(--role-inserted-1);
		--c-2: var(--role-inserted-2);
		--c-3: var(--role-inserted-3);
	}
	.role-visiting {
		--c-0: var(--role-visiting-0);
		--c-1: var(--role-visiting-1);
		--c-2: var(--role-visiting-2);
		--c-3: var(--role-visiting-3);
	}
	.role-bucket {
		--c-0: var(--role-bucket-0);
		--c-1: var(--role-bucket-1);
		--c-2: var(--role-bucket-2);
		--c-3: var(--role-bucket-3);
	}

	.role-compare .front,
	.role-swap .front,
	.role-pivot .front,
	.role-active .front,
	.role-visiting .front {
		filter: drop-shadow(0 0 10px var(--c-1));
	}
</style>
