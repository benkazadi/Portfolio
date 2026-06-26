import { useEffect, useRef } from 'react';
import './styles/globals.css';

function Void() {
	return (
		<div className='content'>
			<p className='label'>SIGNAL DETECTED</p>
			<h1 className='name'>Ben Kazadi</h1>
			<p className='label'>FRAGMENT RECOVERED: </p>
			<p className='details'>"I build things because i need them to exist"</p>
		</div>
	);
}

function Node({ id }) {
	return(
		<button className={'node ' + (id == 'home' ? 'selected' : '')}></button>
	);
}


function App() {
	//=== Stars & Cursor===
	const starsContainerRef = useRef(null);
	const cursorRef = useRef(null);
	const ringsRef = useRef(null);
	const coreRef = useRef(null);

	useEffect(() => {
		const starField = starsContainerRef.current;
		const cursor = cursorRef.current;
		const rings = ringsRef.current;
		const core = coreRef.current;

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

		let targetTiltX = 0, targetTiltY = 0;
		let tiltX = 0, tiltY = 0;

		const lerp = (a, b, t) => a + (b - a) * t;
		const DEPTH = {stars: 4, rings: 15, core: 10};

		function parralaxEffect() {
			tiltX = lerp(tiltX, targetTiltX, 0.05);
			tiltY = lerp(tiltY, targetTiltY, 0.05);
			starField.style.transform = `translate(${tiltX * DEPTH.stars}px, ${tiltY * DEPTH.stars}px)`;
			rings.style.transform = `translate(${tiltX * DEPTH.rings}px, ${tiltY * DEPTH.rings}px)`;
			core.style.transform = `translate(${tiltX * DEPTH.core}px, ${tiltY * DEPTH.core}px)`;
			requestAnimationFrame(parralaxEffect);
		} 

		parralaxEffect();

		document.addEventListener('mousemove', (e) => {
			cursor.style.top = e.clientY + 'px';
			cursor.style.left = e.clientX + 'px';
			targetTiltX = (e.clientX / window.innerWidth - 0.5) * 2;
			targetTiltY = (e.clientY / window.innerHeight - 0.5) * 2;
		})
		document.addEventListener('mousedown', (e) => {
			const ripple = document.createElement('div');
			ripple.className = 'ripple';
			ripple.style.top = e.clientY + 'px';
			ripple.style.left = e.clientX + 'px';
			document.body.appendChild(ripple);
			setTimeout(() => {
				document.body.removeChild(ripple);
			}, 1000)
		})
	}, [])


	return (
		<main>
			<div ref={cursorRef} className='cursor'>
				<div className="cursor-dot"></div>
			</div>
			<div ref={starsContainerRef} className='starfield'></div>
			<div className="core-layer">
				<div className="core" ref={coreRef}></div>
				<div className="rings" ref={ringsRef}>
					<div className="ring">
						<div className="ring"></div>
					</div>
				</div>
			</div>
			<div className="sysinfo">
				<nav>
					<p>SIGNAL/LOST</p>
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
				<Void />
				<div className="navbar">
					<div className='back'>
						<button>←</button>
					</div>
					<Node id='home' />
					<Node id='info' />
					<Node id='about' />
					<Node id='projects' />
				</div>
			</div>
			<div className="vignette"></div>
		</main>
	);
}

export default App;