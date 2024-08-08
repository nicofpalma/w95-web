import './Notepad.css';

export default function Notepad(){

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
            <div className="notepad">
            <div className='notepad-tools'>
                <div className='tool-container'>
                    <p>File</p>
                </div>

                <div className='tool-container'>
                    <p>Edit</p>
                </div>

                <div className='tool-container'>
                    <p>Search</p>
                </div>

                <div className='tool-container'>
                    <p>Help</p>
                </div>

            </div>
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