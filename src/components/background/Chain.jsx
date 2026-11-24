// Starts at the heart's anchor ring, sags, then climbs toward the black hole.
const PATH = 'M54 71.7 C 63.5 78.5, 83 68, 80 47 C 78.5 37, 76.5 30, 75.5 25.5';

// Links that snapped off and are being pulled toward the hole.
// x,y = start (% of scene) · dx,dy = how far they drift (vmin) · rot = tumble.
const LOOSE = [
	{ x: 69, y: 64, dx: 8, dy: -22, rot: 160, dur: 17, delay: -2 },
	{ x: 83, y: 54, dx: -5, dy: -20, rot: -200, dur: 21, delay: -9 },
	{ x: 66, y: 72, dx: 13, dy: -30, rot: 240, dur: 25, delay: -14 },
	{ x: 80, y: 40, dx: -3, dy: -12, rot: 120, dur: 14, delay: -5 },
];

export default function Chain() {
	return (
		<>
			<svg className="chain" viewBox="0 0 100 100" aria-hidden="true">
				<defs>
					{/* A mask fades the chain out as it nears the hole: a vertical
					    gradient where white = visible, dark = hidden. */}
					<linearGradient id="chain-fade" gradientUnits="userSpaceOnUse" x1="0" y1="74" x2="0" y2="24">
						<stop offset="0" stopColor="#fff" />
						<stop offset="0.6" stopColor="#fff" stopOpacity="0.85" />
						<stop offset="1" stopColor="#fff" stopOpacity="0.12" />
					</linearGradient>
					<mask id="chain-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
						<rect width="100" height="100" fill="url(#chain-fade)" />
					</mask>
				</defs>
				<g mask="url(#chain-mask)">
					<g className="chain__sway">
						<path className="chain__links" d={PATH} />
						<path className="chain__shine" d={PATH} />
						<path className="chain__holes" d={PATH} />
					</g>
				</g>
			</svg>

			{LOOSE.map((l, i) => (
				<i
					key={i}
					className="loose"
					style={{
						left: `${l.x}%`, top: `${l.y}%`,
						'--dx': `${l.dx}vmin`, '--dy': `${l.dy}vmin`,
						'--rot': `${l.rot}deg`, '--dur': `${l.dur}s`, '--delay': `${l.delay}s`,
					}}
				/>
			))}
		</>
	);
}