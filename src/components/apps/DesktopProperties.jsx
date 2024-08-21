import { useState } from 'react';
import './DesktopProperties.css';

export default function DesktopProperties(

){
    const [toolSelected, setToolSelected] = useState([true, false, false, false]);

    const handleToolSelected = (index) => {
        setToolSelected(prev => 
            prev.map((selected, i) => 
                i === index ? true : false
            ) 
        );
    }

    return (
        <div className="desktop-properties">
            <div className='desktop-properties-tools-container'>
                <div 
                    className={`desktop-properties-tools ${toolSelected[0] ? 'tool-selected' : ''}`}
                    onClick={() => handleToolSelected(0)}
                >
                    <p>Background</p>
                </div>
                <div 
                    className={`desktop-properties-tools ${toolSelected[1] ? 'tool-selected' : ''}`}
                    onClick={() => handleToolSelected(1)}
                >
                    <p>Screen Saver</p>
                </div>
                <div 
                    className={`desktop-properties-tools ${toolSelected[2] ? 'tool-selected' : ''}`}
                    onClick={() => handleToolSelected(2)}
                >
                    <p>Appearance</p>
                </div>
                <div 
                    className={`desktop-properties-tools ${toolSelected[3] ? 'tool-selected' : ''}`}
                    onClick={() => handleToolSelected(3)}
                >
                    <p>Settings</p>
                </div>
            </div>

            <div className="desktop-properties-main">
                {toolSelected[0] && (
                    <div className='background-section'>
                        <div className='pc-img-container'>
                            <div className='background-selection'></div>
                            <img className='pc-img' src="assets/pctransparent.png" alt="" />
                        </div>

                        <div className='selector-container'>
                            <div className='pattern-selector'>
                                <p>Pattern</p>
                                <select multiple>
                                    <option value="none">(None)</option>
                                    <option value="bricks">Bricks</option>
                                    <option value="buttons">Buttons</option>
                                    <option value="cargoNet">Cargo Net</option>
                                    <option value="circuits">Circuits</option>
                                    <option value="cobblestones">Cobblestones</option>
                                    <option value="daisies">Daisies</option>
                                    <option value="dizzy">Dizzy</option>
                                    <option value="key">Key</option>
                                    <option value="liveWire">Live Wire</option>
                                    <option value="Plaid">Plaid</option>
                                    <option value="rounder">Rounder</option>
                                    <option value="scales">Scales</option>
                                    <option value="stone">Stone</option>
                                    <option value="tile">Tile</option>
                                    <option value="triangles">Triangles</option>
                                    <option value="waffleRevenge">{"Waffle's Revenge"}</option>
                                </select>
                            </div>

                            <div className='wallpaper-selector'>
                                <p>Wallpaper</p>
                                <select multiple>
                                    <option value="none">(None)</option>
                                    <option value="blackThatch">Black Thatch</option>
                                    <option value="blueRivets">Blue Rivets</option>
                                    <option value="bubbles">Bubbles</option>
                                    <option value="circles">Circles</option>
                                    <option value="clouds">Clouds</option>
                                    <option value="forest">Forest</option>
                                    <option value="goldWeave">Gold Weave</option>
                                    <option value="houndstooth">Houndstooth</option>
                                    <option value="pinstripe">Pinstripe</option>
                                    <option value="redBlocks">Red Blocks</option>
                                    <option value="sandstone">Sandstone</option>
                                    <option value="setup">Setup</option>
                                    <option value="stitches">Stitches</option>
                                    <option value="strawMat">Straw Mat</option>
                                    <option value="tiles">Tiles</option>
                                    <option value="triangles">Triangles</option>
                                    <option value="waves">Waves</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

                <div className='properties-action-btns'>
                    <button>OK</button>
                    <button>Cancel</button>
                    <button>Apply</button>
                </div>

        </div>
    )
}