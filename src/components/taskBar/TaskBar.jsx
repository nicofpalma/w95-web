import './TaskBar.css';
import { TimeWidget } from './TimeWidget';

export default function TaskBar({children}){

    const handleStartPrograms = () => {
        console.log('asd');
    };

    return (
        <footer>
            <div className="tasks-container">
                <div className="start-btn" onClick={() => handleStartPrograms()}>
                    <img src="src/assets/start.png" height={"18px"} className="start-icon" ></img>
                </div>
                {children}
            </div>
            <TimeWidget />

            <div className='start-programs-container'>
                <div className='start-program'>
                    <img src="src/assets/shutdown.png" alt="" height={"50px"} />
                    <p>Shut Down...</p>
                </div>
                <div className='tool-menu-line'></div>
            </div>
        </footer>
    )
}