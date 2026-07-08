'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		animationId: number;
	} | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		const W = container.clientWidth || window.innerWidth;
		const H = container.clientHeight || window.innerHeight;

		// Scene setup
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(60, W / H, 1, 10000);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(W, H);
		renderer.setClearColor(0x000000, 0);

		container.appendChild(renderer.domElement);

		// Build particle positions & pure-white colors
		const positions: number[] = [];
		const colors: number[] = [];
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions.push(
					ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
					0,
					iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
				);
				// Pure white dots — matches the dark #0D0D0D site theme
				colors.push(1, 1, 1);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 7,
			vertexColors: true,
			transparent: true,
			opacity: 0.85,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const pos = geometry.attributes.position.array as Float32Array;
			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					pos[i * 3 + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}
			geometry.attributes.position.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		};

		const handleResize = () => {
			const W2 = container.clientWidth || window.innerWidth;
			const H2 = container.clientHeight || window.innerHeight;
			camera.aspect = W2 / H2;
			camera.updateProjectionMatrix();
			renderer.setSize(W2, H2);
		};

		window.addEventListener('resize', handleResize);
		animate();

		sceneRef.current = { scene, camera, renderer, animationId };

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
			geometry.dispose();
			material.dispose();
			renderer.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0', className)}
			{...props}
		/>
	);
}
