<script lang="ts">
	import Header from './lib/components/Header.svelte';
	import Controls from './lib/components/Controls.svelte';
	import VisualizationCanvas from './lib/components/VisualizationCanvas.svelte';
	import CodePanel from './lib/components/CodePanel.svelte';
	import { sortEngine } from './lib/stores/sortEngine.svelte';
</script>

<div class="app">
	<Header />
	<main class="layout">
		<aside class="pane pane-controls panel">
			<Controls />
		</aside>
		<section class="pane pane-stage">
			<div class="stage panel">
				<VisualizationCanvas />
			</div>
			<div class="description panel">
				<span class="dot" aria-hidden="true"></span>
				<p>{sortEngine.currentStep?.description ?? 'Pilih algoritma dan tekan Acak atau Terapkan untuk memulai.'}</p>
			</div>
		</section>
		<aside class="pane pane-code panel">
			<CodePanel />
		</aside>
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
		grid-template-columns: 280px 1fr 380px;
		gap: 16px;
		padding: 16px;
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
	}

	@media (max-width: 1100px) {
		.layout {
			grid-template-columns: 240px 1fr;
			grid-template-rows: auto 1fr;
		}
		.pane-code {
			grid-column: 1 / -1;
			height: 320px;
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
