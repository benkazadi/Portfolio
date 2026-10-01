import { useEffect, useRef, useState } from 'react';
import './styles/globals.css';
import Origin from './Pages/Origin';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Skills from './Pages/Skills';
import Projects from './Pages/Projects';


// pass the currentTab useState to be used when clicked on the node
function Node({ id, currentTab, onNavigate }) {
	const selected = id == currentTab ? 'selected' : '';
	return(
		<div onClick={() => {onNavigate(id)}} className='node-container'>
			<button className={'node ' + selected}></button>
		</div>
	);
}

const VIEWS = {home: Origin, about: About, skills: Skills, projects: Projects, contact: Contact };

function App() {
	const [currentTab, setCurrentTab] = useState('home');
	const ActiveView = VIEWS[currentTab];

	//=== Stars & Cursor===
	const starsContainerRef = useRef(null);
	const cursorRef = useRef(null);
	const ringsRef = useRef(null);
	const coreRef = useRef(null);

	//=== moving stars, cursor & parallax ===
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

		// multiplies the distance between two points by a small number and adds it to point a
		// This is done many times, the number reduce in each iteration
		// so it slows down
		const lerp = (a, b, t) => a + (b - a) * t;
		const DEPTH = {stars: 4, rings: 15, core: 10};

		function parralaxEffect() {
			tiltX = lerp(tiltX, targetTiltX, 0.05);
			tiltY = lerp(tiltY, targetTiltY, 0.05);
			starField.style.transform = `translate(${tiltX * DEPTH.stars}px, ${tiltY * DEPTH.stars}px)`;
			rings.style.transform = `translate(${tiltX * DEPTH.rings}px, ${tiltY * DEPTH.rings}px)`;
			core.style.transform = `translate(${tiltX * DEPTH.core}px, ${tiltY * DEPTH.core}px)`;
			requestAnimationFrame(parralaxEffect); // to run every frame
		} 

		parralaxEffect();

		document.addEventListener('mousemove', (e) => {
			cursor.style.top = e.clientY + 'px';
			cursor.style.left = e.clientX + 'px';
			targetTiltX = (e.clientX / window.innerWidth - 0.5) * 2; // forgot why i did this haha
			targetTiltY = (e.clientY / window.innerHeight - 0.5) * 2; // i'll keep it cuz i don't understand it yet
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
	}, []);

	//=== Scrolling transition
	const transitionProgress = useRef(0);
	const transitionDirection = useRef(null);
	const isTransitioning = useRef(false);
	const pendingSection = useRef(null);

	useEffect(() => {
		const SECTIONS = ['home', 'about', 'skills', 'projects', 'contact'];
  		const STEP = 0.01;

		function handleWheel(e) {
			const direction = e.deltaY > 0 ? 'forward' : 'back';
    		const currentIndex = SECTIONS.indexOf(currentTab);

			if (!isTransitioning.current) {
				if (direction === 'forward' && currentIndex < SECTIONS.length - 1) {
					isTransitioning.current = true;
					transitionDirection.current = 'forward';
					pendingSection.current = SECTIONS[currentIndex + 1];
				} else if (direction === 'back' && currentIndex > 0) {
					isTransitioning.current = true;
					transitionDirection.current = 'back';
					pendingSection.current = SECTIONS[currentIndex - 1];
				}
				return
			}

			if (direction === transitionDirection.current) {
				transitionProgress.current = Math.min(transitionProgress.current + STEP, 1);
			} else {
				transitionProgress.current = Math.max(transitionProgress.current - STEP, 0);
				if (transitionProgress.current === 0) {
					isTransitioning.current = false;
					pendingSection.current = null;
					transitionDirection.current = null;
				}
			}

			if (transitionProgress.current >= 1) {
				setCurrentTab(pendingSection.current);
				transitionProgress.current = 0;
				isTransitioning.current = false;
				pendingSection.current = null;
				transitionDirection.current = null;
			}
		}

		window.addEventListener("wheel", handleWheel, false);
		return () => window.removeEventListener('wheel', handleWheel);
	}, [currentTab])


	const mainInfoRef = useRef(null);
	useEffect(() => {
		const mainContent = mainInfoRef.current;

		const applyTransition = () => {
			const p = transitionProgress.current;
			const dir = transitionDirection.current;

			const blur    = p * 16;
			const opacity = 1 - p * 0.9;

			const scale = dir === 'forward'
				? 1 + p * 0.5
				: 1 - p * 0.15;

			mainContent.style.filter    = `blur(${blur}px)`;
			mainContent.style.transform = `scale(${scale})`;
			mainContent.style.opacity   = opacity;

			requestAnimationFrame(applyTransition);
		}

		applyTransition()
	}, [])

	function navigate(targetId) {
		const SECTIONS = ['home', 'about', 'skills', 'projects', 'contact'];
		const currentIndex = SECTIONS.indexOf(currentTab);
		const targetIndex = SECTIONS.indexOf(targetId);
		if (targetId === currentTab) return;

		transitionDirection.current = targetIndex > currentIndex ? 'forward' : 'back';
		pendingSection.current = targetId;
		isTransitioning.current = true;

		transitionProgress.current = 1;
		setCurrentTab(targetId);
		transitionProgress.current = 0;
		isTransitioning.current = false;

		const blur = document.createElement("div");
		blur.className = "blur";
		document.body.appendChild(blur);
		setTimeout(() => {
			document.body.removeChild(blur);
		}, 1000);
	}

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
			<div className="main-info" ref={mainInfoRef}>
				<ActiveView />
			</div>

			<div className="navbar">
				<button className='back'>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17A2E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left preview-icon"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
				</button>
				<Node id='home' currentTab={currentTab} setCurrentTab={setCurrentTab} onNavigate={navigate} />
				<Node id='about' currentTab={currentTab} setCurrentTab={setCurrentTab} onNavigate={navigate} />
				<Node id='skills' currentTab={currentTab} setCurrentTab={setCurrentTab} onNavigate={navigate} />
				<Node id='projects' currentTab={currentTab} setCurrentTab={setCurrentTab} onNavigate={navigate} />
				<Node id='contact' currentTab={currentTab} setCurrentTab={setCurrentTab} onNavigate={navigate} />
			</div>
		</main>
	);
}

export default App;