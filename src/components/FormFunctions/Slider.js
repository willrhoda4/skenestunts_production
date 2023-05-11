







import './Form.css';



// simple slider component for forms.
export default function Slider ({ name, state, setter, min, max, id }) {

    return (

        <div className='flexColumn' style={{width: '100%', margin: '2.5vmin 0', }}>
        
            <h3 className='fieldTitleH3' id='abc'>{name}: {state}</h3>

            <input 
                id={id} 
                min={min} 
                max={max} 
                name={name}
                type='range' 
                value={state} 
                className='formSlider'
                onChange={ e => setter(e.target.value)}
            />
                
        </div>
    )
}



                