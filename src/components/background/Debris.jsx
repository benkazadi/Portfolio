const between = (a, b) => a + Math.random() * (b - a);

/* A cog: thick dashed circle = teeth, thin circles + spokes = body. */
export function Cog({ teeth = 18, className = '' }) {
	const dash = (100 / teeth / 2).toFixed(3);
	return (
		<svg className={`cog ${className}`} viewBox="0 0 100 100" aria-hidden="true">
			<circle className="cog__teeth" cx="50" cy="50" r="43" pathLength="100"
				style={{ strokeDasharray: `${dash} ${dash}` }} />
			<circle className="cog__ring" cx="50" cy="50" r="37" />
			<circle className="cog__ring" cx="50" cy="50" r="13" />
			{[0, 45, 90, 135].map((a) => (
				<line key={a} className="cog__spoke" x1="50" y1="13" x2="50" y2="87" transform={`rotate(${a} 50 50)`} />
			))}
		</svg>
	);
}

/* A snapped pipe section with flanges and a jagged torn end. */
export function PipeFragment({ className = '' }) {
	return (
		<svg className={`pipe ${className}`} viewBox="0 0 140 44" aria-hidden="true">
			<defs>
				<linearGradient id="pipe-body" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#9a6a35" />
					<stop offset="0.35" stopColor="#5a3818" />
					<stop offset="1" stopColor="#1a0e06" />
				</linearGradient>
			</defs>
			<rect x="14" y="10" width="104" height="24" rx="3" fill="url(#pipe-body)" stroke="#5C3317" strokeWidth="1" />
			<rect x="8" y="6" width="10" height="32" rx="2" className="pipe__flange" />
			<rect x="52" y="8" width="7" height="28" rx="2" className="pipe__flange" />
			<path d="M118 10 L126 16 L121 21 L129 27 L122 34 L118 34 Z" fill="#120a05" stroke="#5C3317" strokeWidth="1" />
			{[22, 30, 38].map((x) => <circle key={x} cx={x} cy="22" r="1.1" className="pipe__rivet" />)}
		</svg>
	);
}

/* The big dark cog in the foreground. Mostly invisible by design: you notice
   it because it BLOCKS the stars and haze behind it, and a thin amber rim
   catches light on one side. The rim is drawn outside the spinning group so
   the light stays put while the metal turns. */
export function NearCog() {
	return (
		<svg className="near-cog" viewBox="0 0 100 100" aria-hidden="true">
			<defs>
				<linearGradient id="near-rim" x1="1" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#e3b06a" stopOpacity="0.9" />
					<stop offset="0.4" stopColor="#C17A2E" stopOpacity="0.25" />
					<stop offset="1" stopColor="#C17A2E" stopOpacity="0" />
				</linearGradient>
			</defs>
			<g className="near-cog__spin">
				<circle cx="50" cy="50" r="43" pathLength="100" fill="none" stroke="#070605"
					strokeWidth="9" strokeDasharray="2.0833 2.0833" />
				<circle cx="50" cy="50" r="40" fill="#070605" />
				{[0, 60, 120].map((a) => (
					<line key={a} x1="50" y1="14" x2="50" y2="86" stroke="#0d0b09" strokeWidth="3" transform={`rotate(${a} 50 50)`} />
				))}
			</g>
			<circle cx="50" cy="50" r="40" fill="none" stroke="url(#near-rim)" strokeWidth="0.9" />
			<circle cx="50" cy="50" r="12" fill="none" stroke="url(#near-rim)" strokeWidth="0.7" />
		</svg>
	);
}

/* Amber dust: tiny glowing motes drifting like embers. Positions are rolled
   once when the file loads, so they stay put while React re-renders. */
const MOTES = Array.from({ length: 22 }, () => ({
	x: between(0, 100), y: between(0, 100), s: between(1.3, 3.2),
	dx: between(-40, 40), dy: between(-70, 10),
	dur: between(14, 32), delay: between(-30, 0), o: between(0.2, 0.55),
}));

export function Dust() {
	return (
		<>
			{MOTES.map((m, i) => (
				<i key={i} className="mote" style={{
					left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s,
					'--dx': `${m.dx}px`, '--dy': `${m.dy}px`,
					'--dur': `${m.dur}s`, '--delay': `${m.delay}s`, '--o': m.o,
				}} />
			))}
		</>
	);
}