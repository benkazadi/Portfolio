import '../styles/Projects.css'

function Project({ id, stack , title, CStatus, description, tags }) {
    return(
        <div className='project'>
            <header>
                <div>
                    <div className='id'>{id} // {stack}</div>
                    <h1>{title}</h1>
                </div>
                <div className='status'>{CStatus}</div>
            </header>
            <main>
                <p>{description}</p>
            </main>
            <section>
                {tags.map((n, i) => (
                    <div key={i}>{n}</div>
                ))}
            </section>
            <footer>
                <div>
                    <div className='github'>github</div>
                    <div className='live'>live</div>
                </div>
                <div className='dot'></div>
            </footer>
        </div>
    )
}
export default function Projects() {
    const projects = [
        {
            id: 'EXPEDITION_001',
            stack: 'NODE.JS',
            title: 'ACE',
            status: '● active',
            description: `
                A WhatsApp bot built on Baileys with a cocky, 
                sarcastic personality. Handles commands, 
                and conversations, and and small usefull tasks 
                such as downloading media fromthe internet.`,
            tags: ['Node.js', 'Baileys', 'ESM', 'WebSocket'],
            repo: 'https://...',
            live: null
        },
        {
            id: 'EXPEDITION_002',
            stack: 'HTML+CSS+JS',
            title: 'Periodic Table',
            status: 'active',
            description: '...',
            tags: ['React.js'],
            repo: 'https://github.com/benkazadi/Portfolio',
            live: 'https://benkazadi.vercel.app'
        },
        {
            id: 'EXPEDITION_003',
            stack: 'NODE.JS',
            title: 'NotePad',
            status: 'active',
            description: '...',
            tags: ['React.js', 'Node.js', 'Express.js', 'MySQL'],
            repo: 'https://...',
            live: null
        },
    ];
    return (
        <div className='project-body'>
            <h1>PROJECTS</h1>
            <div className='projects-grid'>
                {projects.map((n, i) => (
                    <Project key={i} id={n.id} stack={n.stack} title={n.title} CStatus={n.status} description={n.description} tags={n.tags} />
                ))}
            </div>
        </div>
    );
}