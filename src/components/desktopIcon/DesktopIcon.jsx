import './DesktopIcon.css';

export default function DesktopIcon({imgSrc, imgHeight, programName, isSelected, onClick, onDoubleClick}){    
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
                <p className="icon-program-name">{programName}</p>
            </div>
        </div>
    )
}