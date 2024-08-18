





import                          './UpdatePerformer.css';
import { useState,
         useEffect }       from 'react';
import { useAuth   }       from '../hooks/useAuth.js';

import { Helmet    }       from 'react-helmet';


         
import   PasswordChecker   from '../components/PasswordChecker.js';
import   ContactPerformer  from '../components/ContactComponents/ContactPerformer.js';
import   Notification      from '../components/Notification.js';

b

export default function UpdatePerformer( { performerOptions, performerClass, setPerformerClass, getData } ) {


    // token is the query parameter that the user is sent back with after resetting their password
    // *** don't confuse this with the jwt token that is used to authenticate the user ***
    const   token = new URLSearchParams(window.location.search).get('token'); 
    
    // state to store the performer's information   
    const [   performerData,  setPerformerData ] = useState(null);

    // jwtStatus tells us if the token is valid, invalid, or expired
    // updateJwt is a passed to PasswordChecker as a handler to force re-renders
    const [ , jwtStatus,      updateJwt        ] = useAuth();

    // condition to toggle between PasswordChecker and ContactPerformer
    // invalidJwt is true if the token is invalid or expired
    // we specifcy explicit status' with strings in lieu of a boolean
    // because we want PasswordChecker to render if the token is invalid,
    // but display a message if the token is expired.
    const   invalidJwt =  jwtStatus() === 'invalid'
                       || jwtStatus() === 'expired';


    // if the user has been sent back with a valid jwt after a password reset,
    // then go ahead and put their data in state without asking for credentials.
    useEffect(() => {

        const reqBody = ['performer_passwords', [ ['token', token] ], { columns: 'performer_id, reset_at' } ];

        if ( jwtStatus() === 'valid' ) {
           
            getData( [ 'performers', [ [ 'performer_id', performer_id ] ] ] )
              .then(  res => {                                     
                                      if (res.data.length !== 1) {    return setPerformerData('dataError');   } 
                                                                  
                                      else                       {    setPerformerClass(res.data[0].performer_class);     
                                                                      setPerformerData(res.data[0]);
                                                                      return; 
                                                                 }
                                                                      // performerClass is tracked to make sure that it isn't overwritten if
                                                                      // the user's already been marked by the team as goodbooks/badbooks etc.
                              }                                                                      
                    )
              .catch( err =>  { console.log(err); return setPerformerData('dataError'); } )
        }


    }, [ getData, setPerformerClass, token ] )





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
                    :   invalidJwt                      ?   <PasswordChecker              table={  'performers'                     }
                                                                                        pwTable={  'performer_passwords'            }
                                                                                             fk={  'performer_id'                   }
                                                                                     dataSetter={   setPerformerData                }
                                                                              setPerformerClass={   setPerformerClass               }
                                                                                        getData={   getData                         }
                                                                                     expiredJwt={   jwtStatus === 'expired' && true }
                                                                                      updateJwt={   updateJwt                       }
                                                            />
                                                            
                        :                                   <ContactPerformer   performerOptions={  performerOptions                } 
                                                                                   performerData={  performerData                   } 
                                                                                  performerClass={  performerClass                  }
                                                                               setPerformerClass={  setPerformerClass               }
                                                                                         getData={  getData                         }
                                                            />
                    }
            </div>
        </>
    )
}