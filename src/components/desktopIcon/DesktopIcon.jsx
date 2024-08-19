import './DesktopIcon.css';

export default function DesktopIcon({imgSrc, imgHeight, programName, isSelected, onClick, onDoubleClick, isShortcut}){    
    return (
        <div 
            className={`desktop-file ${isSelected ? 'icon-clicked' : ''}`} 
            draggable="true" 
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div>
                <div className={`desktop-icon-image-container ${isSelected ? 'icon-clicked' : ''}`}>
                    <img 
                        src={`src/assets/${imgSrc}`} 
                        height={imgHeight} 
                    />
                </div>
                {isShortcut && (
                    <div className='shortcut-icon-container'>
                        <img src='src/assets/shortcut.png' alt="" height={"12px"}/>
                    </div>
                )}


                <p className="icon-program-name">{programName}</p>
            </div>
        </div>
    )
}