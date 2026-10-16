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
					</div>
				</div>
			)}

			{inSection && (
				<button
					className="nav-open-button"
					onClick={handleOpenMap}
					aria-label="Open navigation map"
				>
					{/* Simple compass/target icon built from CSS in globals */}
					<span className="nav-open-icon" aria-hidden="true">◎</span>
					<span className="nav-open-label">MAP</span>
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