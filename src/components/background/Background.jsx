import { useEffect, useRef } from "react";

export default function Background() {
    const starContainerRef = useRef(null);

    useEffect(() => {
        const starContainer = starContainerRef.current;

        for(let i = 0; i < 60; i++) {
            const star = document.createElement("div");
            
            const randX = Math.floor(Math.random() * window.innerWidth);
            const randY = Math.floor(Math.random() * window.innerHeight);
            const size = Math.random();
            const opacity = Math.random();

            star.className = 'star';
            star.style.left = randX + 'px';
            star.style.top = randY + 'px';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.opacity = opacity;

            starContainer.appendChild(star);
        }
    }, []);
    return (
        <div className="section-bg">
            <div className="star-container" ref={starContainerRef}>
                <div className="smudge"></div>
            </div>
        </div>
    );
}