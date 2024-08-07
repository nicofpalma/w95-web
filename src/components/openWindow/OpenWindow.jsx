import { useEffect, useRef, useState } from 'react';
import './OpenWindow.css';

export function OpenWindow({
    imgSrc, 
    imgHeight, 
    windowName, 
    isFocused, 
    isMinimized, 
    isResuming,
    onMinimize, 
    onClose, 
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

                const minX = 0;
                const maxX = window.innerWidth - openWindowRef.current.offsetWidth;
                const minY = 0;
                const maxY = window.innerHeight - openWindowRef.current.offsetHeight;

                openWindowRef.current.style.left = `${Math.max(minX, Math.min(newLeft, maxX))}px`;
                openWindowRef.current.style.top = `${Math.max(minY, Math.min(newTop, maxY))}px`;
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
        display: isMinimized ? 'none' : 'block'
    };
    console.log(isResuming);
    

    return (
        <div 
            className={`openWindow ${isFocused ? 'focused' : ''} ${isResuming ? 'resuming' : ''}`} 
            ref={openWindowRef}
            style={displayStyle}
            data-id={id}
        >
            <div 
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
            </div>



            <div className={`openWindow-body`}>
                {children}
            </div>
        </div>
    )
}