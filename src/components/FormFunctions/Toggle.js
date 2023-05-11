







import './Form.css';


// a simple toggle component for forms.
// optional disengaged and engaged props display string on either side of the toggle.
export default function Toggle ({name, state, setter, disengaged, engaged}) {

    return (

        <div style={{alignItems: 'center', margin: '1vmin 0 2.5vmin'}}>

            <label style={{display: 'flex'}} >

                { disengaged && <p style={{fontSize: '1.25em'}}>{disengaged}</p> } 

                <div className='toggle'>
                    <div className={ state ? 'toggleSlider selected' : 'toggleSlider'} />
                </div>    

                { engaged && <p style={{fontSize: '1.25em'}}>{engaged}</p> }

                <input      type='checkbox' 
                       className='dummybox' 
                            name={name}
                           value={state}
                        onChange={ e => setter(e => !e)}
                />

            </label>
        </div>
    )
}



                