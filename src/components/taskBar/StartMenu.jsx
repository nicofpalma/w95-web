import React from "react";
import './StartMenu.css';

export default function StartMenu({
    visible,
    onShutdownClick,
    onClick
}){
    if(!visible) return null;

    const startMenuItems = [
        {
            imgSrc: "/assets/shutdown.png",
            alt: "Shutdown",
            title: "Shutdown",
            label: "Shut Down...",
            onClick: () => {    
                onClick();
                onShutdownClick();
            } 
        },
        {
            imgSrc: "/assets/run.png",
            alt: "Run",
            title: "Run",
            label: "Run...",
            onClick: onClick
        },
        {
            imgSrc: "/assets/help.png",
            alt: "Help",
            title: "Help",
            label: "Help",
            onClick: onClick
        },
        {
            imgSrc: "/assets/find.png",
            alt: "Find",
            title: "Find",
            label: "Find",
            onClick: onClick
        },
        {
            imgSrc: "/assets/settings.png",
            alt: "Settings",
            title: "Settings",
            label: "Settings",
            onClick: onClick
        },
        {
            imgSrc: "/assets/documents.png",
            alt: "Documents",
            title: "Documents",
            label: "Documents",
            onClick: onClick
        },
        {
            imgSrc: "/assets/programs.png",
            alt: "Programs",
            title: "Programs",
            label: "Programs",
            onClick: onClick
        }
    ];

    return (
        <div className={`start-programs-container ${visible ? 'visible' : ''}`}>
        <div className="start-programs-content">
            <div className='sidelogo'>
                <img src="/assets/sidelogo.png" alt="" />
            </div>
            <div className="start-programs-list">
                {startMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="start-program tool-menu-option" onClick={item.onClick}>
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