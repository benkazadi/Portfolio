function HeartGear({ cx, cy, r, teeth, reverse = false, dur = 26 }) {
	const dash = (100 / teeth / 2).toFixed(3); // pathLength=100 → dash = half a tooth pitch
	return (
		<g
			className={`hg ${reverse ? 'hg--rev' : ''}`}
			style={{ transformOrigin: `${cx}px ${cy}px`, '--dur': `${dur}s` }}
		>
			<circle className="hg__teeth" cx={cx} cy={cy} r={r} pathLength="100"
				style={{ strokeDasharray: `${dash} ${dash}`, strokeWidth: r * 0.34 }} />
			<circle className="hg__body" cx={cx} cy={cy} r={r * 0.78} />
			<circle className="hg__hub" cx={cx} cy={cy} r={r * 0.2} />
			{[0, 60, 120].map((a) => (
				<line key={a} className="hg__spoke"
					x1={cx} y1={cy - r * 0.78} x2={cx} y2={cy + r * 0.78}
					transform={`rotate(${a} ${cx} ${cy})`} />
			))}
		</g>
	);
}

const RIVETS = [1, 2, 3, 4, 5, 6].map((i) => {
	const t = i / 7;
	return { x: 27 + 66 * t, y: 72 + 36 * t * (1 - t) };
});

export default function MechanicalHeart() {
	return (
		<div className="heart" aria-hidden="true">
			<i className="heart__glow" />
			<svg className="heart__svg" viewBox="0 0 120 120">
				<defs>
					<radialGradient id="hrt-halo" cx="50%" cy="50%" r="50%">
						<stop offset="0" stopColor="#C17A2E" stopOpacity="0.5" />
						<stop offset="0.45" stopColor="#C17A2E" stopOpacity="0.14" />
						<stop offset="1" stopColor="#C17A2E" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="hrt-body" cx="36%" cy="30%" r="80%">
						<stop offset="0" stopColor="#b98341" />
						<stop offset="0.38" stopColor="#6e4521" />
						<stop offset="0.78" stopColor="#2b190b" />
						<stop offset="1" stopColor="#120a05" />
					</radialGradient>
					<radialGradient id="hrt-lens" cx="50%" cy="50%" r="50%">
						<stop offset="0" stopColor="#c9791f" />
						<stop offset="0.55" stopColor="#5c2d0c" />
						<stop offset="1" stopColor="#1a0c04" />
					</radialGradient>
					<clipPath id="hrt-lensclip"><circle cx="60" cy="60" r="19" /></clipPath>
					<filter id="hrt-glow" x="-40%" y="-40%" width="180%" height="180%">
						<feGaussianBlur stdDeviation="2" />
					</filter>
				</defs>

				<circle className="heart__halo" cx="60" cy="62" r="58" fill="url(#hrt-halo)" />

				{/* pipes (behind the body) */}
				<path d="M44 38 C34 30 28 20 36 13 C41 9 48 12 50 18" className="heart__pipe" />
				<path d="M44 38 C34 30 28 20 36 13 C41 9 48 12 50 18" className="heart__pipe-shine" />
				<path d="M80 40 C91 33 99 27 103 17" className="heart__pipe heart__pipe--thin" />
				<circle cx="36" cy="13" r="3.2" className="heart__coupling" />
				<circle cx="103" cy="17" r="2.6" className="heart__coupling" />

				{/* body */}
				<circle cx="60" cy="64" r="34" fill="url(#hrt-body)" stroke="#5C3317" strokeWidth="1.2" />
				<path d="M27 72 Q60 90 93 72" className="heart__band" />
				<path d="M27 73.6 Q60 91.6 93 73.6" className="heart__band-shine" />
				{RIVETS.map((r, i) => <circle key={i} cx={r.x} cy={r.y + 3.6} r="1.1" className="heart__rivet" />)}

				{/* lens: a blurred copy gives the glow, the crisp ring sits on top */}
				<circle cx="60" cy="60" r="22" className="heart__bezel-glow" filter="url(#hrt-glow)" />
				<circle cx="60" cy="60" r="22" fill="#0a0604" />
				<circle cx="60" cy="60" r="19.5" fill="url(#hrt-lens)" />
				<g clipPath="url(#hrt-lensclip)">
					<HeartGear cx={54} cy={57} r={10} teeth={14} dur={26} />
					<HeartGear cx={70} cy={51} r={7} teeth={10} reverse dur={18.6} />
					<HeartGear cx={57} cy={73} r={6.5} teeth={9} reverse dur={16.7} />
				</g>
				<circle cx="60" cy="60" r="21" className="heart__bezel" />
				<path d="M45 52 A16 16 0 0 1 57 43" className="heart__glint" />

				{/* crown dial */}
				<circle cx="60" cy="31" r="6" className="heart__dial" />
				<line x1="60" y1="31" x2="60" y2="26.6" className="heart__needle" />

				{/* eye-ring the chain hangs from */}
				<circle cx="95.5" cy="76.5" r="3.8" className="heart__eye" />
			</svg>
		</div>
	);
}