







import                           './Form.css';
import  IndicatorLED        from './IndicatorLED.js';
import  HelpLink            from '../HelpLink.js';


// good ol' text-field component for forms.
// the noIndicator and noHelp prop can be used to remove the indicatorLED and help icon.
export default function TextField ({    id,
                                        name, 
                                        type,
                                        rule, 
                                        state, 
                                        error, 
                                        setter, 
                                        noHelp,
                                        inputId,
                                        toolTip, 
                                        noIndicator, 
                                        setThisRule,
                                        instructions, 
                                        setContactDisplay }) { 
                                            

    return (<>

                <label className='formField' style={id === 'otherField' ? {display: 'flex',} : null}>

                    <div className='fieldTitle'>

                        { !noHelp && <HelpLink       rule={rule}
                                                  toolTip={toolTip}
                                        setContactDisplay={setContactDisplay}
                                              setThisRule={setThisRule}
                                     />
                        }

                        <h3 className={id !== 'otherField' ? 'fieldTitleH3' : 'otherTitleH3'} >{name}</h3>

                    </div>

                    <div className='fieldRow' id={id}>

                        {  !noIndicator ? <IndicatorLED className='indicatorLED' value={state} errorCase={error} /> : null}

                        <div className='field'>

                            <input  type={type ? type : name}
                                    name={name}
                                    id={inputId}
                                    className='fieldInput'
                                    value={state && state}
                                    onChange={(e) => setter(e.target.value)}
                                    required 
                            />

                            {error && <p className='instructions textFieldInstructions'>{instructions}</p>}

                        </div>
                    </div>
                </label>
             </>
    )
}
