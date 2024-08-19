import { useState } from 'react';
import WindowTools from '../openWindow/WindowTools';
import './Calculator.css';
import ToolMenu from './ToolMenu';

export default function Calculator(){
    const [activeToolMenu, setActiveToolMenu] = useState(null);
    const [actualValue, setActualValue] = useState('0');
    const [operatorInUse, setOperatorInUse] = useState(null);
    const [lastOperatorInUse, setLastOperatorInUse] = useState(null);
    const [lastValue, setLastValue] = useState('0');

    const toggleToolsVisible = (index) => {
        setActiveToolMenu(prev => prev === index ? null : index);
    }

    const hideToolMenu = () => {
        setActiveToolMenu(null);
    }


    // 13 chars max
    const handleConcatValue = (value) => {
        if(operatorInUse === null){
            setActualValue(prev => {
                let actualValue = '';
                actualValue = prev + value;
    
                if(actualValue.charAt(0) === '0'){
                    actualValue = actualValue.slice(1);
                }
    
                return actualValue;
            });
        } else {
            setLastOperatorInUse(operatorInUse);
            setOperatorInUse(null);
            setLastValue(actualValue);
            setActualValue(value);
        }
    }

    const handleOperator = (operator) => {
        if(operator === '='){
            let operationValue;
            switch(lastOperatorInUse){
                case '+':
                    operationValue = parseFloat(lastValue) + parseFloat(actualValue);
                    break;
                case '-':
                    operationValue = parseFloat(lastValue) - parseFloat(actualValue);
                    break;
                case '*':
                    operationValue = parseFloat(lastValue) * parseFloat(actualValue);
                    break;
                case '/':
                    operationValue = parseFloat(lastValue) / parseFloat(actualValue);
                    break;
                default: 
                    break;
            }

            if(operationValue === Infinity){
                operationValue = 'Cannot divide by zero.';
            }
            
            setActualValue(operationValue);
        } else {
            setOperatorInUse(operator);
            setLastValue(actualValue);
        }
    }
    

    const handleOption = (option) => {
        switch(option){
            case 'Back':{
                setActualValue()
                break;
            }
            case 'CE':{
                break;
            }
            case 'C':{
                setLastValue('0');
                setActualValue('0');
                setLastOperatorInUse(null);
                setOperatorInUse(null);
                break;
            }
            default:
                break;
        }
    }

    const menuOptions = [
        {name: 'Edit', options: [
            { text: 'Copy      Ctrl+C', enabled: true },
            { text: 'Paste      Ctrl+V', enabled: true },
        ]},
        {name: 'View', options: [
            {text: 'Scientific', enabled: false },
            {text: 'Standard', enabled: true },
        ]},
        {name: 'Help', options: [
            {text: 'Help Topics', enabled: true},
            'line',
            {text: 'About Calculator', enabled: true}
        ]}
    ];

    return (
        
        <div className="calculator" onClick={hideToolMenu}>
            <WindowTools>
                {menuOptions.map((menu, index) => (
                    <div
                        key={menu.name}
                        className='tool-container'
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleToolsVisible(index);
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
            <div className='tool-menu-line'></div>

            <div className='calc-items-container'>
                <input type="text" readOnly value={actualValue}/>

                <div className='calc-buttons-container action-btns'>
                    <div className='calc-m-info'></div>
                    <button className='calc-back-btn red-btn2' onClick={() => handleOption('Back')}><span>Back</span></button>
                    <button className='calc-ce-btn red-btn2' onClick={() => handleOption('CE')}><span>CE</span></button>
                    <button className='calc-c-btn red-btn2' onClick={() => handleOption('C')}><span>C</span></button>
                </div>

                <div className='calc-buttons-container action-btns'>
                    <button className='calc-mc-btn lateral-btn red-btn' onClick={() => handleOption('MC')}><span>MC</span></button>
                    <button className='calc-7-btn blue-btn' onClick={() => handleConcatValue('7')}><span>7</span></button>
                    <button className='calc-8-btn blue-btn' onClick={() => handleConcatValue('8')}><span>8</span></button>
                    <button className='calc-9-btn blue-btn' onClick={() => handleConcatValue('9')}><span>9</span></button>
                    <button className='calc-div-btn red-btn' onClick={() => handleOperator('/')}><span></span>/</button>
                    <button className='calc-sqrt-btn blue-btn2' onClick={() => handleOperator('sqrt')}><span>sqrt</span></button>
                </div>

                <div className='calc-buttons-container action-btns'>
                    <button className='calc-mr-info lateral-btn red-btn' onClick={() => handleOption('MR')}><span>MR</span></button>
                    <button className='calc-4-btn blue-btn' onClick={() => handleConcatValue('4')}><span>4</span></button>
                    <button className='calc-5-btn blue-btn' onClick={() => handleConcatValue('5')}><span>5</span></button>
                    <button className='calc-6-btn blue-btn' onClick={() => handleConcatValue('6')}><span>6</span></button>
                    <button className='calc-mult-btn red-btn' onClick={() => handleOperator('*')}><span>*</span></button>
                    <button className='calc-perc-btn blue-btn2' onClick={() => handleOperator('%')}><span>%</span></button>
                </div>

                <div className='calc-buttons-container action-btns'>
                    <button className='calc-ms-info lateral-btn red-btn' onClick={() => handleOption('MS')}><span>MS</span></button>
                    <button className='calc-1-btn blue-btn' onClick={() => handleConcatValue('1')}><span>1</span></button>
                    <button className='calc-2-btn blue-btn' onClick={() => handleConcatValue('2')}><span>2</span></button>
                    <button className='calc-3-btn blue-btn' onClick={() => handleConcatValue('3')}><span>3</span></button>
                    <button className='calc-minus-btn red-btn' onClick={() => handleOperator('-')}><span>-</span></button>
                    <button className='calc-onex-btn blue-btn2' onClick={() => handleOperator('1/x')}><span>1/x</span></button>
                </div>

                <div className='calc-buttons-container action-btns'>
                    <button className='calc-mplus-info lateral-btn red-btn'><span>M+</span></button>
                    <button className='calc-0-btn blue-btn' onClick={() => handleConcatValue('0')}><span>0</span></button>
                    <button className='calc-summinus-btn blue-btn' onClick={() => handleOperator('+/-')}><span>+/-</span></button>
                    <button className='calc-dot-btn blue-btn' onClick={() => handleOperator('.')}><span>.</span></button>
                    <button className='calc-sum-btn red-btn' onClick={() => handleOperator('+')}><span>+</span></button>
                    <button className='calc-equal-btn red-btn' onClick={() => handleOperator('=')}><span>=</span></button>
                </div>

            </div>
        </div>
    )
}