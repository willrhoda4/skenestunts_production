







import                           './Form.css';
import  IndicatorLED        from './IndicatorLED.js';
import  HelpLink            from '../HelpLink.js';


// flexible text-area component for forms.
// the noIndicator and noHelp prop can be used to remove the indicatorLED and help icon.
// provides option to include a default value prop.
export default function TextArea ({ name, 
                                    rule, 
                                    state, 
                                    style,
                                    error, 
                                    setter, 
                                    noHelp,               
                                    toolTip, 
                                    inputId,
                                    noIndicator, 
                                    setThisRule,
                                    instructions, 
                                    defaultValue,
                                    setContactDisplay, 
                                 }) {

    return (

        <label>

            <div className='fieldTitle'>

                { !noHelp && <HelpLink       rule={rule}
                                          toolTip={toolTip}
                                setContactDisplay={setContactDisplay}
                                      setThisRule={setThisRule}
                             />
                }

                <h3 className='fieldTitleH3'>{name}</h3>

            </div>

            <div className='field'>

                <div>

                    { !noIndicator ? <IndicatorLED value={state} errorCase={error} /> : null}

                    <textarea   type="textarea"
                                name={name}
                                  id={inputId}
                               style={style}
                               value={state}
                        defaultValue={defaultValue}
                            onChange={(e) => setter(e.target.value)}
                            required 
                    />

                </div>

            {error && <p className='instructions textareaInstructions'>{instructions}</p>}

            </div>

        </label>
    )
}