import { useEffect, useRef } from 'react';
import './styles/globals.css';

function App() {
	//=== Stars ===
	const starsContainerRef = useRef(null);

	useEffect(() => {
		const starField = starsContainerRef.current;
		for (let i = 0; i < 80; i++) {
			const star = document.createElement('div');
			star.className = 'star';

			//star config
			const size = Math.random() * 2 + 0.5;
			star.style.left = `${Math.floor(Math.random() * 100)}%`;
			star.style.top = `${Math.floor(Math.random() * 100)}%`;
			star.style.width = `${size}px`;
			star.style.height = `${size}px`;

			starField.appendChild(star);
		}
	}, [])

	return (
		<main>
			<div ref={starsContainerRef}></div>
			<div>
				<h1>This is my portfolio</h1>
			</div>
		</main>
	);
}

export default App;