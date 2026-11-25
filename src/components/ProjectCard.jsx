const STATUS = {
	active: { label: 'Active', tone: 'live' },
	'in-progress': { label: 'In progress', tone: 'live' },
	complete: { label: 'Complete', tone: 'done' },
};

const Icon = ({ children }) => (
	<svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
);

export default function ProjectCard({ project, index }) {
	const { title, status, description, tags, repo, live } = project;
	const stamp = STATUS[status] ?? STATUS.active; // unknown status → safe fallback
	const id = `EXPEDITION_${String(index + 1).padStart(3, '0')}`;

	return (
		<article className="panel pj-card" style={{ '--i': index }}>
			<header className="pj-card__head">
				<div>
					<p className="pj-card__id">{id}</p>
					<h2 className="pj-card__title">{title}</h2>
				</div>
				<span className={`pj-stamp pj-stamp--${stamp.tone}`}>{stamp.label}</span>
			</header>

			<div className="panel__rule" />

			{description ? (
				<p className="pj-card__desc">{description}</p>
			) : (
				<p className="pj-card__desc pj-card__desc--pending">Field notes pending</p>
			)}

			<ul className="pj-tags">
				{tags.map((tag) => <li key={tag} className="pj-tag">{tag}</li>)}
			</ul>

			<footer className="pj-card__foot">
				{repo || live ? (
					<ul className="pj-links">
						{repo && (
							<li>
								<a className="pj-link" href={repo} target="_blank" rel="noreferrer"
									aria-label={`${title} source code on GitHub`}>
									<Icon><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></Icon>
									Source
								</a>
							</li>
						)}
						{live && (
							<li>
								<a className="pj-link" href={live} target="_blank" rel="noreferrer"
									aria-label={`${title} live site`}>
									<Icon><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></Icon>
									Live
								</a>
							</li>
						)}
					</ul>
				) : (
					<p className="pj-nolinks">No public links yet</p>
				)}
			</footer>
		</article>
	);
}