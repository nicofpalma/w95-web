import { useEffect, useRef, useState } from "react";
import "./MSDOSConsole.css";

export default function MSDOSConsole(){

    const inputRef = useRef(null);
    const inputSpanRef = useRef(null);
    const textRenderRef = useRef(null);
    const caret = useRef(null);
    const labelInputRef = useRef(null);
    const [labelInputContent, setLabelInputContent] = useState("C:\\WINDOWS>");
    const [isRegistering, setIsRegistering] = useState(null);
    const [userData, setUserData] = useState({username: '', password: ''});

    const [consoleContent, setConsoleContent] = useState([]);

    const executeCommand = () => {
        const inputElement = inputRef.current;
        let consoleResponse = '';
        const command = inputElement.value.trim().toLowerCase();

        switch(command){
            case 'cls': {
                setConsoleContent([]);
                break;
            }
            case 'test': {
                // Only for test
                break;
            }
            case 'about': {
                consoleResponse = 'nichel.dev';
                break;
            }
            case 'register': {
                consoleResponse = 'Hi. You have entered the register command. You can enter a username and password that identifies you, and then log in.';
                setLabelInputContent("username: ");
                setIsRegistering({step: 0});
                break;
            }
            default:{
                consoleResponse = 'Bad command or file name';
                break;
            }
        }
    
        // Submit the used command to the consoleContent if command is different to cls
        if(command !== 'cls'){
            setConsoleContent(prevContent => {
                const usedCommand = labelInputRef.current.textContent + ' ' + command;
                const newTextContent = [
                    ...prevContent,
                    usedCommand,
                ];

                if(consoleResponse !== ''){
                    newTextContent.push(consoleResponse);
                }
            
                return newTextContent;
            });
        }

        // Delete input value and update caret
        inputElement.value = '';
        handleCaretPosition();
    }

    const handleInput = () => {
        handleCaretPosition();
    }

    const handleClick = () => {
        handleCaretPosition();
    };

    const handleRegister = async (step) => {
        const inputElement = inputRef.current;
        let consoleResponse = '';
        const command = inputElement.value.trim().toLowerCase();

        switch(step){
            case 0:{
                if(command === ''){
                    consoleResponse = 'Invalid username';
                } else {
                    setUserData({username: command, password: ''});
                    setIsRegistering({step: 1});
                    setLabelInputContent("password: ");
                }
                break;
            }
            case 1:{
                if(command === ''){
                    consoleResponse = 'Invalid password';
                } else {
                    setUserData(prev => ({username: prev.username, password: command}));                   
                    
                    try {
                        await registerUser({username: userData.username, password: command});
                        consoleResponse = 'Registration successful!'
                    } catch (error){
                        consoleResponse = 'Error registering user: ' + error.message;
                    }
                    setIsRegistering(null);
                    setLabelInputContent("C:\\WINDOWS>");
                }
                break;
            }
            case 2:{

                break;
            }
            default:{
                break;
            }
        }

        setConsoleContent(prevContent => {
            const usedCommand = labelInputRef.current.textContent + ' ' + command;
            const newTextContent = [
                ...prevContent,
                usedCommand,
            ];

            if(consoleResponse !== ''){
                newTextContent.push(consoleResponse);
            }
        
            return newTextContent;
        });

        inputElement.value = '';
        handleCaretPosition();
    }

    const registerUser = async (userData) => {
        const response = await fetch('https://w95simulator.rf.gd/api/users/setUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if(!response.ok){
            throw new Error('Failed to connect');
        }

        if(!response.success){
            throw new Error('username already exists, try another one');
        }

        const data = await response.json();
        return data;
    }

    const handleKeyDown = (e) => {
        switch(e.key){
            case 'Enter':
                if(isRegistering){
                    handleRegister(isRegistering.step);
                } else {
                    executeCommand();
                }
                break;
            default: 
                break;
        }
    }

    const handleCaretPosition = () => {
        const inputRect = inputRef.current.getBoundingClientRect();
        const spanRect = inputSpanRef.current.getBoundingClientRect();
        const caretPos = inputRef.current.selectionEnd;
        const text = inputRef.current.value.slice(0, caretPos);
        const textRenderRect = textRenderRef.current.getBoundingClientRect();

        textRenderRef.current.textContent = text.replace(/ /g, '\u00a0');

        caret.current.style.left = `${textRenderRect.width}px`;
        caret.current.style.top = `${inputRect.top - spanRect.top}px`; 
        caret.current.style.height = `${inputRect.height}px`; 
    }

    useEffect(() => {
        const inputElement = inputRef.current;
        handleCaretPosition();

        // Adjust margins
        const labelInput = labelInputRef.current;
        inputElement.style.marginLeft = `${labelInput.offsetWidth + 5}px`;
        caret.current.style.marginLeft = `${labelInput.offsetWidth + 5}px`;
    }, []);

    return (
        <div className="console-container">
            <div className="console-text" >
                {consoleContent.map((content, index) => (
                    <p key={index}>{content}</p>
                ))}
            </div>
            <span id="console-input-span" ref={inputSpanRef}>
                <label htmlFor="console-input" className="console-label" ref={labelInputRef}> {labelInputContent}</label>
                <span className="text-render" id="text-render" ref={textRenderRef}></span>
                <input 
                    type="text" 
                    className="console-input" 
                    id="console-input" 
                    autoComplete="off" 
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onClick={handleClick}
                    onKeyUp={handleCaretPosition}
                />
                <span className="blink-caret" id="blink-caret" ref={caret}>_</span>
            </span>
        </div>
    );
}