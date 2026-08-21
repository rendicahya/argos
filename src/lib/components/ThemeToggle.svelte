<script lang="ts">
	import { theme } from '../stores/theme';
</script>

<button class="theme-toggle" onclick={() => theme.toggle()} title="Ganti tema terang/gelap" aria-label="Ganti tema terang/gelap">
	{#if $theme === 'dark'}
		<span aria-hidden="true">🌙</span>
	{:else}
		<span aria-hidden="true">☀️</span>
	{/if}
</button>

<style>
	.theme-toggle {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		border: 1px solid var(--border);
		background: var(--panel-alt);
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}
	.theme-toggle:hover {
		transform: scale(1.06);
		background: var(--accent-soft);
	}
</style>
