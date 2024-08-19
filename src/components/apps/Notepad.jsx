import { useState } from 'react';
import './Notepad.css';
import ToolMenu from './ToolMenu';
import WindowTools from '../openWindow/WindowTools';

export default function Notepad(){
    const [activeToolMenu, setActiveToolMenu] = useState(null);
 
    const toggleToolsVisible = (index) => {
        setActiveToolMenu(prev => prev === index ? null : index);
    }

    const hideToolMenu = () => {
        setActiveToolMenu(null);
    }

    const menuOptions = [
        {name: 'File', options: [
            { text: 'New', enabled: true },
            { text: 'Open...', enabled: true },
            { text: 'Save', enabled: true },
            { text: 'Save As...', enabled: true },
            'line',
            { text: 'Page Setup...', enabled: true },
            { text: 'Print', enabled: false },  
            'line',
            { text: 'Exit', enabled: true }
        ]},
        {name: 'Edit', options: [
            {text: 'Undo      Ctrl+Z', enabled: true },
            {text: 'Cut         Ctrl+X', enabled: true },
            {text: 'Copy      Ctrl+C', enabled: true },
            {text: 'Paste     Ctrl+V', enabled: true },
            {text: 'Delete    Del', enabled: true},
            'line',
            {text: 'Select All', enabled: true},
            {text: 'Time/Date  F5', enabled: true},
            'line',
            {text: 'Word Wrap'}
        ]},
        {name: 'Search', options: [
            {text: 'Find', enabled: true},
            {text: 'Find Next    F3', enabled: true}
        ]},
        {name: 'Help', options: [
            {text: 'Help Topics', enabled: true},
            'line',
            {text: 'About Notepad', enabled: true}
        ]}
    ];

    const defaultValue = `Hello! My name is Nicolás. 
       _.-;;-._
'-..-'|   ||   |
'-..-'|_.-;;-._|
'-..-'|   ||   |
'-..-'|_.-''-._|

I'm a backend developer and I created this application 
to learn more about React, as I also have some frontend knowledge. 
I hope you enjoy it—I've tried to make it as close
to Windows 95 as possible :)
`;

    return (
        <>
            <div className="notepad" onClick={hideToolMenu}>
                <WindowTools>
                    {menuOptions.map((menu, index) => (
                        <div
                            key={menu.name}
                            className='tool-container'
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleToolsVisible(index)
                            }}
                        >
                            <p>{menu.name}</p>
                            <ToolMenu
                                options={menu.options}
                                visible={activeToolMenu === index}
                            />
                        </div>
                    ))}
                </WindowTools>
                <textarea 
                    name="notepadText" 
                    className='notepad-textarea' 
                    spellCheck="false" 
                    autoComplete='off'
                    defaultValue={defaultValue}
                >
                </textarea>
            </div>
        </>
    )
}    