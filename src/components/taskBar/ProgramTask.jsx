import './ProgramTask.css';

export default function ProgramTask({imgSrc, imgHeight, programName, isMinimized, id, onClick}){
    return (
        <div className={`program-task ${isMinimized ? 'minimized' : ''}`} onClick={onClick} data-id={id}>
            <img src={`src/assets/${imgSrc}`} height={imgHeight} alt="ProgramIcon" className="program-task-icon" />
            <p>{programName}</p>
        </div>
    )
}