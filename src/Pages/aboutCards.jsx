import { Fragment } from 'react';
import Dial from '../components/about/Dial';

const r = (i) => ({ '--i': i });

/* ── I · IDENTITY ───────────────────────────────────────────────────────── */
const IDENTITY_ROWS = [
	['NAME', 'Ben Kazadi'],
	['ROLE', 'Full-stack developer'],
	['BASE', 'Kitwe, Zambia'],
	['COORD', '12.8060°S 28.2386°E'],
	['SCHOOL', 'Copperbelt University'],
	['STATUS', 'Sophomore, CompSci'],
];

function IdentityBody() {
	return (
		<>
			<p className="about-prompt fx-reveal" style={r(0)}>&gt; SIGNAL SOURCE IDENTIFIED</p>
			<dl className="about-readout">
				{IDENTITY_ROWS.map(([key, value], i) => (
					<Fragment key={key}>
						<dt className="about-key fx-reveal" style={r(i + 1)}>{key}</dt>
						<dd className="about-val">
							<span className="about-typed" style={{ '--chars': value.length, '--i': i + 1 }}>
								{value}
							</span>
						</dd>
					</Fragment>
				))}
			</dl>
			<p className="about-hint fx-reveal" style={r(8)}>
				<span className="hint-pointer">&gt; SCROLL TO DECODE THE NEXT FRAGMENT</span>
				<span className="hint-touch">&gt; SWIPE TO DECODE THE NEXT FRAGMENT</span>
			</p>
		</>
	);
}

/* ── II · ORIGIN ────────────────────────────────────────────────────────── */
function OriginBody() {
	return (
		<>
			<p className="about-heading fx-reveal" style={r(0)}>Always creating.</p>
			<p className="about-para fx-reveal" style={r(1)}>
				I always loved creating. The thought of conjuring something that has value
				out of thin air always amazed me.
			</p>
			<p className="about-para fx-reveal" style={r(2)}>
				It is this love for <span className="about-amber">creation</span> that got me
				into programming, writing, drawing and playing piano.
			</p>
			<dl className="about-redactions">
				<dt className="about-key fx-reveal" style={r(3)}>WHAT FASCINATES ME</dt>
				<dd className="fx-reveal" style={r(4)}><span className="about-redacted">clearance pending</span></dd>
				<dt className="about-key fx-reveal" style={r(5)}>WHAT I AM BECOMING</dt>
				<dd className="fx-reveal" style={r(6)}><span className="about-redacted">clearance pending</span></dd>
			</dl>
		</>
	);
}

/* ── III · PHILOSOPHY ───────────────────────────────────────────────────── */
function PhilosophyBody() {
	return (
		<>
			<p className="about-quote fx-reveal" style={r(0)}>“I want to make this thing”</p>
			<span className="about-down fx-reveal" style={r(1)} aria-hidden="true">↓</span>
			<p className="about-quote fx-reveal" style={r(2)}>“How the hell does this actually work?”</p>
			<span className="about-down fx-reveal" style={r(3)} aria-hidden="true">↓</span>
			<ul className="about-loop">
				<li className="about-loop__step fx-reveal" style={r(4)}>building it</li>
				<li className="about-loop__sep fx-reveal" style={r(5)} aria-hidden="true">→</li>
				<li className="about-loop__step fx-reveal" style={r(6)}>breaking it</li>
				<li className="about-loop__sep fx-reveal" style={r(7)} aria-hidden="true">→</li>
				<li className="about-loop__step is-hot fx-reveal" style={r(8)}>rebuilding it</li>
				<li className="about-loop__icon fx-reveal" style={r(9)} aria-label="repeat">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
						<path d="M21 3v5h-5" />
					</svg>
				</li>
			</ul>
		</>
	);
}

/* ── IV · FREQUENCIES ───────────────────────────────────────────────────── */
const INTERESTS = [
	{ name: 'Experimentation', level: 0.95, tag: 'always on' },
	{ name: 'Software development', level: 0.9, tag: 'strong' },
	{ name: 'Web applications', level: 0.9, tag: 'strong' },
	{ name: 'AI / local tools', level: 0.7, tag: 'active' },
	{ name: 'Game development', level: 0.7, tag: 'exploring' },
	{ name: 'Creative technology', level: 0.68, tag: 'active' },
	{ name: 'Systems / networking', level: 0.58, tag: 'growing' },
];

function FrequenciesBody() {
	return (
		<>
			<p className="about-prompt fx-reveal" style={r(0)}>&gt; SCANNING BANDS</p>
			<ul className="about-bands">
				{INTERESTS.map((band, i) => (
					<li key={band.name} className="about-band fx-reveal" style={{ '--i': i + 1, '--level': band.level }}>
						<span className="about-band__name">{band.name}</span>
						<span className="about-band__tag">{band.tag}</span>
						<span className="about-vial" aria-hidden="true">
							<span className="about-vial__fill" />
						</span>
					</li>
				))}
			</ul>
			<p className="about-footnote fx-reveal" style={r(INTERESTS.length + 1)}>
				&gt; CURRENT DIRECTION: SEE NEXT FRAGMENT
			</p>
		</>
	);
}

/* ── V · ACQUIRING ──────────────────────────────────────────────────────── */
const SIGNALS = [
	{ label: 'C++', level: 0.35, status: 'in progress' },
	{ label: 'Godot / GDScript', level: 0.6, status: 'active' },
	{ label: 'Full-stack systems', level: 0.6, status: 'advancing' },
	{ label: 'Networking', level: 0.3, status: 'early signal' },
];

function AcquiringBody() {
	return (
		<>
			<p className="about-prompt fx-reveal" style={r(0)}>&gt; CURRENTLY ACQUIRING</p>
			<div className="about-dials">
				{SIGNALS.map((signal, i) => (
					<Dial key={signal.label} index={i + 1} {...signal} />
				))}
			</div>
			<p className="about-footnote fx-reveal" style={r(SIGNALS.length + 2)}>
				&gt; NEEDLES SHOW DEPTH, NOT A SKILL SCORE
			</p>
		</>
	);
}

export const CARDS = [
	{ id: 'identity', numeral: 'I', title: 'Identity', Body: IdentityBody },
	{ id: 'origin', numeral: 'II', title: 'Origin', Body: OriginBody },
	{ id: 'philosophy', numeral: 'III', title: 'Philosophy', Body: PhilosophyBody },
	{ id: 'frequencies', numeral: 'IV', title: 'Frequencies', Body: FrequenciesBody },
	{ id: 'acquiring', numeral: 'V', title: 'Acquiring', Body: AcquiringBody },
];
