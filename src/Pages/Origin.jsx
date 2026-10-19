import '../styles/Origin.css';

export default function Origin() {
	return (
		<div className='content home-content'>
			<p className='label'>[ SIGNAL DETECTED ]</p>
			<h1 className='name'>Ben Kazadi</h1>
			<p className='label'>FRAGMENT RECOVERED: </p>
			<p className='details'>"I learn things. Build things. Break things and repeat"</p>
			<p className='tags'>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 16" fill="none" stroke="#C17A2E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings preview-icon"><circle cx="12" cy="12" r="3"/></svg>
				<span>Software</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 16" fill="none" stroke="#C17A2E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings preview-icon"><circle cx="12" cy="12" r="3"/></svg>
				<span>Games</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 16" fill="none" stroke="#C17A2E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings preview-icon"><circle cx="12" cy="12" r="3"/></svg>
				<span>Experiments</span>
			</p>
		</div>
	);
}