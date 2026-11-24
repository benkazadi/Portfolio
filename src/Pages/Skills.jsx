import { useRef, useState } from 'react';
import '../styles/panel.css';
import '../styles/skills.css';
import useScope from '../hooks/useScope';
import NextSection from '../components/NextSection.jsx';
import { BANDS } from './skillsData';

const pad = (n) => String(n + 1).padStart(2, '0');

export default function Skills({ onNext }) {
	// `tuned` = which band is selected. It starts on the first band so the
	// detail panel is never empty (important on phones, which can't hover).
	const [tuned, setTuned] = useState(0);
	const canvasRefs = useRef([]);
	useScope(canvasRefs, BANDS, tuned);

	const band = BANDS[tuned];
	const lit = Math.round(band.level * 10);

	return (
		<div className="fm-page">
			<div className="fm-grid">
				{/* ── THE SCOPE: one live waveform per band ───────────────── */}
				<section className="panel fm-scope" aria-label="Frequency bands">
					<p className="fm-eyebrow">&gt; FREQUENCY MAP: SCANNING {BANDS.length} BANDS</p>
					<p className="fm-hint">
						<span className="fm-hint--pointer">HOVER A BAND TO TUNE IN</span>
						<span className="fm-hint--touch">TAP A BAND TO TUNE IN</span>
					</p>
					<div className="panel__rule" />

					<ul className="fm-rows">
						{BANDS.map((b, i) => (
							<li key={b.id}>
								<button
									type="button"
									className={`fm-row ${i === tuned ? 'is-tuned' : ''}`}
									aria-pressed={i === tuned}
									// Hover tunes on a mouse; touch and keyboard use click/focus.
									onPointerEnter={(e) => e.pointerType === 'mouse' && setTuned(i)}
									onFocus={() => setTuned(i)}
									onClick={() => setTuned(i)}
								>
									<span className="fm-row__top">
										<span className="fm-row__name"><i>{pad(i)}</i> {b.name}</span>
										<span className="fm-row__status">{b.status}</span>
									</span>
									<canvas ref={(el) => { canvasRefs.current[i] = el; }} aria-hidden="true" />
								</button>
							</li>
						))}
					</ul>
				</section>

				{/* ── THE READOUT: details for the tuned band ─────────────── */}
				{/* key={band.id} makes React rebuild this block when the band
				    changes, which replays the glitch-in animation on it. */}
				<aside className="panel fm-detail" aria-live="polite">
					<div className="fm-detail__inner" key={band.id}>
						<p className="fm-eyebrow">FREQUENCY // {pad(tuned)}</p>
						<h2 className="fm-title">{band.name}</h2>

						<div className="fm-signal">
							<span className="fm-key">SIGNAL</span>
							<span className="fm-cells" aria-hidden="true">
								{Array.from({ length: 10 }, (_, i) => (
									<i key={i} className={`fm-cell ${i < lit ? 'is-lit' : ''}`} style={{ '--i': i }} />
								))}
							</span>
							<span className="fm-status">{band.status}</span>
						</div>

						<p className="fm-key">TOOLS</p>
						<ul className="fm-chips">
							{band.tools.map((tool) => <li key={tool} className="fm-chip">{tool}</li>)}
						</ul>

						<p className="fm-key">PROOF</p>
						{band.proof.length ? (
							<ul className="fm-chips">
								{band.proof.map((p) => <li key={p} className="fm-chip fm-chip--proof">{p}</li>)}
							</ul>
						) : (
							<p className="fm-none">NO FIELD RECORDS YET. STILL ACQUIRING.</p>
						)}
					</div>
				</aside>
			</div>

			{onNext && <NextSection label="PROJECTS" subtitle="FIELD EXPEDITIONS" onClick={onNext} />}
		</div>
	);
}
