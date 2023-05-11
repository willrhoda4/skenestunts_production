







import                            './Form.css';
import  IndicatorLED         from './IndicatorLED.js';
import  HelpLink             from '../HelpLink.js';


// numerical-dropdown component for whole integers.
// accepts a min and max prop to determine its range.
// the noIndicator and noHelp prop can be used to remove the indicatorLED and help icon.
export default function numericalDropdown ({name, state, setter, error, min, max, rule, toolTip,setContactDisplay, setThisRule, noHelp})  {
        

    // start by iterating through the range of numbers and pushing them to an array as option elements.
    let dropdown = [];

    for (let i = min; i < max; i++) {

        dropdown.push(<option key={i} value={i}>{i}</option>)
    }


    return (    
            
        <label>

            <div className='fieldTitle'>

                { !noHelp &&    <HelpLink        rule={rule}
                                              toolTip={toolTip}
                                    setContactDisplay={setContactDisplay}
                                          setThisRule={setThisRule}
                                />
                }

                <h3 className='fieldTitleH3'>{name}</h3>

            </div>


            <div className='dropdown'>

                <IndicatorLED value={state} errorCase={error} />

                <select      name={name}
                            value={state}
                         onChange={(e) => setter(parseInt(e.target.value))}   
                >

                    <option value='null' defaultValue hidden>--select an option--</option>

                    {dropdown}

                </select>

            </div>

        </label>
    )
}
