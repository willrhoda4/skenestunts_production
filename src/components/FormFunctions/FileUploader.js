





import './Form.css';
import IndicatorLED from './IndicatorLED.js';
import HelpLink            from '../HelpLink.js';


// flexible file-uploading component.
// the noIndicator and noHelp prop can be used to remove the indicatorLED and help icon.
export default function FileUploader ({ name, 
                                        rule, 
                                        state, 
                                        error, 
                                        noHelp, 
                                        setter,
                                        onClick,
                                        toolTip, 
                                        setThisRule, 
                                        noIndicator, 
                                        instructions, 
                                        setContactDisplay }) {

    return (<>
                <div className='fieldTitle' >

                    { !noHelp && <HelpLink        rule={rule}
                                               toolTip={toolTip}
                                     setContactDisplay={setContactDisplay}
                                           setThisRule={setThisRule}
                                 />
                    }

                    <h3 className='fieldTitleH3'>{name}:</h3>

                </div>

                <label>

                    <div className='field'>

                        <div className='fileUploader' onClick={onClick} >

                            { !noIndicator ? <IndicatorLED value={state} errorCase={error} /> : null}

                            <h3 className='fileUploaderH3'>Select File</h3>

                            <p className='uploaderCaption'>{state ? state.name : null}</p>

                            <input       type="file"
                                         name={name}
                                           id={name}
                                    className='uploader'
                                     onChange={(e) => { setter(e.target.files[0]) }}
                                     required 
                            />

                        </div>

                        { error && <p className='instructions uploadInstructions' >{instructions}</p>}

                    </div>
                    
                </label>
            </>
    )
}