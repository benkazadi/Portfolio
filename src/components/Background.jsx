import { useRef } from 'react';
import useParallax from '../hooks/useParallax.js';
import BlackHole from './background/BlackHole.jsx';
import MechanicalHeart from './background/MechanicalHeart.jsx';
import Chain from './background/Chain';
import { Cog, PipeFragment, NearCog, Dust } from './background/Debris';

const between = (a, b) => a + Math.random() * (b - a);

const FAR_STARS = Array.from({ length: 120 }, () => ({
	x: between(0, 100), y: between(0, 100), s: between(0.8, 1.5), a: between(0.14, 0.45),
}));

const NEAR_STARS = Array.from({ length: 42 }, () => ({
	x: between(0, 100), y: between(0, 100), s: between(1.3, 2.4),
	a: between(0.2, 0.5), b: between(0.6, 0.95),
	dur: between(3, 8), delay: between(-8, 0), warm: Math.random() < 0.2,
}));

const GLINTS = Array.from({ length: 5 }, () => ({
	x: between(6, 94), y: between(6, 94), dur: between(4, 9), delay: between(-9, 0),
}));

/* variant="origin" → the full scene (black hole, heart, chain, debris)
   variant="sky"    → just the sky, for pages that need a quieter background

   Pages that aren't origin FADE the scene out instead of removing it, so
   switching sections doesn't pop. (See .bg--sky in the CSS.) */
export default function Background({ variant = 'origin' }) {
	const rootRef = useRef(null);
	useParallax(rootRef);

	return (
		<div ref={rootRef} className={`section-bg bg--${variant}`} aria-hidden="true">
			{/* depth = pixels of travel at the screen edge; bigger = feels closer */}
			<div className="bg-layer" style={{ '--depth': 2 }}>
				<i className="haze haze--rust" />
				<i className="haze haze--amber" />
				{FAR_STARS.map((s, i) => (
					<i key={i} className="bg-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, '--a': s.a }} />
				))}
			</div>

			<div className="bg-layer" style={{ '--depth': 5 }}>
				{NEAR_STARS.map((s, i) => (
					<i key={i} className={`bg-star bg-star--twinkle ${s.warm ? 'bg-star--warm' : ''}`}
						style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s,
							'--a': s.a, '--b': s.b, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` }} />
				))}
				{GLINTS.map((g, i) => (
					<i key={i} className="bg-star bg-star--glint"
						style={{ left: `${g.x}%`, top: `${g.y}%`, '--dur': `${g.dur}s`, '--delay': `${g.delay}s` }} />
				))}
			</div>

			<div className="bg-layer scene-only" style={{ '--depth': 9 }}>
				<div className="scene">
					{/* DOM order = paint order: chain first, so the hole's core
					    covers its far end, and the heart sits on top of its start. */}
					<Chain />
					<BlackHole />
					<MechanicalHeart />
				</div>
			</div>

			<div className="bg-layer scene-only" style={{ '--depth': 15 }}>
				<Cog className="cog--a" teeth={18} />
				<Cog className="cog--b" teeth={12} />
				<PipeFragment className="pipe--a" />
			</div>

			<div className="bg-layer" style={{ '--depth': 20 }}>
				<Dust />
			</div>

			<div className="bg-layer scene-only" style={{ '--depth': 30 }}>
				<NearCog />
			</div>

			<div className="bg-vignette" />
		</div>
	);
}