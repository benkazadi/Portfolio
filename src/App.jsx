import { useEffect, useRef } from 'react';
import './styles/globals.css';

function App() {
	//=== Stars & Cursor===
	const starsContainerRef = useRef(null);
	const cursorRef = useRef(null);

	useEffect(() => {
		const starField = starsContainerRef.current;
		const cursor = cursorRef.current;
		for (let i = 0; i < 80; i++) {
			const star = document.createElement('div');
			star.className = 'star';

			//star config
			const size = Math.random() * 2 + 0.5;
			const duration = Math.random() * 25 + 15 + 's';
			const delay = Math.random() * -20 + 's';
			const dx = (Math.random() - 0.5) * 12 + 'px';
			const dy = (Math.random() - 0.5) * 12 + 'px';
			const opA = 0.08 + Math.random() * 0.15;
			const opB = 0.25 + Math.random() * 0.35;

			star.style.top = `${Math.floor(Math.random() * 100)}%`;
			star.style.left = `${Math.floor(Math.random() * 100)}%`;
			star.style.width = `${size}px`;
			star.style.height = `${size}px`;

			star.style.setProperty('--starDur', duration);
			star.style.setProperty('--starDel', delay);
			star.style.setProperty('--dx', dx);
			star.style.setProperty('--dy', dy);
			star.style.setProperty('--opacity-a', opA);
			star.style.setProperty('--opacity-b', opB);

			starField.appendChild(star);
		}

		document.addEventListener('mousemove', (e) => {
			cursor.style.top = e.clientY + 'px';
			cursor.style.left = e.clientX + 'px';
		})
	}, [])

	/*

	const hasVisitedThisSession = sessionStorage.getItem("hud_booted_session");

    if (!hasVisitedThisSession) {
      // 1. Tab opened for the first time: Play animation
      radarElement.classList.add("run-intro-animation");

      // 2. Set the temporary flag so page refreshes skip it
      sessionStorage.setItem("hud_booted_session", "true");
    } else {
      // 2. Page was refreshed: Force the HUD to be immediately visible
      radarElement.style.transform = "scale(1)";
      radarElement.style.opacity = "1";
    }
  });

  */
	return (
		<main>
			<div ref={cursorRef} className='cursor'>
				<div className="cursor-dot"></div>
			</div>
			<div ref={starsContainerRef}></div>
			<div className="core-layer">
				<div className="core"></div>
				<div className="rings">
					<div className="ring">
						<div className="ring"></div>
					</div>
				</div>
			</div>
			<div className="sysinfo">
				<nav>
					<p className="signal">SIGNAL/LOST</p>
					<div className="radar">
						<div className="dot"></div>
						<div className="sweep"></div>
					</div>
				</nav>
				<nav>
					<p>GLON: 284.15° | GLAT: -12.44° | DIST: 42,019 LY</p>
					<p>INTEGRITY: 34%</p>
				</nav>
			</div>
			<div className="main-info">
				<h1>This is my portfolio: SIGNAL/LOST</h1>
			</div>
			<div className="vignette"></div>
		</main>
	);
}

export default App;