






import { useState }    from 'react';

import { Helmet   }    from 'react-helmet';


import './Contact.css';

import Email      from '../components/ContactComponents/ContactEmail';
import Options    from '../components/ContactComponents/ContactOptions';
import Performer  from '../components/ContactComponents/ContactPerformer';
import Producer   from '../components/ContactComponents/ContactProducer';






export default function Contact({performerOptions, performerClass, setPerformerClass, getData}) {

    
    // tracks currently displayed contact component.
    const [  contactDisplay,   setContactDisplay   ] = useState('options');



    // returns backToButton if contactDisplay is 'producer' or 'email'.
    function backToButton () {

        if (contactDisplay === 'producer' ||
            contactDisplay === 'email'    ){ return (
                                                        <button className='formButton backToButton' 
                                                                  onClick={ ()=> setContactDisplay('options')}>back to options</button>
                                                    )
                                           }
    }


    return (

        <>
        
            <Helmet>
              <title>Skene Stunts - Contact</title>
              <meta name="description" content="Get in touch with our team via email, or fill out a form to get yourself added to our talent database." />
              <link rel="canonical"    href="https://www.skenestunts.com/contact" />
            </Helmet>


            <div id='contactPage'>
                {backToButton()}
                <div id='contact' className='page'>
                    {    
                         contactDisplay === 'producer'     ? <Producer  setContactDisplay={setContactDisplay}  />

                        : contactDisplay === 'performer'
                       || contactDisplay === 'new'          ? <Performer setPerformerClass={setPerformerClass} 
                                                                          performerOptions={performerOptions}
                                                                            performerClass={performerClass}
                                                                             isExperienced={contactDisplay === 'performer'}   
                                                                                   getData={getData}            />     
                        : contactDisplay === 'email'        ? <Email     setContactDisplay={setContactDisplay}  /> 

                        :                                     <Options   setContactDisplay={setContactDisplay}  />
                    }
                    

                </div>
            </div>

        </>
    );
}

