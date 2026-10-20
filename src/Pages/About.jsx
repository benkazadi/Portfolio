import '../styles/about.css'
import NextSection from '../components/NextSection';

export default function About( { onNext } ) {
    return (
        <div className='about-content'>
            <h1 className='about-head'>ABOUT</h1>

            <h3>ENTRY 001:   ["IDENTITY"]</h3>
            <p>Ben Kazadi. Sophomore. Computer Science. Copperbelt University, Kitwe. </p>

            <h3>ENTRY 002:   ["ORIGIN"]</h3>
            <p>"I always loved creating, the thought of conjuring something that has value out of thin air always amazed me"</p>
            <p>"And it is this love for creation that got me into programming, writing, drawing and playing piano"</p>

            <h3>ENTRY 003: ["Philosophy"]</h3>
            <p className='philosophy'>
                <span>I want to make this thing </span>→
                <span>How does this actually work? </span>→
                <span>building it</span>→
                <span>breaking it</span>→
                <span>rebuilding it</span>
            </p>
            <h3>ENTRY 004: [FREQUENCIES... CLEARANCE PENDING]</h3>
            <h3 className='last-entry'>ENTRY 004: [LEARNING... CLEARANCE PENDING]</h3>
            <NextSection label="SKILLS" subtitle="FREQUENCY MAP" onClick={onNext} />
        </div>
    );
}