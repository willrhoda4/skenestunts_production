





import                       './UpdatePerformer.css';
import { useState,
         useEffect }     from 'react';

import { Helmet    }     from 'react-helmet';


         
import PasswordChecker   from '../components/PasswordChecker.js';
import ContactPerformer  from '../components/ContactComponents/ContactPerformer.js';
import Notification      from '../components/Notification.js';



export default function UpdatePerformer({performerOptions, performerClass, setPerformerClass, getData, url}) {



    const token = new URLSearchParams(window.location.search).get('token'); 
    
    const [ performerData,  setPerformerData ] = useState(null);

    useEffect(() => {

        const reqBody = ['performer_passwords', [['token', token]], { columns: 'performer_id, reset_at' } ];

        if (token) {
           
                 getData(reqBody).then( res => {
                                    if (res.data.length !== 1) { setPerformerData('dataError'); }
                                    
                                    else {

                                       const { performer_id, reset_at } = res.data[0];

                                       if (Date.now() - reset_at < 900000) { setPerformerData('expired'); }

                                       getData(['performers', [['performer_id', performer_id]]])
                                            .then(  res =>  {                                     
                                                                if (res.data.length !== 1) { setPerformerData('dataError'); } console.log(res.data);
                                                                                             setPerformerData(res.data[0]);
                                                            }                                                                       )
                                            .catch( err =>  { console.log(err);              setPerformerData('dataError'); }       )
                                    }
                               }                                                                                                    )
                .catch( err => { console.log(err); setPerformerData('dataError'); }                                                 )
        }
    }, [getData, token])



    return (

        <>

            <Helmet>
              <title>Skene Stunts - Update Performer</title>
              <meta name="description" content="If you're looking to update your profile in our talent database, you came to the right place." />
              <link rel="canonical"    href="https://www.skenestunts.com/" />
            </Helmet>

            <div id='updatePerformerWrapper'>
                {      !performerData &&   token        ?   <Notification type='wait' msg='Hang tight while we get you logged in...'                               />
                    :   performerData === 'expired'     ?   <Notification type='bad'  msg='Your token has expired. Try resetting your password again.'             /> 
                    :   performerData === 'dataError'   ?   <Notification type='bad'  msg='A databse error has occured. Please try resetting your password again.' /> 
                    :  !performerData                   ?   <PasswordChecker              table={  'performers'           }
                                                                                        pwTable={  'performer_passwords'  }
                                                                                             fk={  'performer_id'         }
                                                                                     dataSetter={   setPerformerData      }
                                                                                        getData={   getData               }
                                                                                            url={   url                   }        
                                                            />
                        :                                   < ContactPerformer     performerOptions={ performerOptions  } 
                                                                                    performerData={ performerData     } 
                                                                                    performerClass={ performerClass    }
                                                                                setPerformerClass={ setPerformerClass }
                                                            />
                    }
            </div>
        </>
    )
}