import { useEffect, useRef, useState } from "react";
import "./MSDOSConsole.css";

export function MSDOSConsole(){

    const inputRef = useRef(null);
    const inputSpanRef = useRef(null);
    const textRenderRef = useRef(null);
    const caret = useRef(null);
    const labelInputRef = useRef(null);

    const [consoleContent, setConsoleContent] = useState([]);

    useEffect(() => {
        const inputElement = inputRef.current;

        const executeCommand = () => {
            console.log('executed');
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

        const handleKeyDown = (e) => {
            switch(e.key){
                case 'Enter':
                    executeCommand();
                    break;
                default: 
                    break;
            }
        }

        inputElement.addEventListener('input', handleCaretPosition);
        inputElement.addEventListener('click', handleCaretPosition);
        inputElement.addEventListener('keyup', handleCaretPosition);
        inputElement.addEventListener('keydown', handleKeyDown);

        handleCaretPosition();

        // Adjust margins
        const labelInput = labelInputRef.current;
        inputElement.style.marginLeft = `${labelInput.offsetWidth + 5}px`;
        caret.current.style.marginLeft = `${labelInput.offsetWidth + 5}px`;

        return () => {
            inputElement.removeEventListener('input', handleCaretPosition);
            inputElement.removeEventListener('click', handleCaretPosition);
            inputElement.removeEventListener('keyup', handleCaretPosition);
            inputElement.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

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

    return (
        <>
            <div className="console-text" >
                {consoleContent.map((content, index) => (
                    <p key={index}>{content}</p>
                ))}
            </div>
            <span id="console-input-span" ref={inputSpanRef}>
                <label htmlFor="console-input" className="console-label" ref={labelInputRef}>{"C:\\WINDOWS>"}</label>
                <span className="text-render" id="text-render" ref={textRenderRef}></span>
                <input type="text" className="console-input" id="console-input" autoComplete="off" ref={inputRef}/>
                <span className="blink-caret" id="blink-caret" ref={caret}>_</span>
            </span>
        </>
    );
}