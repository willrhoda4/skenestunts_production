






import './HelpLink.css';


// this component is used to display a help icon next to a form field.
// it got axed from the project at the last minute, but I'm keeping it here for posterity.
//    (read: in case the client changes their mind and wants it back)
export default function HelpLink({rule, toolTip, setContactDisplay, setThisRule}) {
        

      const clickHandler = () => {


            setContactDisplay('new');
            setThisRule(rule);
      }

          return (

                <div className='helpLinkIcon' onClick={clickHandler}>?</div>

          )
    
    
}  
