import './App.css';
import { MSDOSConsole } from './components/apps/MSDOSConsole.jsx';
import { OpenWindow } from './components/openWindow/OpenWindow.jsx';
import { TaskBar } from './components/taskBar/TaskBar.jsx';
import { ProgramTask } from './components/taskBar/ProgramTask.jsx';
import { DesktopIcon } from './components/desktopIcon/DesktopIcon.jsx';
import { useState } from 'react';

const componentMap = {
  MSDOSConsole,
};

function App() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedWindowId, setFocusedWindowId] = useState(null);
  const [programTasks, setProgramTasks] = useState([]);

  // Add the program icons to the desktop
  const icons = [
    { imgSrc: 'msdos.png', imgHeight: '32px', programName: 'MS-DOS Prompt', elementAssoc: 'MSDOSConsole'},
  ];

  const handleIconClick = (index) => {
    // Handle toggle click
    selectedIcon === index ? setSelectedIcon(null) : setSelectedIcon(index);
  };

  const handleIconDoubleClick = (index) => {
    const existingWindow = openWindows.find(window => window.windowName === icons[index].programName);

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
        id: openWindows.length,
        imgSrc: icons[index].imgSrc,
        imgHeight: "15px",
        windowName: icons[index].programName,
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

  const handleMinimize = (windowId) => {
    const windowElement = document.querySelector(`.openWindow[data-id="${windowId}"]`);
    const headerElement = windowElement.querySelector('.openWindow-header');
    const bodyElement = windowElement.querySelector('.openWindow-body');
    const taskbarElement = document.querySelector(`.program-task[data-id="${windowId}"]`);

    const headerRect = headerElement.getBoundingClientRect();
    const taskbarRect = taskbarElement.getBoundingClientRect();

    const translateX = taskbarRect.left - headerRect.left;
    const translateY = taskbarRect.top - headerRect.top;

    headerElement.style.setProperty('--minimize-x', `${translateX}px`);
    headerElement.style.setProperty('--minimize-y', `${translateY}px`);

    headerElement.classList.add('minimizing');
    bodyElement.classList.add('minimizing');

    setTimeout(() => {
        updateWindow(windowId, {isMinimized: true}, false);
        updateTask(windowId, {isMinimized: true});
        headerElement.classList.remove('minimizing');
        bodyElement.classList.remove('minimizing');
    }, 300);
  }

  const handleProgramTaskClick = (programTaskId, minimized) => {
    updateWindow(programTaskId, {isMinimized: minimized}, true);
    updateTask(programTaskId, {isMinimized: minimized});
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
      <div className='desktop-icon-container'>
        {icons.map((icon, index) => (
          <DesktopIcon
            key={index}
            imgSrc={icon.imgSrc}
            imgHeight={icon.imgHeight}
            programName={icon.programName}
            elementAssoc={icon.elementAssoc}
            isSelected={selectedIcon === index}
            onClick={() => handleIconClick(index)}
            onDoubleClick={() => handleIconDoubleClick(index)}
          />
        ))}
      </div>
      
      <div className='open-programs-container'>
        {openWindows.map((window) => (
          <OpenWindow
            key={window.id} 
            id={window.id}
            imgSrc={window.imgSrc} 
            imgHeight={window.imgHeight} 
            windowName={window.windowName}
            isFocused={window.id === focusedWindowId}
            isMinimized={window.isMinimized}
            onMinimize={() => handleMinimize(window.id)}
            onClose={() => handleCloseWindow(window.id)}
          >
            {window.content}
          </OpenWindow>
        ))}
      </div>

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
