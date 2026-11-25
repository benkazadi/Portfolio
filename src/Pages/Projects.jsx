import '../styles/panel.css';
import '../styles/Projects.css';
import NextSection from '../components/NextSection';
import ProjectCard from '../components/ProjectCard';
import { PROJECTS } from './projectsData.js';

export default function Projects({ onNext }) {
	return (
		<div className="pj-page">
			<header className="pj-header">
				<p className="pj-eyebrow">&gt; FIELD EXPEDITIONS: {PROJECTS.length} RECORDS</p>
				<h1 className="pj-heading">Projects</h1>
			</header>

			<div className="pj-grid">
				{PROJECTS.map((project, i) => (
					<ProjectCard key={project.title} project={project} index={i} />
				))}
			</div>

			{onNext && <NextSection label="CONTACT" subtitle="CONTACT ME" onClick={onNext} />}
		</div>
	);
}