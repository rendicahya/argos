<script lang="ts">
	import Header from './lib/components/Header.svelte';
	import Controls from './lib/components/Controls.svelte';
	import VisualizationCanvas from './lib/components/VisualizationCanvas.svelte';
	import CodePanel from './lib/components/CodePanel.svelte';
	import { sortEngine } from './lib/stores/sortEngine.svelte';
	import { locale, t } from './lib/stores/locale';

	const CODE_MIN = 260;
	const CODE_MAX = 680;

	function readNum(key: string, fallback: number): number {
		if (typeof localStorage === 'undefined') return fallback;
		const raw = Number(localStorage.getItem(key));
		return Number.isFinite(raw) && raw > 0 ? raw : fallback;
	}

	let codeWidth = $state(
		Math.min(CODE_MAX, Math.max(CODE_MIN, readNum('argos-code-width', 380)))
	);
	let codeCollapsed = $state(
		typeof localStorage !== 'undefined' && localStorage.getItem('argos-code-collapsed') === '1'
	);

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('argos-code-width', String(Math.round(codeWidth)));
			localStorage.setItem('argos-code-collapsed', codeCollapsed ? '1' : '0');
		}
	});

	let resizing = $state(false);

	function startResize(event: PointerEvent) {
		resizing = true;
		const startX = event.clientX;
		const startW = codeWidth;
		(event.target as HTMLElement).setPointerCapture(event.pointerId);

		function move(e: PointerEvent) {
			const next = startW + (startX - e.clientX);
			codeWidth = Math.min(CODE_MAX, Math.max(CODE_MIN, next));
		}
		function up(e: PointerEvent) {
			resizing = false;
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
			try {
				(event.target as HTMLElement).releasePointerCapture(e.pointerId);
			} catch {
				/* ignore */
			}
		}
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
	}
</script>

<div class="app">
	<Header />
	<main
		class="layout"
		class:code-collapsed={codeCollapsed}
		class:resizing
		style="--code-w: {codeCollapsed ? 0 : Math.round(codeWidth)}px"
	>
		<aside class="pane pane-controls panel">
			<Controls />
		</aside>
		<section class="pane pane-stage">
			<div class="stage panel">
				<VisualizationCanvas />
			</div>
			<div class="description panel">
				<span class="dot" aria-hidden="true"></span>
				<p>{sortEngine.currentStep?.description[$locale] ?? $t.emptyHint}</p>
			</div>
		</section>

		{#if !codeCollapsed}
			<aside class="pane pane-code panel">
				<div
					class="code-resizer"
					role="separator"
					aria-orientation="vertical"
					aria-label={$t.resizeHandle}
					title={$t.resizeHandle}
					onpointerdown={startResize}
				></div>
				<CodePanel onClose={() => (codeCollapsed = true)} />
			</aside>
		{:else}
			<button class="code-reopen" title={$t.openPanel} aria-label={$t.openPanel} onclick={() => (codeCollapsed = false)}>
				<span aria-hidden="true">‹</span> {$t.codeHeading}
			</button>
		{/if}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.layout {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: 280px 1fr var(--code-w, 380px);
		gap: 16px;
		padding: 16px;
	}
	.layout.code-collapsed {
		grid-template-columns: 280px 1fr;
	}
	.layout.resizing {
		cursor: col-resize;
		user-select: none;
	}
	.pane {
		min-height: 0;
		min-width: 0;
	}
	.pane-controls {
		overflow: hidden;
	}
	.pane-stage {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-height: 0;
	}
	.stage {
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}
	.description {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		flex-shrink: 0;
	}
	.description .dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--accent);
		flex-shrink: 0;
		box-shadow: 0 0 0 4px var(--accent-soft);
	}
	.description p {
		margin: 0;
		font-size: 14px;
		color: var(--text);
	}
	.pane-code {
		overflow: hidden;
		position: relative;
	}
	.code-resizer {
		position: absolute;
		left: -8px;
		top: 0;
		bottom: 0;
		width: 16px;
		cursor: col-resize;
		z-index: 5;
		touch-action: none;
	}
	.code-resizer::after {
		content: '';
		position: absolute;
		left: 7px;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		height: 42px;
		border-radius: 2px;
		background: var(--border);
		transition: background 0.15s ease;
	}
	.code-resizer:hover::after {
		background: var(--accent);
	}
	.code-reopen {
		position: fixed;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 10px 10px 10px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--text);
		background: var(--panel);
		border: 1px solid var(--border);
		border-right: none;
		border-radius: 10px 0 0 10px;
		cursor: pointer;
		z-index: 20;
	}
	.code-reopen:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	@media (max-width: 1100px) {
		.layout,
		.layout.code-collapsed {
			grid-template-columns: 240px 1fr;
			grid-template-rows: auto 1fr;
		}
		.pane-code {
			grid-column: 1 / -1;
			height: 320px;
		}
		.code-resizer {
			display: none;
		}
	}

	@media (max-width: 760px) {
		.layout {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			height: auto;
			overflow-y: auto;
		}
		.app {
			height: auto;
			min-height: 100vh;
		}
		.pane-controls {
			order: 2;
			max-height: 420px;
		}
		.pane-stage {
			order: 1;
			height: 60vh;
		}
		.pane-code {
			order: 3;
			grid-column: auto;
			height: 400px;
		}
	}
</style>
