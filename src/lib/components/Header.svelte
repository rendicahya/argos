<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="header">
	<div class="brand">
		<svg class="logo" viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
			<rect x="9" y="38" width="9" height="17" rx="2" fill="url(#lg)" />
			<rect x="22" y="28" width="9" height="27" rx="2" fill="url(#lg)" />
			<rect x="35" y="18" width="9" height="37" rx="2" fill="url(#lg)" />
			<rect x="48" y="9" width="9" height="46" rx="2" fill="url(#lg)" />
			<circle cx="52.5" cy="14" r="3.2" fill="#fbbf24" />
			<defs>
				<linearGradient id="lg" x1="0" y1="1" x2="0" y2="0">
					<stop offset="0%" stop-color="var(--accent)" />
					<stop offset="100%" stop-color="var(--accent-2)" />
				</linearGradient>
			</defs>
		</svg>
		<div class="brand-text">
			<h1>Argos</h1>
			<p>Visualisasi Algoritma Sorting &mdash; Algoritma &amp; Struktur Data</p>
		</div>
	</div>
	<ThemeToggle />
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 22px;
		border-bottom: 1px solid var(--border);
		background: var(--panel);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.brand-text h1 {
		margin: 0;
		font-size: 22px;
		font-weight: 800;
		letter-spacing: 0.5px;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.brand-text p {
		margin: 0;
		font-size: 12px;
		color: var(--text-dim);
	}
	@media (max-width: 720px) {
		.brand-text p {
			display: none;
		}
	}
</style>
