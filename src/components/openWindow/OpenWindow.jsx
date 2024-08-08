import { useEffect, useRef, useState } from 'react';
import './OpenWindow.css';

export default function OpenWindow({
    imgSrc, 
    imgHeight, 
    windowName, 
    isFocused, 
    isMinimized, 
    isMinimizing,
    isResuming,
    onMinimize, 
    onClose, 
    onFocus,
    id, 
    children
}){

    const openWindowRef = useRef(null);
    const headerRef = useRef(null);
    //const [isMaximizing, setIsMaximizing] = useState(false);
    const [offset, setOffset] = useState([0, 0]);
    const [isDown, setIsDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if(isDown){
                const newLeft = event.clientX + offset[0];
                const newTop = event.clientY + offset[1];
                openWindowRef.current.style.left = `${newLeft}px`;
                openWindowRef.current.style.top = `${newTop}px`;
            }
        }

        const handleMouseUp = () => {
            setIsDown(false);
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

    }, [isDown, offset]);

    const handleMouseDown = (e) => {
        const rect = openWindowRef.current.getBoundingClientRect();
        setIsDown(true);
        setOffset([rect.left - e.clientX, rect.top - e.clientY]);
    }

    // Prevents moving the window when touching on header buttons
    const handleStopMouseDown = (e) => {
        e.stopPropagation();
    }

    const handleMaximize = () => {
        openWindowRef.current.style.height = 'calc(100% - 56px)';
        openWindowRef.current.style.margin = '0';
        openWindowRef.current.style.width = 'calc(100% - 13px)';
        openWindowRef.current.style.top = '7px';
        openWindowRef.current.style.left = '7px';
    }

    const handleMinimize = () => {
        openWindowRef.current.classList.add('minimizing');
        onMinimize();
    }

    const displayStyle = {
        display: isMinimized ? 'none' : 'flex'
    };
    console.log(isResuming);
    

    return (
        <article 
            className={`openWindow ${isFocused ? 'focused' : ''} ${isResuming ? 'resuming' : ''} ${isMinimizing ? 'minimizing' : ''}`} 
            ref={openWindowRef}
            style={displayStyle}
            data-id={id}
            onClick={onFocus}
        >
            <header 
                className={`openWindow-header`} 
                onMouseDown={handleMouseDown}
                ref={headerRef}
            >
                <div className="openWindow-title-logo">
                    <img src={`src/assets/${imgSrc}`} alt="" height={imgHeight} />
                    <p>{windowName}</p>
                </div>
            
                <div className="openWindow-header-btns">
                    <div 
                        className="openWindow-btn" 
                        title="Minimize" 
                        onMouseDown={handleStopMouseDown} 
                        onClick={handleMinimize}
                    >
                        <div className='openWindow-minimize-icon' id="minimize"></div>
                    </div>
                    <div 
                        className="openWindow-btn" 
                        title="Maximize" 
                        onMouseDown={handleStopMouseDown} 
                        onClick={handleMaximize}
                    >
                        <div className='openWindow-maximize-icon' id="maximize"></div>
                    </div>
                    <div 
                        className="openWindow-btn" 
                        id="close" 
                        onMouseDown={handleStopMouseDown} 
                        onClick={onClose}
                    ></div>
                </div>
            </header>


            <main className="openWindow-content">
                <div className={`openWindow-body`}>
                    {children}
                </div>
            </main>
        </article>
    )
}