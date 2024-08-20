import './App.css';
import './scrollbar.css';

import MSDOSConsole from './components/apps/MSDOSConsole.jsx';
import Notepad from './components/apps/Notepad.jsx';
import OpenWindow from './components/openWindow/OpenWindow.jsx';
import TaskBar from './components/taskBar/TaskBar.jsx';
import ProgramTask  from './components/taskBar/ProgramTask.jsx';
import DesktopIcon from './components/desktopIcon/DesktopIcon.jsx';
import { useState } from 'react';
import Popup from './components/openWindow/Popup.jsx';
import Shutdown from './components/apps/Shutdown.jsx';
import Calculator from './components/apps/Calculator.jsx';
import W95LoadingCursor from './components/cursor/W95LoadingCursor.jsx';
import DesktopProperties from './components/apps/DesktopProperties.jsx';

const componentMap = {
  MSDOSConsole,
  Notepad,
  Calculator
};

function App() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedWindowId, setFocusedWindowId] = useState(null);
  const [programTasks, setProgramTasks] = useState([]);
  const [globalWindowId, setGlobalWindowId] = useState(0);
  const [isShutdownPopupVisible, setIsShutdownPopupVisible] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if(isShutdown){
    document.body.style.backgroundColor = 'black';
    return null;
  }

  //TODO: Restart logic
  // const handleRestart = () => {
  //   setIsShuttingDown(true);
  //   setTimeout(() => {
  //     setIsShutdown(true);
  //   }, 3000); 

  //   setTimeout(() => {
  //     setIsShuttingDown(false);
  //     setIsShutdown(false);
  //     document.body.style.backgroundColor = 'var(--win95-backround-color)';
  //   }, 10000)
  // }

  const handleShutdown = () => {
    setIsShuttingDown(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsShutdown(true);
      setIsLoading(false);
    }, 3000); 
  }

  // Add the program icons and properties of the windows to the desktop
  const icons = [
    { imgSrc: 'msdos.png', 
      imgHeight: '32px', 
      programName: 'MS-DOS Prompt', 
      elementAssoc: 'MSDOSConsole',
      showMaximize: true,
      resizable: true,
      customBackground: 'black',
      isShortcut: true
    },
    { imgSrc: 'notepad1.png', 
      imgProgram: 'notepad2.png', 
      imgHeight: '32px', 
      programName: 'Notepad', 
      savedName: 'hello.txt',  
      elementAssoc: 'Notepad',
      showMaximize: true,
      resizable: true
    },
    { imgSrc: 'calculator.png', 
      imgHeight:'32px', 
      programName: 'Calculator', 
      elementAssoc: 'Calculator',
      showMaximize: false,
      showDisabledMaximize: true,
      resizable: false,
      isShortcut: true,
      customDimentions: [310, 300]
    }
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
        id: globalWindowId,
        imgSrc: icons[index].imgProgram ? icons[index].imgProgram : icons[index].imgSrc,
        imgHeight: "15px",
        windowName: icons[index].savedName ? `${icons[index].savedName} - ${icons[index].programName}` : icons[index].programName,
        content: ComponentToRender ? <ComponentToRender /> : null,
        isMinimized: false,
        showMaximize: icons[index].showMaximize,
        showDisabledMaximize: icons[index].showDisabledMaximize,
        resizable: icons[index].resizable,
        customDimentions: icons[index].customDimentions ? icons[index].customDimentions : [0, 0],
        customBackground: icons[index].customBackground
      };

      console.log(newWindow.windowName);
      console.log(icons[index].showMaximize);

      // Timeout to simulate slow pc
      setIsLoading(true);
      setTimeout(() => {
        setGlobalWindowId(globalWindowId + 1);
        console.log(globalWindowId);
        
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
        
      }, 100);

      // Loading cursor disable
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
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

  const openShutdownPopup = () => {
    setIsShutdownPopupVisible(!isShutdownPopupVisible);
  }

  return (
    <>

    {/* <OpenWindow
      key={-2}
      id={-2}
      windowName={'Display Properties'}
      showMaximize={false}
      showMinimize={false}
      resizable={false}
      isFocused={true}
      customDimentions={[500, 450]}
    >
      <DesktopProperties>

      </DesktopProperties>
    </OpenWindow> */}


    {isLoading && (
      <W95LoadingCursor/>
    )}
    
    <div className={isShuttingDown ? 'shutting-down' : ''}>
      {(isShuttingDown || isShutdownPopupVisible) && <div className='shutdown-overlay'></div>}
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
            isShortcut={icon.isShortcut}
          />
        ))}
      </section>
      
      <main className='open-programs-container'>

        {isShutdownPopupVisible && (
          <Popup
            key={-1}
            id={-1}
            imgSrc={''}
            windowName={'Shut Down Windows'}
            isFocused={true}
            visible={isShutdownPopupVisible}
            onClose={() => setIsShutdownPopupVisible(false)}
          >
            <Shutdown 
              onShutdown={handleShutdown}
              onNo={() => setIsShutdownPopupVisible(false)}
            />
          </Popup>
        )}

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
            showMaximize={window.showMaximize}
            showDisabledMaximize={window.showDisabledMaximize}
            resizable={window.resizable}
            customDimentions={window.customDimentions}
            customBackground={window.customBackground}
        
          >
            {window.content}
          </OpenWindow>
        ))}
      </main>

      <TaskBar onOpenPopup={openShutdownPopup}>
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
      
    </div>
    </>

  )
}

export default App
