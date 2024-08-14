import './ToolMenu.css';

export default function ToolMenu({
    options,
    visible
}){
    if(!visible) return null;

    return (
        <div className={`tool-menu ${visible ? 'visible' : ''}`}>
            {options.map((option, index) => {
                if(option === 'line'){
                    return <div key={index} className='tool-menu-line'></div>
                } else if(typeof option === 'object'){
                    return (
                        <div key={index} className="tool-menu-option">
                            <p className={`tool-menu-option-text  ${option.enabled ? '' : 'disabled'}`}>
                            {option.text}
                            </p>
                      </div>
                    )
                } else {
                    <div key={index} className="tool-menu-option">
                    <p className='tool-menu-option-text'>
                      {option}
                    </p>
                  </div>
                }
            })}
        </div>
    );
}