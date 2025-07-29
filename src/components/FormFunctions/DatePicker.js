





import './Form.css';
import IndicatorLED from './IndicatorLED.js';
import HelpLink            from '../HelpLink.js';


// flexible date-picking component.
// the noIndicator and noHelp prop can be used to remove the indicatorLED and help icon.
export default function DatePicker ({name, state, setter, error, instructions, noIndicator, id, rule, toolTip, setContactDisplay, setThisRule, noHelp}) {

    return (
        <label>
            <div className='fieldTitle'>
         
                { !noHelp && <HelpLink               rule={rule}
                                                  toolTip={toolTip}
                                        setContactDisplay={setContactDisplay}
                                              setThisRule={setThisRule}
                             />
                }

                <h3 className='fieldTitleH3'>{name}</h3>

            </div>
            
            <div className='field' id={id}>

                <div>

                    {  !noIndicator ? <IndicatorLED value={state} errorCase={error} /> : null}

                    <input  type={'date'}
                            name={name}
                           value={state}
                        onChange={ ( e ) => { setter( e.target.value ) } }
                        required 
                    />

                </div>

                {error && <p className='instructions textFieldInstructions'>{instructions}</p>}

            </div>
        </label>
    )
}

