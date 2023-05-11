







import                      '../../pages/Contact.css'
import { useNavigate } from 'react-router-dom';




// displays choices when contact component first renders.
function ContactOptions({setContactDisplay}) {


  // most navigation from here is handled by the contactDisplay state of the Contact component.
  // useNavigate() is only used for options update and new.
  const navigate = useNavigate();


  // returns a button that sets the contactDisplay state in the Contact component.
  function optionButton (display, msg) {

    // clickHandler() is called when the button is clicked.
    function clickHandler () {

           if (display === 'update'    ) { navigate('/updatePerformer');                     }
      else if (display === 'new'       ) { navigate('/info?faq=advice')                      }
      else if (display === 'performer' ) { setContactDisplay('performer');                   }
      else                               { setContactDisplay(display);                       }
    }


    return <li>
              <button className='formButton optionButton'
                            id={display+'ContactButton'}
                          style={{margin: '1.5em 0'}}
                        onClick={ clickHandler }
              >{msg}</button>
           </li>
  }



  return (

    <div id='contactSorter' className='contactForm'>
      <h2 >You are...</h2>
      <ul>
          { optionButton('producer',  'a producer reaching out about a project')                        }
          { optionButton('update',    'returning to update your profile information')                   }
          { optionButton('performer', 'an experienced stunt performer trying to get in touch')          }
          { optionButton('new',       'an aspiring stunt performer looking to get into the business')   }
          { optionButton('email',     'somebody else who just needs an email form')                     }
      </ul>
    </div>
  );
}

export default ContactOptions;
