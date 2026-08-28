<script lang="ts">
	import { Canvas } from '@threlte/core';
	import * as THREE from 'three';
	import Scene3D from './Scene3D.svelte';
	import { theme } from '../stores/theme';
	import { t } from '../stores/locale';

	let dark = $derived($theme === 'dark');
	let resetView = $state<(() => void) | undefined>();
</script>

<div class="canvas-wrap" class:dark>
	<Canvas
		shadows={THREE.PCFShadowMap}
		toneMapping={THREE.ACESFilmicToneMapping}
		colorManagementEnabled
	>
		<Scene3D bind:resetView />
	</Canvas>

	<button
		class="reset-btn"
		title={$t.resetViewTitle}
		onclick={() => resetView?.()}
	>
		{$t.resetView}
	</button>
</div>

<style>
	.canvas-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 0;
		border-radius: inherit;
		background:
			radial-gradient(120% 90% at 50% 0%, #f1f5f9 0%, #dbe2ec 55%, #c7d0de 100%);
	}
	.canvas-wrap.dark {
		background:
			radial-gradient(120% 90% at 50% 0%, #182235 0%, #0f172a 55%, #080d18 100%);
	}
	.canvas-wrap :global(canvas) {
		display: block;
		border-radius: inherit;
	}
	.reset-btn {
		position: absolute;
		top: 12px;
		right: 12px;
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--text);
		background: var(--panel, rgba(255, 255, 255, 0.8));
		border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
		border-radius: 8px;
		cursor: pointer;
		backdrop-filter: blur(6px);
		transition: opacity 0.15s ease, transform 0.15s ease;
		opacity: 0.65;
	}
	.reset-btn:hover {
		opacity: 1;
		transform: translateY(-1px);
	}
</style>
