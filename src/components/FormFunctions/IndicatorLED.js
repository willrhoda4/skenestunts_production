







import './IndicatorLED.css';

import red      from '../../images/LEDRed.png';
import yellow   from '../../images/LEDYellow.png';
import green    from '../../images/LEDGreen.png';

let ledGreen  =    <img className='indicatorLED' alt="an LED that isn't shining" src={green}    />
let ledRed    =    <img className='indicatorLED' alt="an LED shining red"        src={red}    />
let ledYellow =    <img className='indicatorLED' alt="an LED shining yellow"     src={yellow} />



// indicatorLED component for form fields. nice and simple.
// if the state passed in as value is falsy, the LED will be red (initial load).
// once state is truthy (the user has interacted with the field), the LED will be yellow.
// when the user has entered valid input, the LED will be green.
export default function IndicatorLED({value, errorCase}) {

           if (!value)    { return ledRed;       }
      else if (errorCase) { return ledYellow;    } 
      else                { return ledGreen;     } 
    
    
}  
