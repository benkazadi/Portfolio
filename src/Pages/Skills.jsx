import '../styles/skills.css'
import NextSection from '../components/NextSection';

export default function Skills( { onNext } ) {
    return (
        <div className='skills-content'>
            <h1>FREQUENCY MAP</h1>
            <p><i>Coming soon</i></p>
            <NextSection label="PROJECTS" subtitle="FIELD EXPEDITIONS" onClick={onNext} />
        </div>
    );
}