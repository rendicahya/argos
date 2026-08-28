<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';
	import Block3D from './Block3D.svelte';
	import { sortEngine } from '../stores/sortEngine.svelte';
	import { theme } from '../stores/theme';

	let { resetView = $bindable() }: { resetView?: () => void } = $props();

	const SPACING_X = 1.7;
	const SPACING_Z = 2.6;
	const MIN_H = 0.7;
	const MAX_H = 6.2;

	// role -> [base color, emphasised?]
	const ROLE_COLOR: Record<string, string> = {
		default: '#64748b',
		compare: '#fbbf24',
		swap: '#fb7185',
		pivot: '#a78bfa',
		sorted: '#4ade80',
		output: '#4ade80',
		active: '#22d3ee',
		min: '#22d3ee',
		inserted: '#2dd4bf',
		visiting: '#e879f9',
		bucket: '#818cf8'
	};
	const EMPHASIS = new Set(['compare', 'swap', 'pivot', 'active', 'visiting', 'min']);

	interface Placed {
		id: string;
		x: number;
		z: number;
		height: number;
		color: string;
		emphasis: boolean;
		label: string;
	}

	let dark = $derived($theme === 'dark');
	let labelColor = $derived(dark ? '#f1f5f9' : '#0f172a');
	let edgeColor = $derived(dark ? '#4b5272' : '#9aa3bd');

	let layout = $derived.by(() => {
		const step = sortEngine.currentStep;
		const nodes = step?.nodes ?? [];
		if (nodes.length === 0) {
			return { placed: [] as Placed[], cx: 0, cz: 0, span: 8, midH: 2, edges: new Float32Array(0) };
		}
		const minVal = sortEngine.minValue;
		const maxVal = sortEngine.maxValue;
		const range = maxVal - minVal || 1;

		const xs = nodes.map((n) => n.x);
		const ys = nodes.map((n) => n.y);
		const cxRaw = (Math.min(...xs) + Math.max(...xs)) / 2;
		const czRaw = (Math.min(...ys) + Math.max(...ys)) / 2;

		const pos = new Map<string, [number, number, number]>();
		const placed: Placed[] = nodes.map((n) => {
			const height = MIN_H + ((n.value - minVal) / range) * (MAX_H - MIN_H);
			const x = (n.x - cxRaw) * SPACING_X;
			const z = (n.y - czRaw) * SPACING_Z;
			pos.set(n.id, [x, height, z]);
			return {
				id: n.id,
				x,
				z,
				height,
				color: ROLE_COLOR[n.role] ?? ROLE_COLOR.default,
				emphasis: EMPHASIS.has(n.role),
				label: String(n.value)
			};
		});

		const spanX = (Math.max(...xs) - Math.min(...xs)) * SPACING_X;
		const spanZ = (Math.max(...ys) - Math.min(...ys)) * SPACING_Z;
		const span = Math.max(spanX, spanZ, 6);

		const segs: number[] = [];
		for (const e of step?.edges ?? []) {
			const a = pos.get(e.source);
			const b = pos.get(e.target);
			if (!a || !b) continue;
			segs.push(a[0], a[1] * 0.5 + 0.3, a[2], b[0], b[1] * 0.5 + 0.3, b[2]);
		}
		return { placed, cx: 0, cz: 0, span, midH: MAX_H * 0.35, edges: new Float32Array(segs) };
	});

	let edgeKey = $derived(`${sortEngine.algorithmId}:${sortEngine.stepIndex}`);

	// Frame the scene ONCE, at mount. After this the camera belongs entirely to the
	// user via OrbitControls — no algorithm/step change ever moves it again.
	function frame(nodes: { x: number; y: number }[]) {
		if (nodes.length === 0) {
			return { pos: [1, 9, 15] as [number, number, number], target: [0, 2, 0] as [number, number, number] };
		}
		const xs = nodes.map((n) => n.x);
		const ys = nodes.map((n) => n.y);
		const spanX = (Math.max(...xs) - Math.min(...xs)) * SPACING_X;
		const spanZ = (Math.max(...ys) - Math.min(...ys)) * SPACING_Z;
		const span = Math.max(spanX, spanZ, 6);
		return {
			pos: [span * 0.05, span * 0.5 + 3, span * 0.62 + 5] as [number, number, number],
			target: [0, MAX_H * 0.3, 0] as [number, number, number]
		};
	}
	const home = frame(sortEngine.currentStep?.nodes ?? []);

	// Grid/floor only ever grow so switching layouts never shrinks the ground plane.
	let maxSpan = $state(8);
	$effect(() => {
		if (layout.span > maxSpan) maxSpan = layout.span;
	});

	let camera = $state<THREE.PerspectiveCamera | undefined>();
	let controls = $state<any>();

	resetView = () => {
		if (!camera || !controls) return;
		camera.position.set(...home.pos);
		controls.target.set(...home.target);
		controls.update();
	};
</script>

<T.PerspectiveCamera bind:ref={camera} makeDefault fov={50} position={home.pos}>
	<OrbitControls
		bind:ref={controls}
		enableDamping
		dampingFactor={0.08}
		minDistance={5}
		maxDistance={200}
		maxPolarAngle={Math.PI * 0.49}
		target={home.target}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={dark ? 0.55 : 0.85} />
<T.HemisphereLight intensity={dark ? 0.35 : 0.5} groundColor="#1e293b" />
<T.DirectionalLight
	position={[12, 22, 10]}
	intensity={dark ? 1.1 : 1.4}
	castShadow
	shadow.mapSize.width={2048}
	shadow.mapSize.height={2048}
>
	<T.OrthographicCamera
		attach="shadow.camera"
		args={[-40, 40, 40, -40, 0.1, 120]}
	/>
</T.DirectionalLight>

<T.GridHelper args={[Math.max(maxSpan * 2.4, 24), 24, edgeColor, edgeColor]} position={[0, 0, 0]} />

<T.Mesh rotation.x={-Math.PI / 2} position.y={-0.01} receiveShadow>
	<T.CircleGeometry args={[Math.max(maxSpan * 1.6, 18), 64]} />
	<T.MeshStandardMaterial
		color={dark ? '#0b1120' : '#e2e8f0'}
		roughness={1}
		metalness={0}
		transparent
		opacity={dark ? 0.55 : 0.7}
	/>
</T.Mesh>

{#if layout.edges.length > 0}
	{#key edgeKey}
		<T.LineSegments>
			<T.BufferGeometry
				oncreate={(g) => {
					g.setAttribute('position', new THREE.BufferAttribute(layout.edges, 3));
				}}
			/>
			<T.LineBasicMaterial color={edgeColor} transparent opacity={0.6} />
		</T.LineSegments>
	{/key}
{/if}

{#each layout.placed as b (b.id)}
	<Block3D
		targetX={b.x}
		targetZ={b.z}
		height={b.height}
		color={b.color}
		emphasis={b.emphasis}
		label={b.label}
		{labelColor}
	/>
{/each}
