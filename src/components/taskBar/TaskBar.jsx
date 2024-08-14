import './TaskBar.css';
import { TimeWidget } from './TimeWidget';
import StartMenu from './StartMenu';
import { useState } from 'react';

export default function TaskBar({children}){
    const [activeStartMenu, setActiveStartMenu] = useState(false);

    const handleStartMenu = () => {
        setActiveStartMenu(!activeStartMenu);
    };

    return (
        <footer>
            <div className="tasks-container">
                <div className={`start-btn ${activeStartMenu ? 'btn-selected' : ''}`} onClick={() => handleStartMenu()}>
                    <img src="src/assets/start.png" height={"18px"} className="start-icon" ></img>
                </div>
                {children}
            </div>

            <TimeWidget />
            <StartMenu visible={activeStartMenu}/>
        </footer>
    )
}