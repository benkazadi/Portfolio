import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

function drawRow(ctx, w, h, band, { t, active, burst, dpr }) {
	ctx.clearRect(0, 0, w, h);
	const mid = h / 2;

	// Graticule: the faint grid on an oscilloscope screen.
	ctx.lineWidth = dpr;
	ctx.strokeStyle = 'rgba(92, 51, 23, 0.5)';
	ctx.beginPath();
	ctx.moveTo(0, mid);
	ctx.lineTo(w, mid);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(92, 51, 23, 0.4)';
	ctx.beginPath();
	for (let i = 1; i < 24; i++) {
		const x = (w / 24) * i;
		ctx.moveTo(x, mid - 3 * dpr);
		ctx.lineTo(x, mid + 3 * dpr);
	}
	ctx.stroke();

	// The signal. `burst` (1 → 0 over ~450ms right after tuning) injects a
	// spike of static, so the band "locks on" when you pick it.
	const s = band.level;
	const amp = h * (0.1 + s * 0.3) * (active ? 1.12 : 1);
	const noise = h * 0.2 * (1 - s) * (active ? 0.18 : 1) + burst * h * 0.3;
	const cycles = 2.2 + band.seed * 1.6;
	const speed = 0.7 + band.seed * 0.6;

	const step = 2 * dpr;
	const path = new Path2D();
	for (let x = 0; x <= w; x += step) {
		const u = x / w;
		const base =
			0.65 * Math.sin(TAU * cycles * u + t * speed * 1.6) +
			0.35 * Math.sin(TAU * cycles * 2.7 * u - t * speed * 2.4);
		const interference = Math.sin(u * 140 + t * 9.1 + band.seed * 10) * Math.sin(u * 57 - t * 6.3);
		const y = mid + amp * base + noise * interference;
		if (x === 0) path.moveTo(x, y);
		else path.lineTo(x, y);
	}

	// Two passes: a wide faint stroke fakes the phosphor glow (cheaper than
	// canvas shadowBlur), then a thin bright stroke is the actual trace.
	ctx.lineJoin = 'round';
	ctx.lineWidth = 5 * dpr;
	ctx.strokeStyle = active ? 'rgba(240, 194, 124, 0.2)' : 'rgba(193, 122, 46, 0.1)';
	ctx.stroke(path);
	ctx.lineWidth = 1.6 * dpr;
	ctx.strokeStyle = active ? '#f0c27c' : '#a8672a';
	ctx.stroke(path);

	// A sweep line crossing the active row, like a scope's scan.
	if (active) {
		const x = ((t * 0.25) % 1) * w;
		const g = ctx.createLinearGradient(x - 60 * dpr, 0, x, 0);
		g.addColorStop(0, 'rgba(240, 194, 124, 0)');
		g.addColorStop(1, 'rgba(240, 194, 124, 0.22)');
		ctx.fillStyle = g;
		ctx.fillRect(x - 60 * dpr, 0, 60 * dpr, h);
		ctx.fillStyle = 'rgba(240, 194, 124, 0.7)';
		ctx.fillRect(x, 0, dpr, h);
	}
}

export default function useScope(canvasRefs, bands, tuned) {
	const tunedRef = useRef(tuned);
	const tuneAtRef = useRef(-1e9);

	useEffect(() => {
		tunedRef.current = tuned;
		tuneAtRef.current = performance.now();
	}, [tuned]);

	useEffect(() => {
		const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
		const dprNow = () => Math.min(window.devicePixelRatio || 1, 2); // 2 is plenty and keeps phones fast

		// A canvas has TWO sizes: its on-screen CSS size and its pixel grid.
		// If they differ the drawing is blurry, so match grid to size × dpr.
		const fit = () => {
			const dpr = dprNow();
			canvasRefs.current.forEach((c) => {
				if (!c) return;
				const w = Math.round(c.clientWidth * dpr);
				const h = Math.round(c.clientHeight * dpr);
				if (c.width !== w || c.height !== h) {
					c.width = w;
					c.height = h;
				}
			});
		};
		fit();
		const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null;
		canvasRefs.current.forEach((c) => c && ro?.observe(c));

		let frame = 0;
		const tick = (now) => {
			const t = reduced ? 0 : now / 1000; // reduced motion = frozen waves
			const burst = reduced ? 0 : Math.max(0, 1 - (now - tuneAtRef.current) / 450);
			const dpr = dprNow();
			canvasRefs.current.forEach((c, i) => {
				if (!c || !bands[i]) return;
				const ctx = c.getContext('2d');
				if (!ctx) return;
				const active = i === tunedRef.current;
				drawRow(ctx, c.width, c.height, bands[i], { t, active, burst: active ? burst : 0, dpr });
			});
			frame = window.requestAnimationFrame(tick);
		};
		frame = window.requestAnimationFrame(tick);

		return () => {
			window.cancelAnimationFrame(frame);
			ro?.disconnect();
		};
	}, [canvasRefs, bands]);
}
