import { useCallback, useEffect, useRef, useState } from 'react';

export const TIMING = { exit: 260, enter: 560 };

const SWIPE_DISTANCE = 50;
const WHEEL_QUIET_GAP = 160;
const WHEEL_MIN_DELTA = 6;

const prefersReducedMotion = () =>
	typeof window !== 'undefined' &&
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export default function useCardDeck({ total, surfaceRef }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [leavingIndex, setLeavingIndex] = useState(null);
	const [phase, setPhase] = useState('idle');

	const activeRef = useRef(0);
	const lockedRef = useRef(false);
	const timersRef = useRef([]);

	const later = useCallback((fn, ms) => {
		timersRef.current.push(window.setTimeout(fn, ms));
	}, []);

	useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

	const goTo = useCallback(
		(target) => {
			if (lockedRef.current) return false;
			if (target < 0 || target >= total || target === activeRef.current) return false;

			lockedRef.current = true;
			const reduced = prefersReducedMotion();
			const exitMs = reduced ? 120 : TIMING.exit;
			const enterMs = reduced ? 160 : TIMING.enter;

			setLeavingIndex(activeRef.current);
			setPhase('exiting');

			later(() => {
				activeRef.current = target;
				setActiveIndex(target);
				setLeavingIndex(null);
				setPhase('entering');

				later(() => {
					setPhase('idle');
					lockedRef.current = false;
				}, enterMs);
			}, exitMs);

			return true;
		},
		[total, later],
	);

	const forward = useCallback(() => goTo(activeRef.current + 1), [goTo]);
	const back = useCallback(() => goTo(activeRef.current - 1), [goTo]);

	useEffect(() => {
		const surface = surfaceRef.current;
		if (!surface) return undefined;

		let lastWheelAt = 0;
		let gestureOpen = true;

		const onWheel = (event) => {
			if (event.ctrlKey) return;
			const el = typeof event.target?.closest === 'function' ? event.target : null;
			if (el?.closest('.map-wrapper')) return;

			const scroller = el?.closest('.deck-card__body');
			if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) return;

			event.preventDefault();

			const now = Date.now();
			if (now - lastWheelAt > WHEEL_QUIET_GAP) gestureOpen = true;
			lastWheelAt = now;
			if (!gestureOpen) return;

			const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
			if (Math.abs(delta) < WHEEL_MIN_DELTA) return;

			gestureOpen = false; // this gesture is now used up, whether or not it moved
			if (delta > 0) forward();
			else back();
		};

		let startX = 0;
		let startY = 0;
		let tracking = false;

		const onTouchStart = (event) => {
			tracking = event.touches.length === 1;
			if (!tracking) return;
			startX = event.touches[0].clientX;
			startY = event.touches[0].clientY;
		};

		const onTouchEnd = (event) => {
			if (!tracking) return;
			tracking = false;
			const touch = event.changedTouches[0];
			const dx = touch.clientX - startX;
			const dy = touch.clientY - startY;
			if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.2) return;
			if (dx < 0) forward();
			else back();
		};

		const onKey = (event) => {
			if (event.target?.closest?.('.map-wrapper')) return;
			if (event.key === 'ArrowRight') forward();
			else if (event.key === 'ArrowLeft') back();
		};

		window.addEventListener('wheel', onWheel, { passive: false });
		window.addEventListener('keydown', onKey);
		surface.addEventListener('touchstart', onTouchStart, { passive: true });
		surface.addEventListener('touchend', onTouchEnd, { passive: true });

		return () => {
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('keydown', onKey);
			surface.removeEventListener('touchstart', onTouchStart);
			surface.removeEventListener('touchend', onTouchEnd);
		};
	}, [surfaceRef, forward, back]);

	return { activeIndex, leavingIndex, phase, goTo, forward, back };
}
