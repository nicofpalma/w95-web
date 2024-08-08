import './TaskBar.css';
import { TimeWidget } from './TimeWidget';

export default function TaskBar({children}){

    return (
        <footer>
            <div className="tasks-container">
                <div className="start-btn">
                    <img src="src/assets/start.png" height={"18px"} className="start-icon"></img>
                </div>
                {children}
            </div>
            <TimeWidget />
        </footer>
    )
}