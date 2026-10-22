import Gear from './Gear';

export default function DeckCard({
	index, total, numeral, title,
	status, entering = false, depth = 0, deep = false, zIndex = 0,
	onBack, onForward, onJump, onLeave, leaveLabel,
	children,
}) {
	const live = status === 'active';
	const tab = live ? 0 : -1; // hidden cards must not be reachable with Tab
	const isFirst = index === 0;
	const isLast = index === total - 1;

	const classes = ['deck-card', `is-${status}`];
	if (status === 'exiting') classes.push('is-active'); // keeps the front-of-deck look
	if (entering) classes.push('is-entering');
	if (deep) classes.push('is-deep');

	return (
		<article
			className={classes.join(' ')}
			style={{ '--depth': depth, zIndex }}
			aria-hidden={!live}
			aria-label={`${title}, fragment ${index + 1} of ${total}`}
		>
			<span className="deck-card__static" aria-hidden="true" />

			<div className="deck-card__gears" aria-hidden="true">
				<Gear className="gear-lg" />
				<Gear className="gear-sm" />
			</div>

			<header className="deck-card__head">
				<span className="deck-card__badge" aria-hidden="true">{numeral}</span>
				<div className="deck-card__titles">
					<span className="deck-card__eyebrow">Transmission {String(index + 1).padStart(2, '0')}</span>
					<h2 className="deck-card__title">{title}</h2>
				</div>
				<span className={`deck-card__lamp ${entering ? 'is-decoding' : ''}`}>
					<span>{entering ? 'Decoding' : 'Signal lock'}</span>
				</span>
			</header>

			<div className="deck-card__rule" />

			<div className="deck-card__body">{children}</div>

			<footer className="deck-card__foot">
				<button
					type="button" className="deck-btn" onClick={onBack}
					disabled={isFirst} tabIndex={tab} aria-label="Previous fragment"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
				</button>

				<div className="deck-dots">
					{Array.from({ length: total }, (_, i) => (
						<button
							key={i} type="button" tabIndex={tab}
							className={`deck-dot ${i === index ? 'is-on' : ''}`}
							onClick={() => onJump(i)}
							aria-label={`Go to fragment ${i + 1}`}
							aria-current={i === index}
						/>
					))}
				</div>

				{isLast ? (
					<button
						type="button" className="deck-btn deck-btn--wide" onClick={onLeave}
						disabled={!onLeave} tabIndex={tab}
					>
						<span>{leaveLabel}</span>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
					</button>
				) : (
					<button
						type="button" className="deck-btn" onClick={onForward}
						tabIndex={tab} aria-label="Next fragment"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
					</button>
				)}
			</footer>
		</article>
	);
}
