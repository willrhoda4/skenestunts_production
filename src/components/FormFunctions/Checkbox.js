





import './Form.css';


// an unopinionated checkbox component. pretty self-explanatory.
// the sort prop can be used to add a class to the checkboxWrapper div.
export default function Checkbox ({name, state, setter, sort, style, onClick}) {

    return (

           <div className={'checkboxWrapper '+ sort} 
                    style={style} 
                  onClick={onClick} 
            >
                <label className='checkboxLabel'>

                    <span className={state ? 'checkmark checked' : 'checkmark'}></span>

                    <p className='checkboxCaption'>{name}</p>

                    <input type="checkbox"
                           name={name}
                          value={state}
                       onChange={(e) => setter(e => !e)} 
                    />

                </label>
            </div>
    )
}