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
    children,
    showMinimize = true,
    showMaximize = true,
    popup = false
}){

    const openWindowRef = useRef(null);
    const headerRef = useRef(null);
    //const [isMaximizing, setIsMaximizing] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousLeft, setPreviousLeft] = useState(0);
    const [previousTop, setPreviousTop] = useState(0);
    const [offset, setOffset] = useState([0, 0]);
    const [isDown, setIsDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if(isDown && !isMaximized && !popup){
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

    }, [isDown, offset, isMaximized, popup]);

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
        if(!isMaximized){
            setPreviousLeft(openWindowRef.current.style.left);
            setPreviousTop(openWindowRef.current.style.top);
            openWindowRef.current.style.left = '0';
            openWindowRef.current.style.top = '0';
        } else {
            openWindowRef.current.style.left = previousLeft;
            openWindowRef.current.style.top = previousTop;
        }

        setIsMaximized(!isMaximized);
    }

    const handleMinimize = () => {
        openWindowRef.current.classList.add('minimizing');
        onMinimize();
    }

    const displayStyle = {
        display: isMinimized ? 'none' : 'flex'
    };

    return (
        <article 
            className={`openWindow ${isFocused ? 'focused' : ''} ${isResuming ? 'resuming' : ''}  ${isMinimizing ? 'minimizing' : ''}  ${isMaximized ? 'maximized' : ''} ${popup ? 'centered' : ''}`
            } 
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

                    {showMinimize && (
                        <div 
                            className="openWindow-btn" 
                            title="Minimize" 
                            onMouseDown={handleStopMouseDown} 
                            onClick={handleMinimize}
                        >
                            <div className='openWindow-minimize-icon' id="minimize"></div>
                        </div>
                    )}

                    {showMaximize && (
                        <div 
                            className="openWindow-btn" 
                            title="Maximize" 
                            onMouseDown={handleStopMouseDown} 
                            onClick={handleMaximize}
                        >
                            <div className='openWindow-maximize-icon' id="maximize"></div>
                        </div>
                    )}
                    <div 
                        className="openWindow-btn" 
                        id="close" 
                        onMouseDown={handleStopMouseDown} 
                        onClick={onClose}
                    >
                        <div className='close-btn'></div>
                    </div>
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