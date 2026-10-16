import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import '../styles/spatial.css';

const SECTIONS = [
	{ id: 'home',     label: 'HOME',     subtitle: 'SIGNAL DETECTED',   position: [0, 0, 0]    },
	{ id: 'about',    label: 'ABOUT',    subtitle: 'IDENTITY ARCHIVE',  position: [-10, 4, -10] },
	{ id: 'skills',   label: 'SKILLS',   subtitle: 'FREQUENCY MAP',     position: [3, 10, -20]  },
	{ id: 'projects', label: 'PROJECTS', subtitle: 'FIELD EXPEDITIONS', position: [12, 8, -30]  },
	{ id: 'contact',  label: 'CONTACT',  subtitle: 'OPEN CHANNEL',      position: [10, 2, -50]  },
];

const AMBER          = 0xc17a2e;
const PALE           = 0xe8e4d9;
const INITIAL_CAMERA = new THREE.Vector3(0, 0, 10);
const INITIAL_LOOK   = new THREE.Vector3(0, 0, 0);
const PAN_SPEED      = 0.012;
const DOLLY_SPEED    = 0.35;
const DOLLY_MIN_Z    = 2;
const DOLLY_MAX_Z    = 22;
const SNAPBACK_STRENGTH = 0.032;
const SNAPBACK_EPSILON  = 0.001;

function makeNode(position, isHome = false) {
	const group = new THREE.Group();
	group.position.set(...position);

	const core = new THREE.Mesh(
		new THREE.IcosahedronGeometry(isHome ? 0.42 : 0.27, 5),
		new THREE.MeshStandardMaterial({
			color: isHome ? PALE : AMBER,
			emissive: AMBER,
			emissiveIntensity: isHome ? 0.72 : 0.45,
			roughness: 0.2,
			metalness: 0.48,
		}),
	);
	group.add(core);

	const ring = new THREE.Mesh(
		new THREE.TorusGeometry(isHome ? 0.68 : 0.48, 0.009, 6, 72),
		new THREE.MeshBasicMaterial({
			color: AMBER,
			transparent: true,
			opacity: isHome ? 0.72 : 0.48,
			side: THREE.DoubleSide,
		}),
	);
	ring.rotation.x = Math.PI * 0.28;
	group.add(ring);

	const orbit = new THREE.Mesh(
		new THREE.TorusGeometry(isHome ? 0.88 : 0.62, 0.004, 4, 72),
		new THREE.MeshBasicMaterial({ color: PALE, transparent: true, opacity: 0.22 }),
	);
	orbit.rotation.set(Math.PI * 0.62, 0.2, Math.PI * 0.18);
	group.add(orbit);

	return { group, core, ring, orbit };
}

function makeStars() {
	const count     = 900;
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		positions[i * 3]     = (Math.random() - 0.5) * 70;
		positions[i * 3 + 1] = (Math.random() - 0.5) * 44;
		positions[i * 3 + 2] = -Math.random() * 42 - 5;
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	return new THREE.Points(geometry, new THREE.PointsMaterial({
		color: PALE, size: 0.06, transparent: true, opacity: 0.62, sizeAttenuation: true,
	}));
}

export default function Navigation3D({ onEnterSection, onClose }) {
	const canvasHostRef   = useRef(null);
	const labelRefs       = useRef({});
	const arrivalTimerRef = useRef(null);
	const isDragging      = useRef(false);
	const lastPointer     = useRef({ x: 0, y: 0 });
	const panOffsetRef    = useRef({ x: 0, y: 0 });
	const cameraGoalRef   = useRef({
		position: INITIAL_CAMERA.clone(),
		lookAt:   INITIAL_LOOK.clone(),
	});

	const [focusedId, setFocusedId]     = useState(null);
	const [isArriving, setIsArriving]   = useState(false);
	const focusedIdRef                  = useRef(null);

	// ── THREE.JS SCENE ────────────────────────────────────────────────────────
	useEffect(() => {
		const host = canvasHostRef.current;
		if (!host) return undefined;

		const scene = new THREE.Scene();
		scene.fog   = new THREE.FogExp2(0x080808, 0.012);

		const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);
		camera.position.copy(INITIAL_CAMERA);
		camera.lookAt(INITIAL_LOOK);

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
		renderer.setSize(host.clientWidth, host.clientHeight);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		host.appendChild(renderer.domElement);

		scene.add(new THREE.PointLight(AMBER, 28, 32)).position.set(10, 4, 5);
		scene.add(new THREE.PointLight(0x5c3317, 18, 24)).position.set(5, -2, -6);
		scene.add(makeStars());

		const nodeObjects = new Map();
		const nodeGroups  = [];
		SECTIONS.forEach((section, index) => {
			const node = makeNode(section.position, index === 0);
			scene.add(node.group);
			nodeObjects.set(section.id, node);
			nodeGroups.push(node.group.position.clone());
		});

		const linePositions = [];
		[[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,1]].forEach(([a, b]) => {
			linePositions.push(...nodeGroups[a].toArray(), ...nodeGroups[b].toArray());
		});
		const linksGeo = new THREE.BufferGeometry();
		linksGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
		scene.add(new THREE.LineSegments(linksGeo, new THREE.LineBasicMaterial({
			color: AMBER, transparent: true, opacity: 0.22,
		})));

		const lookTarget = INITIAL_LOOK.clone();
		const clock      = new THREE.Clock();
		let frameId  = 0;
		let disposed = false;

		const resize = () => {
			const w = host.clientWidth;
			const h = host.clientHeight;
			if (!w || !h) return;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};
		const ro = new ResizeObserver(resize);
		ro.observe(host);
		window.addEventListener('resize', resize);

		const render = () => {
			if (disposed) return;
			frameId = window.requestAnimationFrame(render);
			const elapsed = clock.getElapsedTime();

			nodeObjects.forEach((node, id) => {
				const selected = focusedIdRef.current === id;
				node.core.rotation.y  += 0.0025;
				node.core.rotation.x  += 0.0012;
				node.ring.rotation.z  += selected ? 0.006 : 0.0018;
				node.orbit.rotation.y -= 0.0012;
				const pulse = 1 + Math.sin(elapsed * 1.2 + [...id].length) * 0.025;
				node.group.scale.setScalar(selected ? 1.12 : pulse);
			});

			// Snap-back pan offset toward zero when not dragging
			if (!isDragging.current) {
				const ox = panOffsetRef.current.x;
				const oy = panOffsetRef.current.y;
				if (Math.abs(ox) > SNAPBACK_EPSILON || Math.abs(oy) > SNAPBACK_EPSILON) {
					const rx = ox * SNAPBACK_STRENGTH;
					const ry = oy * SNAPBACK_STRENGTH;
					panOffsetRef.current.x              -= rx;
					panOffsetRef.current.y              -= ry;
					cameraGoalRef.current.position.x    -= rx;
					cameraGoalRef.current.lookAt.x      -= rx;
					cameraGoalRef.current.position.y    -= ry;
					cameraGoalRef.current.lookAt.y      -= ry;
				} else if (Math.abs(ox) > 0 || Math.abs(oy) > 0) {
					cameraGoalRef.current.position.x    -= ox;
					cameraGoalRef.current.lookAt.x      -= ox;
					cameraGoalRef.current.position.y    -= oy;
					cameraGoalRef.current.lookAt.y      -= oy;
					panOffsetRef.current = { x: 0, y: 0 };
				}
			}

			camera.position.lerp(cameraGoalRef.current.position, 0.045);
			lookTarget.lerp(cameraGoalRef.current.lookAt, 0.055);
			camera.lookAt(lookTarget);
			camera.updateMatrixWorld();

			SECTIONS.forEach((section) => {
				const el = labelRefs.current[section.id];
				if (!el) return;

				const proj = new THREE.Vector3(...section.position).project(camera);

				const x = (proj.x  *  0.5 + 0.5) * host.clientWidth;
				const y = (-proj.y *  0.5 + 0.5) * host.clientHeight;

				const visible = (
					proj.z > -1 && proj.z < 1 &&
					Math.abs(proj.x) < 1 &&
					Math.abs(proj.y) < 1
				);

				el.style.display    = visible ? 'block' : 'none';
				el.style.transform  = `translate(${x}px, ${y}px)`;
				el.style.opacity    = visible
					? String(Math.max(0.35, 1 - Math.max(0, proj.z) * 0.45))
					: '0';
				el.style.pointerEvents = visible ? 'auto' : 'none';
				});

				renderer.render(scene, camera);
			};

		render();

		// ── PAN ───────────────────────────────────────────────────────────────
		const onPointerDown = (e) => {
			if (e.button !== 0) return;
			isDragging.current  = true;
			lastPointer.current = { x: e.clientX, y: e.clientY };
			host.setPointerCapture(e.pointerId);
		};
		const onPointerMove = (e) => {
			if (!isDragging.current) return;
			const dx = e.clientX - lastPointer.current.x;
			const dy = e.clientY - lastPointer.current.y;
			lastPointer.current = { x: e.clientX, y: e.clientY };
			cameraGoalRef.current.position.x -= dx * PAN_SPEED;
			cameraGoalRef.current.lookAt.x   -= dx * PAN_SPEED;
			cameraGoalRef.current.position.y += dy * PAN_SPEED;
			cameraGoalRef.current.lookAt.y   += dy * PAN_SPEED;
			panOffsetRef.current.x           -= dx * PAN_SPEED;
			panOffsetRef.current.y           += dy * PAN_SPEED;
		};
		const onPointerUp = (e) => {
			if (!isDragging.current) return;
			isDragging.current = false;
			host.releasePointerCapture(e.pointerId);
		};

		// ── DOLLY ─────────────────────────────────────────────────────────────
		const onWheel = (e) => {
			e.preventDefault();
			const dir  = e.deltaY > 0 ? -1 : 1;
			const rawZ = cameraGoalRef.current.position.z + dir * DOLLY_SPEED;
			cameraGoalRef.current.position.z = Math.max(DOLLY_MIN_Z, Math.min(DOLLY_MAX_Z, rawZ));
		};

		host.addEventListener('pointerdown', onPointerDown);
		host.addEventListener('pointermove', onPointerMove);
		host.addEventListener('pointerup',   onPointerUp);
		host.addEventListener('wheel',       onWheel, { passive: false });

		return () => {
			disposed = true;
			window.cancelAnimationFrame(frameId);
			ro.disconnect();
			window.removeEventListener('resize', resize);
			host.removeEventListener('pointerdown', onPointerDown);
			host.removeEventListener('pointermove', onPointerMove);
			host.removeEventListener('pointerup',   onPointerUp);
			host.removeEventListener('wheel',       onWheel);
			scene.traverse((obj) => {
				if (obj.geometry) obj.geometry.dispose();
				if (obj.material) {
					const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
					mats.forEach((m) => m.dispose());
				}
			});
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);

	// ── CAMERA FLY-IN when focusedId changes ─────────────────────────────────
	useEffect(() => {
		focusedIdRef.current = focusedId;
		if (!focusedId) {
			cameraGoalRef.current = { position: INITIAL_CAMERA.clone(), lookAt: INITIAL_LOOK.clone() };
			panOffsetRef.current  = { x: 0, y: 0 };
			return;
		}
		const section = SECTIONS.find((s) => s.id === focusedId);
		if (!section) return;
		const target = new THREE.Vector3(...section.position);
		cameraGoalRef.current = {
			position: target.clone().add(new THREE.Vector3(0, 0, 4.8)),
			lookAt:   target,
		};
	}, [focusedId]);

	const handleNodeClick = (id) => {
		if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
		setFocusedId(id);
		setIsArriving(true);
		arrivalTimerRef.current = window.setTimeout(() => {
			setIsArriving(false);
			onEnterSection(id);
			setFocusedId(null);
		}, 1050);
	};

	useEffect(() => () => {
		if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
	}, []);

	return (
		<div className="spatial-nav">
			<div className="spatial-canvas" ref={canvasHostRef} aria-hidden="true" />
			<div className="spatial-vignette" aria-hidden="true" />

			<div className="spatial-node-labels" aria-label="Navigation map">
				{SECTIONS.map((section, index) => (
					<button
						className={`spatial-node-label ${index === 0 ? 'is-home-node' : ''}`}
						key={section.id}
						ref={(el) => { labelRefs.current[section.id] = el; }}
						onClick={() => handleNodeClick(section.id)}
						aria-label={`Travel to ${section.label}`}
					>
						<span className="node-label-orbit"><span /></span>
						<span className="node-label-copy">
							<strong>{section.label}</strong>
							<small>{section.subtitle}</small>
						</span>
					</button>
				))}
			</div>

			{!focusedId && (
				<div className="overview-prompt">
					<span className="prompt-line" />
					SELECT A NODE TO EXPLORE
					<span className="prompt-line" />
				</div>
			)}

			{onClose && (
				<button className="map-close-button hud-button" onClick={onClose} aria-label="Close map">
					<span aria-hidden="true">↙</span> RETURN TO SECTION
				</button>
			)}
		</div>
	);
}