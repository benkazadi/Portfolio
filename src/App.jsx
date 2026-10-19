import { useState } from 'react';
import './styles/globals.css';
import Navigation3D from './components/Navigation3D';
import Origin   from './Pages/Origin';
import About    from './Pages/About';
import Skills   from './Pages/Skills';
import Projects from './Pages/Projects';
import Contact  from './Pages/Contact';

const SECTIONS = [
	{ id: 'home',     label: 'HOME',     subtitle: 'SIGNAL DETECTED',   Component: Origin   },
	{ id: 'about',    label: 'ABOUT',    subtitle: 'IDENTITY ARCHIVE',  Component: About    },
	{ id: 'skills',   label: 'SKILLS',   subtitle: 'FREQUENCY MAP',     Component: Skills   },
	{ id: 'projects', label: 'PROJECTS', subtitle: 'FIELD EXPEDITIONS', Component: Projects },
	{ id: 'contact',  label: 'CONTACT',  subtitle: 'OPEN CHANNEL',      Component: Contact  },
];

export default function App() {
	const [activeId, setActiveId] = useState(null);
	const [mapOpen, setMapOpen]   = useState(false);

	const activeSection = SECTIONS.find((s) => s.id === activeId);
	const ActivePage    = activeSection?.Component;

	const handleEnterSection = (id) => {
		setActiveId(id);
		setMapOpen(false);
	};

	const handleOpenMap = () => setMapOpen(true);

	const handleCloseMap = () => setMapOpen(false);

	const inSection = activeId !== null;

	return (
		<div className="app">
			<header className="spatial-telemetry" aria-hidden="true">
				<div className="telemetry-top">
					<span>SIGNAL / LOST</span>
					<span className="telemetry-mark">◉ <i>SYS ONLINE</i></span>
				</div>
				<div className="telemetry-bottom">
					<span>GLON: 284.15° &nbsp;|&nbsp; GLAT: -12.44° &nbsp;|&nbsp; DIST: 42,019 LY</span>
					<span>INTEGRITY: 34%</span>
				</div>
			</header>
			{inSection && ActivePage && (
				<div className="section-world">
					{/* Parallax background */}
					<div className="section-bg" aria-hidden="true" />

					{/* Main section content */}
					<div className="section-body">
						<ActivePage />
						
						{/* Next section button */}
						{(() => {
						const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];
						const currentIndex = SECTION_IDS.indexOf(activeId);
						const nextId = SECTION_IDS[currentIndex + 1];
						const nextSection = SECTIONS.find(s => s.id === nextId);
						if (!nextSection) return null;
						return (
							<button className="next-section-button" onClick={() => setActiveId(nextId)}>
								<span className="next-section-label">{nextSection.label}</span>
								<span className="next-section-sub">{nextSection.subtitle}</span>
								<span className="next-section-arrow">↓</span>
							</button>
						);
						})()}
					</div>
				</div>
			)}

			{inSection && (
				<button
					className="nav-open-button"
					onClick={handleOpenMap}
					aria-label="Open navigation map"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C17A2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-locate-fixed preview-icon"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>
				</button>
			)}

			<div className={`map-wrapper ${!inSection ? 'is-primary' : 'is-overlay'} ${mapOpen ? 'is-open' : ''}`}>
				<Navigation3D
					onEnterSection={handleEnterSection}
					onClose={inSection ? handleCloseMap : undefined}
				/>
			</div>

		</div>
	);
}