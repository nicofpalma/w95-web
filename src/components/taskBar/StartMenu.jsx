import React from "react";
import './StartMenu.css';

export default function StartMenu({
    visible
}){
    if(!visible) return null;

    const startMenuItems = [
        {
            imgSrc: "src/assets/shutdown.png",
            alt: "Shutdown",
            title: "Shutdown",
            label: "Shut Down..."
        },
        {
            imgSrc: "src/assets/run.png",
            alt: "Run",
            title: "Run",
            label: "Run..."
        },
        {
            imgSrc: "src/assets/help.png",
            alt: "Help",
            title: "Help",
            label: "Help"
        },
        {
            imgSrc: "src/assets/find.png",
            alt: "Find",
            title: "Find",
            label: "Find"
        },
        {
            imgSrc: "src/assets/settings.png",
            alt: "Settings",
            title: "Settings",
            label: "Settings"
        },
        {
            imgSrc: "src/assets/documents.png",
            alt: "Documents",
            title: "Documents",
            label: "Documents"
        },
        {
            imgSrc: "src/assets/programs.png",
            alt: "Programs",
            title: "Programs",
            label: "Programs"
        }
    ];

    return (
        <div className={`start-programs-container ${visible ? 'visible' : ''}`}>
        <div className="start-programs-content">
            <div className='sidelogo'>
                <img src="src/assets/sidelogo.png" alt="" />
            </div>
            <div className="start-programs-list">
                {startMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="start-program tool-menu-option">
                            <img src={item.imgSrc} alt={item.alt} title={item.title} />
                            <p>{item.label}</p>
                        </div>
                        {index < 1 && 
                            <div className='program-line-wrapper'>
                                <div className='start-program-line'></div>
                            </div>
                        }
                    </React.Fragment>
                ))}
            </div>

        </div>
    </div>
    )
}