export default function BlackHole() {
	return (
		<div className="bh" aria-hidden="true">
			<i className="bh__glow" />
			<div className="bh__tilt">
				<div className="bh__flat bh__flat--back"><i className="bh__disk" /></div>
				<i className="bh__core" />
				<i className="bh__arch" />
				<i className="bh__halo" />
				<div className="bh__flat bh__flat--front"><i className="bh__disk" /></div>
			</div>
		</div>
	);
}