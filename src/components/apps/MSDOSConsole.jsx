import { useEffect, useRef, useState } from "react";
import "./MSDOSConsole.css";
import { isLoggedIn, loginUser, logout, registerUser } from "../../api/user";

export default function MSDOSConsole(){

    const inputRef = useRef(null);
    const inputSpanRef = useRef(null);
    const textRenderRef = useRef(null);
    const caret = useRef(null);
    const labelInputRef = useRef(null);
    const [labelInputContent, setLabelInputContent] = useState("C:\\WINDOWS>");
    const [isGivingCredentials, setIsGivingCredentials] = useState(null);
    const [userData, setUserData] = useState({username: '', password: ''});
    const [consoleContent, setConsoleContent] = useState([]);

    const allowedCommands = ['cls', 'test', 'about', 'register', 'login', 'logout', 'test'];

    const executeCommand = async () => {
        const inputElement = inputRef.current;
        let consoleResponse = '';
        const command = inputElement.value.trim().toLowerCase();

        switch(command){
            case 'help': {
                const commandsList = allowedCommands.join(', ');
                consoleResponse = `Avaible commands: ${commandsList}`;
                break;
            }
            case 'cls': {
                setConsoleContent([]);
                break;
            }
            case 'test': {
                // Only for test
                break;
            }
            case 'about': {
                consoleResponse = 'https://github.com/nicofpalma';
                break;
            }
            case 'register': {
                if(userData.username === '' || userData.password === ''){
                    consoleResponse = 'Hi. You have entered the register command. You can enter a username and password that identifies you, and then log in.';
                    setLabelInputContent("username: ");
                    setIsGivingCredentials({step: 0});
                } else {
                    consoleResponse = "You have an active session. Put the command 'logout' before to create another user.";
                }
                break;
            }
            case 'login': {
                if(userData.username === '' || userData.password === ''){
                    consoleResponse = 'Enter your username and password below to login.';
                    setLabelInputContent("username: ");
                    setIsGivingCredentials({step: 2});
                } else {
                    try {
                        await loginUser(userData);
                        consoleResponse = `Successfully logged in, ${userData.username}!`;
                    } catch(error){
                        consoleResponse = 'Login error: ' + error.message;
                    }
                    setIsGivingCredentials(null);
                    setLabelInputContent("C:\\WINDOWS>");
                }
                break;
            }
            case 'logout':
                try {
                    await isLoggedIn();
                    await logout();

                    consoleResponse = `Logged out. See again later ${userData.username}!`
                } catch (error){
                    consoleResponse = 'Logout error: ' + error.message;
                }
                setUserData({username: '', password: ''});
                break;
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

    const handleCredentials = async (step) => {
        const inputElement = inputRef.current;
        let consoleResponse = '';

        let command = '';
        if(isGivingCredentials.step === 1 || isGivingCredentials.step === 3){
            command = inputElement.value.trim();
        } else {
            command = inputElement.value.trim().toLowerCase();
        }

        const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
        const passwordRegex = /^.{6,}$/;

        switch(step){
            // Username 
            case 0:{
                if(command === '' || !usernameRegex.test(command)){
                    consoleResponse = 'Invalid username. It must be at least 4 characters long and have no special characters.';
                } else {
                    setUserData({username: command, password: ''});
                    setIsGivingCredentials({step: 1});
                    setLabelInputContent("password: ");
                }
                break;
            }
            // Password
            case 1:{
                if(command === '' || !passwordRegex.test(command)){
                    consoleResponse = 'Invalid password. Must be at least 6 characters long.';
                } else {
                    setUserData(prev => ({username: prev.username, password: command}));                   
                    
                    try {
                        await registerUser({username: userData.username, password: command});
                        consoleResponse = 'Registration successful!';
                    } catch (error){
                        consoleResponse = 'Error registering user: ' + error.message;
                    }
                    setIsGivingCredentials(null);
                    setLabelInputContent("C:\\WINDOWS>");
                }
                break;
            }
            // Login username
            case 2:{
                if(command === '' || !usernameRegex.test(command)){
                    consoleResponse = 'Invalid username. Must be at least 6 characters long.';
                } else {
                    setUserData({username: command, password: ''});
                    setIsGivingCredentials({step: 3});
                    setLabelInputContent("password: ");
                }
                break;
            }

            // Login password
            case 3:{
                if(command === '' || !passwordRegex.test(command)){
                    consoleResponse = 'Invalid password. Must be at least 6 characters long.';
                } else {
                    setUserData(prev => ({username: prev.username, password: command}));

                    try {
                        await loginUser({username: userData.username, password: command});
                        consoleResponse = `Successfully logged in, ${userData.username}!`;
                    } catch (error){
                        consoleResponse = 'Login error: ' + error.message;
                        setUserData({username: '', password: ''});
                    }
                    setIsGivingCredentials(null);
                    setLabelInputContent("C:\\WINDOWS>");
                }
                break;
            }
            default:{
                break;
            }
        }

        setConsoleContent(prevContent => {
            let usedCommand = labelInputRef.current.textContent + ' ' + command;

            if(isGivingCredentials.step === 1 || isGivingCredentials.step === 3){
                usedCommand = labelInputRef.current.textContent + ' ' + '*'.repeat(command.length);
            }

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

    const handleKeyDown = (e) => {
        switch(e.key){
            case 'Enter':
                if(isGivingCredentials){
                    handleCredentials(isGivingCredentials.step);
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