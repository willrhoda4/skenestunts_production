







import                          './Form.css';
import IndicatorLED        from './IndicatorLED.js';
import HelpLink            from '../HelpLink.js';


// string dropdown component for forms.
// optional help link
// accepts an array of options as a prop, 
// which it iterates through and pushes to an array as option elements.
export default function StringDropdown ({name, state, setter, error, options, rule, toolTip, setContactDisplay, setThisRule, noHelp, noTitle}) {

    return (
        
        <label>

            { !noTitle && 

                <div className='fieldTitle'>

                    { !noHelp &&    <HelpLink        rule={rule}
                                                  toolTip={toolTip}
                                        setContactDisplay={setContactDisplay}
                                              setThisRule={setThisRule}
                                    />
                    }

                    <h3 className='fieldTitleH3'>{name}</h3>

                </div>
            }

            <div className='dropdown'>

                <IndicatorLED value={state} errorCase={error} />

                <select      name={name}
                            value={state}
                        onChange={(e) => setter(e.target.value)}
                >

                    <option key={0} value='null' defaultValue hidden>--select an option--</option>

                    { options.map( (choice, index) => <option key={index+1} value={choice} >{choice}</option> ) }
                    
                </select>
            </div>
        </label>
    )

}
