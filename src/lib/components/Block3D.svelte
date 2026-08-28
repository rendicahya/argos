<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Text, Billboard } from '@threlte/extras';
	import * as THREE from 'three';
	import interFontUrl from '@fontsource/inter/files/inter-latin-600-normal.woff2';

	interface Props {
		targetX: number;
		targetZ: number;
		height: number;
		color: string;
		emphasis: boolean;
		label: string;
		labelColor: string;
	}

	let { targetX, targetZ, height, color, emphasis, label, labelColor }: Props = $props();

	let group = $state<THREE.Group | undefined>();
	let mesh = $state<THREE.Mesh | undefined>();
	let material = $state<THREE.MeshStandardMaterial | undefined>();
	let labelGroup = $state<THREE.Group | undefined>();
	let curH = $state(0);
	let started = false;
	let clock = 0;

	useTask((delta) => {
		if (!group || !mesh) return;
		if (!started) {
			group.position.set(targetX, 0, targetZ);
			curH = height;
			started = true;
		} else {
			const k = 1 - Math.pow(0.0015, delta);
			group.position.x += (targetX - group.position.x) * k;
			group.position.z += (targetZ - group.position.z) * k;
			curH += (height - curH) * k;
		}
		mesh.scale.y = curH;
		mesh.position.y = curH / 2;
		if (labelGroup) labelGroup.position.y = curH + 0.85;

		if (material) {
			clock += delta;
			const target = emphasis ? 0.35 + 0.25 * Math.sin(clock * 6) : 0;
			material.emissiveIntensity += (target - material.emissiveIntensity) * Math.min(1, delta * 8);
		}
	});
</script>

<T.Group bind:ref={group}>
	<T.Mesh bind:ref={mesh} castShadow receiveShadow>
		<T.BoxGeometry args={[1.15, 1, 1.15]} />
		<T.MeshStandardMaterial
			bind:ref={material}
			{color}
			emissive={color}
			emissiveIntensity={0}
			roughness={0.45}
			metalness={0.15}
		/>
	</T.Mesh>
	<T.Group bind:ref={labelGroup}>
		<Billboard>
			<Text
				text={label}
				font={interFontUrl}
				fontSize={0.6}
				color={labelColor}
				anchorX="center"
				anchorY="middle"
				outlineWidth={0.04}
				outlineColor={labelColor === '#f1f5f9' ? '#0f172a' : '#f8fafc'}
			/>
		</Billboard>
	</T.Group>
</T.Group>
