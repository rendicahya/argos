<script lang="ts">
	import { theme } from '../stores/theme';
	import { t } from '../stores/locale';
</script>

<button class="theme-toggle" onclick={() => theme.toggle()} title={$t.themeToggle} aria-label={$t.themeToggle}>
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
