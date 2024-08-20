import './TaskBar.css';
import { TimeWidget } from './TimeWidget';
import StartMenu from './StartMenu';
import { useState } from 'react';

export default function TaskBar({children, onOpenPopup}){
    const [activeStartMenu, setActiveStartMenu] = useState(false);

    const handleStartMenuVisibility = () => {
        setActiveStartMenu(!activeStartMenu);
    };

    return (
        <footer>
            <div className="tasks-container">
                <div className={`start-btn ${activeStartMenu ? 'btn-selected' : ''}`} onClick={() => handleStartMenuVisibility()}>
                    <img src="/assets/start.png" height={"18px"} className="start-icon" ></img>
                </div>
                {children}
            </div>

            <TimeWidget />
            <StartMenu visible={activeStartMenu} onShutdownClick={onOpenPopup} onClick={handleStartMenuVisibility}/>
        </footer>
    )
}