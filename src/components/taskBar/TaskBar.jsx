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
                <div className="start-programs-content">
                    <div className='sidelogo'>
                        <img src="src/assets/sidelogo.png" alt="" />
                    </div>
                    <div className="start-programs-list">
                        <div className='start-program tool-menu-option'>
                            <img src="src/assets/shutdown.png" alt="Shutdown" title='Shutdown' height={"35px"}/>
                            <p>Shut Down...</p>
                        </div>

                        <div className='tool-menu-line'></div>
                        
                        <div className='start-program tool-menu-option'>
                            <img src="src/assets/run.png" alt="Run" title="Shutdown" height={"35px"}/>
                            <p>Run...</p>
                        </div>

                        <div className="start-program tool-menu-option">
                            <img src="src/assets/help.png" alt="Help" title='Help' height={"30px"}/>
                            <p>Help</p>
                        </div>

                        <div className="start-program tool-menu-option">
                            <img src="src/assets/find.png" alt="" height={"40px"} />
                            <p>Find</p>
                        </div>

                        <div className="start-program tool-menu-option">
                            <img src="src/assets/settings.png" alt="" />
                            <p>Settings</p>
                        </div>

                        <div className='start-program tool-menu-option'>
                            <img src="src/assets/documents.png" alt="" />
                            <p>Documents</p>
                        </div>

                        <div className='start-program tool-menu-option'>
                            <img src="src/assets/programs.png" alt="" />
                            <p>Programs</p>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    )
}