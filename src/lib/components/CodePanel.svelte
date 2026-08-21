<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/components/prism-clike';
	import 'prismjs/components/prism-java';
	import 'prismjs/components/prism-python';
	import { sortEngine } from '../stores/sortEngine.svelte';
	import type { CodeLang } from '../types';

	let lang = $state<CodeLang>('java');
	let lines = $derived(lang === 'java' ? sortEngine.algorithm.java : sortEngine.algorithm.python);
	let highlightedLines = $derived(sortEngine.currentStep?.line[lang] ?? []);

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
	<div class="tabs">
		<button class:active={lang === 'java'} onclick={() => (lang = 'java')}>Java</button>
		<button class:active={lang === 'python'} onclick={() => (lang = 'python')}>Python</button>
	</div>
	<div class="code-lines">
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
	.tabs {
		display: flex;
		gap: 4px;
		padding: 10px 10px 0;
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
	.code-lines {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		background: var(--bg-soft);
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 13px;
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
