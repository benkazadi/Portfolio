export default function Gear({ className = '' }) {
	return (
		<svg className={`about-gear ${className}`} viewBox="0 0 100 100" aria-hidden="true">
			<circle className="gear-teeth" cx="50" cy="50" r="42" pathLength="100" />
			<circle className="gear-body" cx="50" cy="50" r="36" />
			<circle className="gear-body" cx="50" cy="50" r="12" />
			{[0, 60, 120].map((angle) => (
				<line
					key={angle}
					className="gear-spoke"
					x1="50" y1="14" x2="50" y2="86"
					transform={`rotate(${angle} 50 50)`}
				/>
			))}
		</svg>
	);
}
