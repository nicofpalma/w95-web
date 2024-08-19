import { useEffect, useState } from "react"

export default function W95Cursor(){
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        setPosition({x: event.clientX + 14, y: event.clientY + 11});
        const updateCursorPosition = (e) => {
            setPosition({x: e.clientX + 14, y: e.clientY + 11});

            // const cursorType = window.getComputedStyle(e.target).cursor;
            // if(cursorType === 'text' || cursorType === 'auto'){
            //     setIsVisible(false);
            // } else {
            //     setIsVisible(true);
            // }
        };
 
        window.addEventListener('mousemove', updateCursorPosition);
        document.body.style.cursor = 'none'; 
         

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
            document.body.style.cursor = 'auto'; 
        }
    }, []);

    return (
        
        <img
            src="src/assets/loadingcursor.png"
            alt="Cursor"
            style={{
                position:'fixed',
                top: position.y,
                left: position.x,
                width: "30px",
                height: '25px',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
                imageRendering: 'auto'
            }}
        />
        
    );
}