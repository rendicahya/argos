<script lang="ts">
	import { sortEngine } from '../stores/sortEngine.svelte';
	import { algorithmList } from '../algorithms';

	let count = $state(sortEngine.values.length);
	let manualInput = $state(sortEngine.values.join(', '));
	let manualError = $state('');

	function randomize() {
		const c = Math.min(30, Math.max(2, Math.round(count) || 10));
		count = c;
		sortEngine.randomize(c);
		manualInput = sortEngine.values.join(', ');
		manualError = '';
	}

	function applyManual() {
		const parts = manualInput
			.split(/[,\s]+/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0)
			.map(Number);
		if (parts.length === 0 || parts.some((n) => Number.isNaN(n))) {
			manualError = 'Masukkan angka yang valid, dipisahkan koma.';
			return;
		}
		if (parts.length < 2 || parts.length > 30) {
			manualError = 'Jumlah data harus antara 2 dan 30.';
			return;
		}
		manualError = '';
		sortEngine.setValues(parts);
		count = parts.length;
	}
</script>

<div class="controls">
	<section class="block-section">
		<h3>Algoritma</h3>
		<div class="algo-grid">
			{#each algorithmList as algo (algo.id)}
				<button
					class="algo-btn"
					class:active={sortEngine.algorithmId === algo.id}
					onclick={() => sortEngine.setAlgorithm(algo.id)}
				>
					{algo.name}
				</button>
			{/each}
		</div>
		<p class="algo-desc">{sortEngine.algorithm.shortDescription}</p>
		<div class="complexity">
			<span>Best <b>{sortEngine.algorithm.timeComplexity.best}</b></span>
			<span>Avg <b>{sortEngine.algorithm.timeComplexity.average}</b></span>
			<span>Worst <b>{sortEngine.algorithm.timeComplexity.worst}</b></span>
			<span>Space <b>{sortEngine.algorithm.spaceComplexity}</b></span>
		</div>
	</section>

	<section class="block-section">
		<h3>Data</h3>
		<div class="row">
			<label for="count">Jumlah data acak (2&ndash;30)</label>
			<div class="inline">
				<input id="count" type="number" min="2" max="30" bind:value={count} />
				<button class="btn" onclick={randomize}>🎲 Acak</button>
			</div>
		</div>
		<div class="row">
			<label for="manual">Nilai manual (pisahkan dengan koma)</label>
			<div class="inline">
				<input id="manual" type="text" bind:value={manualInput} placeholder="mis. 5, 3, 8, 1, 9" />
				<button class="btn" onclick={applyManual}>Terapkan</button>
			</div>
			{#if manualError}<p class="error">{manualError}</p>{/if}
		</div>
	</section>

	<section class="block-section">
		<h3>Kontrol Animasi</h3>
		<div class="playback">
			<button class="icon-btn" onclick={() => sortEngine.reset()} title="Ulang dari awal">⏮</button>
			<button class="icon-btn" onclick={() => sortEngine.stepBack()} disabled={sortEngine.isAtStart} title="Langkah mundur">⏪</button>
			<button class="icon-btn play" onclick={() => sortEngine.togglePlay()} title={sortEngine.playing ? 'Jeda' : 'Putar'}>
				{#if sortEngine.playing}⏸{:else}▶{/if}
			</button>
			<button class="icon-btn" onclick={() => sortEngine.stepForward()} disabled={sortEngine.isAtEnd} title="Langkah maju">⏩</button>
		</div>
		<div class="row">
			<label for="speed">Kecepatan</label>
			<input id="speed" type="range" min="1" max="10" bind:value={sortEngine.speed} />
		</div>
		<div class="progress-row">
			<div class="progress-bar"><div class="progress-fill" style="width:{sortEngine.progress * 100}%"></div></div>
			<span class="step-count">Langkah {sortEngine.steps.length ? sortEngine.stepIndex + 1 : 0} / {sortEngine.steps.length}</span>
		</div>
	</section>
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 16px;
		height: 100%;
		overflow-y: auto;
	}
	.block-section h3 {
		margin: 0 0 10px;
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-dim);
	}
	.algo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.algo-btn {
		padding: 9px 8px;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--panel-alt);
		color: var(--text);
		font-size: 13px;
		font-weight: 600;
		transition: all 0.15s ease;
	}
	.algo-btn:hover {
		border-color: var(--accent);
	}
	.algo-btn.active {
		background: linear-gradient(135deg, var(--accent), var(--accent-2));
		color: white;
		border-color: transparent;
		box-shadow: 0 4px 14px var(--accent-soft);
	}
	.algo-desc {
		margin: 10px 0 8px;
		font-size: 12.5px;
		color: var(--text-dim);
		line-height: 1.5;
	}
	.complexity {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 12px;
		font-size: 11.5px;
		color: var(--text-dim);
	}
	.complexity b {
		color: var(--text);
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 12px;
	}
	.row label {
		font-size: 12px;
		color: var(--text-dim);
	}
	.inline {
		display: flex;
		gap: 8px;
	}
	input[type='number'],
	input[type='text'] {
		flex: 1;
		min-width: 0;
		padding: 8px 10px;
		border-radius: 9px;
		border: 1px solid var(--border);
		background: var(--panel-alt);
		color: var(--text);
	}
	input[type='number']:focus,
	input[type='text']:focus {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}
	.btn {
		padding: 8px 12px;
		border-radius: 9px;
		border: 1px solid var(--border);
		background: var(--panel-alt);
		font-weight: 600;
		font-size: 13px;
		white-space: nowrap;
	}
	.btn:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.error {
		margin: 0;
		font-size: 12px;
		color: var(--danger);
	}
	.playback {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 14px;
	}
	.icon-btn {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		border: 1px solid var(--border);
		background: var(--panel-alt);
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.icon-btn:not(:disabled):hover {
		border-color: var(--accent);
	}
	.icon-btn.play {
		width: 54px;
		height: 54px;
		font-size: 20px;
		background: linear-gradient(135deg, var(--accent), var(--accent-2));
		color: white;
		border-color: transparent;
	}
	input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
	}
	.progress-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
	}
	.progress-bar {
		flex: 1;
		height: 6px;
		border-radius: 4px;
		background: var(--panel-alt);
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		transition: width 0.2s ease;
	}
	.step-count {
		font-size: 11.5px;
		color: var(--text-dim);
		white-space: nowrap;
	}
</style>
