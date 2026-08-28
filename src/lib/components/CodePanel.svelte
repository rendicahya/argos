<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/components/prism-clike';
	import 'prismjs/components/prism-java';
	import 'prismjs/components/prism-python';
	import { sortEngine } from '../stores/sortEngine.svelte';
	import { t } from '../stores/locale';
	import type { CodeLang } from '../types';

	let { onClose }: { onClose?: () => void } = $props();

	const FONT_MIN = 10;
	const FONT_MAX = 22;

	let lang = $state<CodeLang>('java');
	let lines = $derived(lang === 'java' ? sortEngine.algorithm.java : sortEngine.algorithm.python);
	let highlightedLines = $derived(sortEngine.currentStep?.line[lang] ?? []);

	let fontSize = $state(
		(() => {
			if (typeof localStorage === 'undefined') return 13;
			const raw = Number(localStorage.getItem('argos-code-fontsize'));
			return Number.isFinite(raw) && raw >= FONT_MIN && raw <= FONT_MAX ? raw : 13;
		})()
	);
	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('argos-code-fontsize', String(fontSize));
		}
	});
	function bumpFont(delta: number) {
		fontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, fontSize + delta));
	}

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | null = null;
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(lines.join('\n'));
			copied = true;
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch {
			/* clipboard unavailable */
		}
	}

	function scrollWhenActive(node: HTMLDivElement, isActive: boolean) {
		if (isActive) node.scrollIntoView({ block: 'center', behavior: 'smooth' });
		return {
			update(next: boolean) {
				if (next) node.scrollIntoView({ block: 'center', behavior: 'smooth' });
			}
		};
	}

	function highlight(line: string): string {
		if (line.trim() === '') return '&nbsp;';
		const grammar = lang === 'java' ? Prism.languages.java : Prism.languages.python;
		return Prism.highlight(line, grammar, lang);
	}
</script>

<div class="code-panel">
	<div class="toolbar">
		<div class="tabs">
			<button class:active={lang === 'java'} onclick={() => (lang = 'java')}>Java</button>
			<button class:active={lang === 'python'} onclick={() => (lang = 'python')}>Python</button>
		</div>
		<div class="tools">
			<button
				class="tool"
				onclick={() => bumpFont(-1)}
				disabled={fontSize <= FONT_MIN}
				title={$t.fontDecrease}
				aria-label={$t.fontDecrease}>A−</button
			>
			<button
				class="tool"
				onclick={() => bumpFont(1)}
				disabled={fontSize >= FONT_MAX}
				title={$t.fontIncrease}
				aria-label={$t.fontIncrease}>A+</button
			>
			<button class="tool copy" class:done={copied} onclick={copyCode} title={$t.copyCodeTitle}>
				{copied ? $t.copied : $t.copy}
			</button>
			{#if onClose}
				<button class="tool" onclick={onClose} title={$t.closePanel} aria-label={$t.closePanel}>✕</button>
			{/if}
		</div>
	</div>
	<div class="code-lines" style="font-size: {fontSize}px">
		{#each lines as line, i (i)}
			{@const active = highlightedLines.includes(i + 1)}
			<div class="code-line" class:active use:scrollWhenActive={active}>
				<span class="ln">{i + 1}</span><span class="content">{@html highlight(line)}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.code-panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}
	.toolbar {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 8px;
		padding: 10px 10px 0;
	}
	.tabs {
		display: flex;
		gap: 4px;
	}
	.tabs button {
		padding: 7px 16px;
		border-radius: 8px 8px 0 0;
		border: 1px solid var(--border);
		border-bottom: none;
		background: var(--panel-alt);
		color: var(--text-dim);
		font-weight: 600;
		font-size: 13px;
	}
	.tabs button.active {
		background: var(--bg-soft);
		color: var(--accent);
	}
	.tools {
		display: flex;
		gap: 4px;
		padding-bottom: 4px;
	}
	.tool {
		min-width: 30px;
		height: 28px;
		padding: 0 8px;
		border-radius: 7px;
		border: 1px solid var(--border);
		background: var(--panel-alt);
		color: var(--text-dim);
		font-size: 12px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tool:not(:disabled):hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.tool:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.tool.copy {
		min-width: 54px;
	}
	.tool.copy.done {
		border-color: var(--accent);
		color: var(--accent);
	}
	.code-lines {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		background: var(--bg-soft);
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		line-height: 1.7;
		padding: 10px 0;
		border-radius: 0 0 var(--radius) var(--radius);
	}
	.code-line {
		display: flex;
		padding: 1px 14px;
		border-left: 3px solid transparent;
		white-space: pre;
	}
	.code-line.active {
		background: var(--accent-soft);
		border-left-color: var(--accent);
	}
	.ln {
		width: 2.2em;
		flex-shrink: 0;
		text-align: right;
		margin-right: 14px;
		color: var(--text-faint);
		user-select: none;
	}
	.content {
		white-space: pre;
	}
</style>
