import { useRef } from 'react';
import '../styles/About.css';
import useCardDeck from '../hooks/useCardDeck';
import DeckCard from '../components/about/DeckCard';
import { CARDS } from './aboutCards';

const MAX_VISIBLE_DEPTH = 3;

export default function About({ onNext }) {
	const surfaceRef = useRef(null);
	const { activeIndex, leavingIndex, phase, goTo, forward, back } = useCardDeck({
		total: CARDS.length,
		surfaceRef,
	});

	return (
		<div className="about-page" ref={surfaceRef}>
			<div className="about-deck" role="region" aria-roledescription="carousel" aria-label="About Ben Kazadi">
				{CARDS.map(({ id, numeral, title, Body }, i) => {
					const offset = i - activeIndex;

					let status;
					if (phase === 'exiting' && i === leavingIndex) status = 'exiting';
					else if (offset === 0) status = 'active';
					else if (offset > 0) status = 'behind';
					else status = 'past';

					const depth = status === 'behind' ? Math.min(offset, MAX_VISIBLE_DEPTH) : 0;
					const front = status === 'active' || status === 'exiting';
					const zIndex = front ? 20 : status === 'behind' ? 10 - depth : 0;

					return (
						<DeckCard
							key={id}
							index={i}
							total={CARDS.length}
							numeral={numeral}
							title={title}
							status={status}
							entering={status === 'active' && phase === 'entering'}
							depth={depth}
							deep={offset > MAX_VISIBLE_DEPTH}
							zIndex={zIndex}
							onBack={back}
							onForward={forward}
							onJump={goTo}
							onLeave={onNext}
							leaveLabel="Skills"
						>
							<Body />
						</DeckCard>
					);
				})}
			</div>

			<p className="about-sr" aria-live="polite">
				{`Fragment ${activeIndex + 1} of ${CARDS.length}: ${CARDS[activeIndex].title}`}
			</p>
		</div>
	);
}
