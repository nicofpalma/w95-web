import './Shutdown.css';
import { useState } from 'react';

export default function Shutdown({onShutdown, onNo}){
    const [selectedOption, setSelectedOption] = useState('shutdown');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleShutdownClick = () => {
        onShutdown();
    }

    return (
        <div className='shutdown-popup'>
            <div className='shutdown-icon-container'>
                <img src="src/assets/shutdown2.png" alt="shutdown" />
            </div>

            <div className='shutdown-options'>
                <p>Are you sure you want to:</p>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="options" 
                            value="shutdown" 
                            checked={selectedOption === 'shutdown'}
                            onChange={handleChange}
                        />
                        <span className="custom-radio"></span>
                        Shut down the computer?
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="options" 
                            value="restart" 
                            checked={selectedOption === 'restart'}
                            onChange={handleChange}
                        />
                        <span className="custom-radio"></span>
                        Restart the computer?
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="options" 
                            value="restartmsdos" 
                            checked={selectedOption === 'restartmsdos'}
                            onChange={handleChange}
                        />
                        <span className="custom-radio"></span>
                        Restart the computer in MS-DOS mode?
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="options" 
                            value="logout" 
                            checked={selectedOption === 'logout'}
                            onChange={handleChange}
                        />
                        <span className="custom-radio"></span>
                        Close all programs and log on as a different user?
                    </label>
                </div>

                <div className='shutdown-action-btns'>
                    <button onClick={handleShutdownClick}>Yes</button>
                    <button onClick={onNo}>No</button>
                    <button>Help</button>
                </div>

            </div>

        </div>
    )
}