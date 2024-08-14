import './App.css';
import './scrollbar.css';

import MSDOSConsole from './components/apps/MSDOSConsole.jsx';
import Notepad from './components/apps/Notepad.jsx';
import OpenWindow from './components/openWindow/OpenWindow.jsx';
import TaskBar from './components/taskBar/TaskBar.jsx';
import ProgramTask  from './components/taskBar/ProgramTask.jsx';
import DesktopIcon from './components/desktopIcon/DesktopIcon.jsx';
import { useState } from 'react';

const componentMap = {
  MSDOSConsole,
  Notepad
};

// Global ID to get no colision
let globalWindowId = 0;

function App() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedWindowId, setFocusedWindowId] = useState(null);
  const [programTasks, setProgramTasks] = useState([]);

  // Add the program icons to the desktop
  const icons = [
    { imgSrc: 'msdos.png', imgHeight: '32px', programName: 'MS-DOS Prompt', elementAssoc: 'MSDOSConsole'},
    { imgSrc: 'notepad1.png', imgProgram: 'notepad2.png', imgHeight: '32px', programName: 'Notepad', savedName: 'hello.txt',  elementAssoc: 'Notepad'}
  ];

  const handleIconClick = (index) => {
    // Handle toggle click
    selectedIcon === index ? setSelectedIcon(null) : setSelectedIcon(index);
  };

  const handleIconDoubleClick = (index) => {
    const existingWindow = openWindows.find(window => (window.windowName === icons[index].programName)
      || (window.windowName === (`${icons[index].savedName} - ${icons[index].programName}`))
    );

    // Handle open the new window or focus the window if exists
    if(existingWindow){
      // Resume window if its minimized
      if(existingWindow.isMinimized){        
        const resumedWindow = {...existingWindow, isMinimized: false };
        const updatedWindows = openWindows.map(window => 
          window.id === existingWindow.id ? resumedWindow : window
        );
        setOpenWindows(updatedWindows);
        updateTask(existingWindow.id, {isMinimized: false});
      }

      setFocusedWindowId(existingWindow.id);
    } else {
      // Render the window and the internal component
      const ComponentToRender = componentMap[icons[index].elementAssoc];

      const newWindow = {
        id: globalWindowId++,
        imgSrc: icons[index].imgProgram ? icons[index].imgProgram : icons[index].imgSrc,
        imgHeight: "15px",
        windowName: icons[index].savedName ? `${icons[index].savedName} - ${icons[index].programName}` : icons[index].programName,
        content: ComponentToRender ? <ComponentToRender /> : null,
        isMinimized: false
      };
  
      setOpenWindows([...openWindows, newWindow]);
      setFocusedWindowId(newWindow.id);

      // Also set the program taskbar
      const newTask = {
        id: newWindow.id,
        imgSrc: newWindow.imgSrc,
        imgHeight: "18px",
        programName: newWindow.windowName,
        isMinimized: newWindow.isMinimized
      };

      setProgramTasks([...programTasks, newTask]);
    }
  }

  function updateWindow(searchId, props, focused){
    setOpenWindows(openWindows.map(window => 
      window.id === searchId ? {...window, ...props} : window
    ));
    focused ? setFocusedWindowId(searchId) : setFocusedWindowId(null);
  }

  function updateTask(searchId, props){
    setProgramTasks(programTasks.map(task =>
      task.id === searchId ? {...task, ...props} : task
    ));
  }

  const toggleHeaderButtons = (windowId, disabled) => {
    const windowElement = document.querySelector(`.openWindow[data-id="${windowId}"]`);
    const buttons = windowElement.querySelectorAll('.openWindow-btn');
    buttons.forEach(button => button.style.pointerEvents = disabled ? 'none' : 'auto');
  }

  const handleMinimize = (windowId) => {
    // Disable window buttons
    toggleHeaderButtons(windowId, true);
    updateWindow(windowId, {isMimizing: true, isMimized: false}, false);

    const windowElement = document.querySelector(`.openWindow[data-id="${windowId}"]`);
    const headerElement = windowElement.querySelector('.openWindow-header');
    const bodyElement = windowElement.querySelector('.openWindow-body');
    const programTaskElement = document.querySelector(`.program-task[data-id="${windowId}"]`);

    // Create a clon header
    const headerClone = headerElement.cloneNode(true);
    headerClone.classList.add('header-clone');
    windowElement.appendChild(headerClone);

    const headerRect = headerElement.getBoundingClientRect();
    sessionStorage.setItem(`headerRect_${windowId}`, JSON.stringify(headerRect));
    const programTaskRect = programTaskElement.getBoundingClientRect();

    // Calculate position of the task
    const headerCenterX = headerRect.left + headerRect.width / 2;
    const headerCenterY = headerRect.top + headerRect.height / 2;
    const programTaskCenterX = programTaskRect.left + programTaskRect.width / 2;
    const programTaskCenterY = programTaskRect.top + programTaskRect.height / 2;
    const translateX = programTaskCenterX - headerCenterX;
    const translateY = programTaskCenterY - headerCenterY;

    headerClone.style.setProperty('--minimize-x', `${translateX}px`);
    headerClone.style.setProperty('--minimize-y', `${translateY}px`);

    headerClone.classList.add('minimizing');
    bodyElement.classList.add('minimizing');

    setTimeout(() => {
        updateWindow(windowId, {isMinimized: true}, false);
        updateTask(windowId, {isMinimized: true});
        headerClone.remove(); 
        bodyElement.classList.remove('minimizing');

        // Toggle window buttons
        toggleHeaderButtons(windowId, false);
    }, 400);
  }

  const handleMaximize = (windowId) => {
    updateWindow(windowId, {isMinimized: false, isResuming: true}, true);
    updateTask(windowId, {isMinimized: false});
    toggleHeaderButtons(windowId, true);

    const windowElement = document.querySelector(`.openWindow[data-id="${windowId}"]`);
    const headerElement = windowElement.querySelector('.openWindow-header');
    const bodyElement = windowElement.querySelector('.openWindow-body');
    const programTaskElement = document.querySelector(`.program-task[data-id="${windowId}"]`);

    const storedHeaderRect = sessionStorage.getItem(`headerRect_${windowId}`);
    if(storedHeaderRect){
      const headerRect = JSON.parse(storedHeaderRect);
      
      const headerClone = headerElement.cloneNode(true);
      headerClone.classList.add('header-clone');
      windowElement.appendChild(headerClone);

      const programTaskRect = programTaskElement.getBoundingClientRect();

      const headerCenterX = headerRect.left + headerRect.width / 2;
      const headerCenterY = headerRect.top + headerRect.height / 2;
      const programTaskCenterX = programTaskRect.left + programTaskRect.width / 2;
      const programTaskCenterY = programTaskRect.top + programTaskRect.height / 2;
      const translateX = headerCenterX - programTaskCenterX;
      const translateY = headerCenterY - programTaskCenterY;

      headerClone.style.setProperty('--maximize-x', `${-translateX}px`);
      headerClone.style.setProperty('--maximize-y', `${-translateY}px`);

      headerClone.classList.add('maximizing');
      bodyElement.classList.add('maximizing');

      setTimeout(() => {
          updateWindow(windowId, {isMinimized: false, isResuming: false}, true);
          headerClone.remove();
          bodyElement.classList.remove('maximizing');
          toggleHeaderButtons(windowId, false);
      }, 400);

      sessionStorage.removeItem(`headerRect_${windowId}`);
    }
  }

  const handleProgramTaskClick = (programTaskId, programMinimized) => {
    console.log(programMinimized);
    if(programMinimized){
      handleMinimize(programTaskId);
    } else {
      handleMaximize(programTaskId);
    }
  }

  const handleCloseWindow = (windowId) => {
    const updatedWindows = openWindows.filter(task => task.id !== windowId);
    setOpenWindows(updatedWindows);

    const updatedTasks = programTasks.filter(task => task.id !== windowId);
    setProgramTasks(updatedTasks);

    if(focusedWindowId === windowId) setFocusedWindowId(null);
  }

  return (
    <>
      <section className='desktop-icon-container'>
        {icons.map((icon, index) => (
          <DesktopIcon
            key={index}
            imgSrc={icon.imgSrc}
            imgHeight={icon.imgHeight}
            programName={icon.savedName ? icon.savedName : icon.programName}
            elementAssoc={icon.elementAssoc}
            isSelected={selectedIcon === index}
            onClick={() => handleIconClick(index)}
            onDoubleClick={() => handleIconDoubleClick(index)}
          />
        ))}
      </section>
      
      <main className='open-programs-container'>
        {openWindows.map((window) => (
          <OpenWindow
            key={window.id} 
            id={window.id}
            imgSrc={window.imgSrc} 
            imgHeight={window.imgHeight} 
            windowName={window.windowName}
            isFocused={window.id === focusedWindowId}
            isMinimized={window.isMinimized}
            isMinimizing={window.isMimizing}
            isResuming={window.isResuming}
            onMinimize={() => handleMinimize(window.id)}
            onClose={() => handleCloseWindow(window.id)}
            onFocus={() => setFocusedWindowId(window.id)}
          >
            {window.content}
          </OpenWindow>
        ))}
      </main>

      <TaskBar>
        {programTasks.map((programTask) => (
          <ProgramTask
            key={programTask.id}
            id={programTask.id}
            imgSrc={programTask.imgSrc}
            imgHeight={programTask.imgHeight}
            programName={programTask.programName}
            isMinimized={programTask.isMinimized}
            onClick={() => handleProgramTaskClick(programTask.id, !programTask.isMinimized)}
          />
        ))}
      </TaskBar>
      
    </>
  )
}

export default App
