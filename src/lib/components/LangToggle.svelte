<script lang="ts">
	import { locale, t } from '../stores/locale';
</script>

<div class="lang-toggle" role="group" aria-label={$t.langToggle} title={$t.langToggle}>
	<button
		type="button"
		class:active={$locale === 'en'}
		aria-pressed={$locale === 'en'}
		onclick={() => locale.set('en')}>EN</button
	>
	<button
		type="button"
		class:active={$locale === 'id'}
		aria-pressed={$locale === 'id'}
		onclick={() => locale.set('id')}>ID</button
	>
</div>

<style>
	.lang-toggle {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		height: 40px;
		padding: 3px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--panel-alt);
	}
	.lang-toggle button {
		height: 100%;
		padding: 0 10px;
		border-radius: 9px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--text-dim);
		background: transparent;
		transition:
			color 0.15s ease,
			background 0.15s ease;
	}
	.lang-toggle button:hover {
		color: var(--text);
	}
	.lang-toggle button.active {
		color: var(--accent);
		background: var(--accent-soft);
	}
</style>
