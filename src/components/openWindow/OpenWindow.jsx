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
    showDisabledMaximize = false,
    popup = false,
    resizable = true,
    customDimentions = [0, 0],
    customBackground
}){

    const openWindowRef = useRef(null);
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousPosition, setPreviousPosition] = useState({left: 0, top: 0});
    const [offset, setOffset] = useState([0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleMouseDown = (e) => {
        const rect = openWindowRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffset([rect.left - e.clientX, rect.top - e.clientY]);
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    const handleMaximize = () => {    
        if(!isMaximized){
            setPreviousPosition({
                left: openWindowRef.current.style.left,
                top: openWindowRef.current.style.top
            });
            openWindowRef.current.style.left = '0';
            openWindowRef.current.style.top = '0';
        } else {
            openWindowRef.current.style.left = previousPosition.left;
            openWindowRef.current.style.top = previousPosition.top;
        }

        setIsMaximized(!isMaximized);
    }

    const handleMinimize = () => {
        openWindowRef.current.classList.add('minimizing');
        onMinimize();
    }
    
    const handleClick = () => {
        onFocus ? onFocus() : null;
    }

    const displayStyle = {
        display: isMinimized ? 'none' : 'flex'
    };

    useEffect(() => {
        // Handle custom dimentions
        if(customDimentions && customDimentions[0] !== 0 && customDimentions[1] !== 0){
            openWindowRef.current.style.height = `${customDimentions[0]}px`;
            openWindowRef.current.style.width = `${customDimentions[1]}px`;
        }

        const handleMouseMove = (event) => {
            if(isDragging && !isMaximized && !popup){
                const newLeft = event.clientX + offset[0];
                const newTop = event.clientY + offset[1];
                openWindowRef.current.style.left = `${newLeft}px`;
                openWindowRef.current.style.top = `${newTop}px`;
            }
        }    

        if(isDragging){
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);

        !customBackground ? contentRef.current.style.backgroundColor = 'var(--main-grey-color)' :
            contentRef.current.style.backgroundColor = customBackground;

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            clearTimeout(timer);
        }
    }, [isDragging, isMaximized, offset, popup, customDimentions, customBackground]);

    return (
        <article 
            className={`openWindow ${(isFocused && !popup) ? 'focused' : ''} ${isResuming ? 'resuming' : ''}  ${isMinimizing ? 'minimizing' : ''}  ${isMaximized ? 'maximized' : ''} ${popup ? 'centered' : ''} ${resizable ? '' : 'not-resizable'} ${(isFocused && popup) ? 'focused-popup' : ''}`
            } 
            ref={openWindowRef}
            style={displayStyle}
            data-id={id}
            onClick={handleClick}
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
                            onMouseDown={(e) => e.stopPropagation()} 
                            onClick={handleMinimize}
                        >
                            <div className='openWindow-minimize-icon' id="minimize"></div>
                        </div>
                    )}

                    {showMaximize && (
                        <div 
                            className="openWindow-btn" 
                            title="Maximize" 
                            onMouseDown={(e) => e.stopPropagation()} 
                            onClick={handleMaximize}
                        >
                            <div className='openWindow-maximize-icon' id="maximize"></div>
                        </div>
                    )}

                    
                    {showDisabledMaximize && (
                        <div 
                            className="openWindow-btn disabled" 
                            title="Maximize" 
                            onMouseDown={(e) => e.stopPropagation()} 
                        >
                            <div className='openWindow-maximize-icon' id="maximize"></div>
                        </div>
                    )}

                    <div 
                        className="openWindow-btn" 
                        id="close" 
                        onMouseDown={(e) => e.stopPropagation()} 
                        onClick={onClose}
                    >
                        <div className='close-btn'></div>
                    </div>
                </div>
            </header>

                <main className="openWindow-content" ref={contentRef}>
                {isLoaded ? (
                    <div className={`openWindow-body`}>
                        {children}
                    </div>
                ) : null}
                </main>
         

        </article>
    )
}