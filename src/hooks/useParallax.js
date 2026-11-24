import { useEffect } from 'react';

export default function useParallax(rootRef, { follow = 0.05, wander = 0.35 } = {}) {
	useEffect(() => {
		const root = rootRef.current;
		if (!root) return undefined;

		// People who ask for less motion get a perfectly still scene.
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
			root.style.setProperty('--px', '0');
			root.style.setProperty('--py', '0');
			return undefined;
		}

		let targetX = 0, targetY = 0; // where the mouse says we should be
		let x = 0, y = 0;             // where the scene actually is (it chases the target)
		let frame = 0;

		const onMove = (event) => {
			targetX = (event.clientX / window.innerWidth - 0.5) * 2;
			targetY = (event.clientY / window.innerHeight - 0.5) * 2;
		};
		window.addEventListener('pointermove', onMove, { passive: true });

		const tick = (now) => {
			// A slow automatic wander on top of the mouse, so the scene still
			// breathes when nobody is moving a mouse (phones, idle desktops).
			const wanderX = Math.sin(now * 0.00011) * wander;
			const wanderY = Math.cos(now * 0.00008) * wander;

			// lerp: close 5% of the remaining gap each frame = heavy, floaty motion.
			x += (targetX + wanderX - x) * follow;
			y += (targetY + wanderY - y) * follow;

			root.style.setProperty('--px', x.toFixed(4));
			root.style.setProperty('--py', y.toFixed(4));
			frame = window.requestAnimationFrame(tick);
		};
		frame = window.requestAnimationFrame(tick);

		return () => {
			window.removeEventListener('pointermove', onMove);
			window.cancelAnimationFrame(frame);
		};
	}, [rootRef, follow, wander]);
}