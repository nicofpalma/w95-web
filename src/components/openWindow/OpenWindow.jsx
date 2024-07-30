import { useEffect, useRef, useState } from 'react';
import './OpenWindow.css';

export function OpenWindow({
    imgSrc, 
    imgHeight, 
    windowName, 
    isFocused, 
    isMinimized, 
    onMinimize, 
    onClose, 
    id, 
    children
}){

    const openWindowRef = useRef(null);
    const [isMinimizing, setIsMinimizing] = useState(false);
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


    useEffect(() => {
        if (isMinimizing) {
          const timer = setTimeout(() => {
            setIsMinimizing(false);
            onMinimize(id);
          }, 300);
          return () => clearTimeout(timer);
        }
    }, [isMinimizing, onMinimize, id]);


    const handleMouseDown = (e) => {
        const rect = openWindowRef.current.getBoundingClientRect();
        setIsDown(true);
        setOffset([rect.left - e.clientX, rect.top - e.clientY]);
    }

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

    const displayStyle = {
        display: isMinimized ? 'none' : 'block'
    };

    return (
        <div 
            className={`openWindow ${isFocused ? 'focused' : ''}`} 
            ref={openWindowRef}
            style={displayStyle}
            data-id={id}
        >
            <div className="openWindow-header" onMouseDown={handleMouseDown}>
                <div className="openWindow-title-logo">
                    <img src={`src/assets/${imgSrc}`} alt="" height={imgHeight} />
                    <p>{windowName}</p>
                </div>
            
                <div className="openWindow-header-btns">
                    <div className="openWindow-btn" title="Minimize" onMouseDown={handleStopMouseDown} onClick={onMinimize}>
                        <div className='openWindow-minimize-icon' id="minimize"></div>
                    </div>
                    <div className="openWindow-btn" title="Maximize" onMouseDown={handleStopMouseDown} onClick={handleMaximize}>
                        <div className='openWindow-maximize-icon' id="maximize"></div>
                    </div>
                    <div className="openWindow-btn" id="close" onMouseDown={handleStopMouseDown} onClick={onClose}></div>
                </div>
            </div>

            <div className="openWindow-body">
                {children}
            </div>
        </div>
    )
}