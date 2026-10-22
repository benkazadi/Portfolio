const SWEEP = 240;
const START = -SWEEP / 2;

// Tick marks are computed once at module load, not on every render.
const TICKS = Array.from({ length: 13 }, (_, i) => {
	const a = ((START + i * (SWEEP / 12)) * Math.PI) / 180;
	const major = i % 4 === 0;
	const inner = major ? 32 : 35;
	const outer = 40;
	return {
		major,
		x1: 50 + inner * Math.sin(a),
		y1: 50 - inner * Math.cos(a),
		x2: 50 + outer * Math.sin(a),
		y2: 50 - outer * Math.cos(a),
	};
});

export default function Dial({ label, status, level, index = 0 }) {
	const angle = START + level * SWEEP;
	const arc = (level * (SWEEP / 360) * 100).toFixed(2); // as % of the full circle

	return (
		<figure
			className="about-dial fx-reveal"
			style={{ '--i': index, '--angle': `${angle}deg`, '--arc': arc }}
		>
			<svg className="about-dial__svg" viewBox="0 0 100 100" aria-hidden="true">
				<circle className="dial-bezel" cx="50" cy="50" r="47" />
				<circle className="dial-face" cx="50" cy="50" r="43" />
				{TICKS.map((t, i) => (
					<line key={i} className={`dial-tick ${t.major ? 'is-major' : ''}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
				))}
				{/* Both arcs are rotated 150° so the gap sits at the bottom. */}
				<circle className="dial-track" cx="50" cy="50" r="27" pathLength="100" transform="rotate(150 50 50)" />
				<circle className="dial-arc" cx="50" cy="50" r="27" pathLength="100" transform="rotate(150 50 50)" />
				{/* Two nested groups: the outer one trembles forever, the inner
				    one does the one-time sweep. They can't share an animation
				    because both would fight over the same `rotate` property. */}
				<g className="about-dial__sway">
					<g className="about-dial__needle">
						<line x1="50" y1="57" x2="50" y2="18" />
					</g>
				</g>
				<circle className="dial-hub" cx="50" cy="50" r="4.5" />
			</svg>
			<figcaption>
				<span className="about-dial__label">{label}</span>
				<span className="about-dial__status">{status}</span>
			</figcaption>
		</figure>
	);
}
