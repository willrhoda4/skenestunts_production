





import                          './UpdatePerformer.css';
import { useState,
         useEffect }       from 'react';
import { useAuth   }       from '../hooks/useAuth.js';

import { Helmet    }       from 'react-helmet';

import   Axios             from 'axios';

import   PasswordChecker   from '../components/PasswordChecker.js';
import   ContactPerformer  from '../components/ContactComponents/ContactPerformer.js';
import   Notification      from '../components/Notification.js';



export default function UpdatePerformer( { performerOptions, performerClass, setPerformerClass, getData } ) {


    // url param flag to indicate that the user has been sent back with a valid jwt after a password reset
    const     successfulReset                    = !!(new URLSearchParams(window.location.search).get('successfulReset') === 'true');

    // state to store the performer's information   
    const [   performerData,  setPerformerData ] = useState(null);

    // useAuth hook to track the user's role for the client
    const [   authRole,       setAuthRole      ] = useAuth();

    const     notPerformer                       =  authRole !== 'performer'
 
   

    // if the user has been sent back with a valid jwt after a password reset,
    // then go ahead and put their data in state without asking for credentials.
    useEffect(() => {


        // if the user is authenticated as a performer, we'll try to get their data from the database without asking for credentials
        if ( successfulReset ) {



            Axios.get('/loginPerformer') 
                .then(  res => {            
                                    const user = res.data[0];                         
                                    if ( !user )      {     return setPerformerData('dataError');   } 
                                                                
                                    else              {    
                                                                   setPerformerClass( user.performer_class  );     
                                                            return setPerformerData(  user                  );
                                                      }
                                                      // performerClass is tracked to make sure that it isn't overwritten if
                                                      // the user's already been marked by the team as goodbooks/badbooks etc.
                            }                                                                      
                    )
              .catch( err =>  { console.log(err); return setPerformerData('dataError'); } )
        }


    }, [ setPerformerClass, successfulReset ] )







    return (

        <>

            <Helmet>
              <title>Skene Stunts - Update Performer</title>
              <meta name="description" content="If you're looking to update your profile in our talent database, you came to the right place." />
              <link rel="canonical"    href="https://www.skenestunts.com/" />
            </Helmet>


            <div id='updatePerformerWrapper'>
                {       notPerformer   &&  successfulReset  ?   <Notification type='wait' msg='Hang tight while we get you logged in...'                               />
                    :   performerData === 'expired'         ?   <Notification type='bad'  msg='Your token has expired. Try resetting your password again.'             /> 
                    :   performerData === 'dataError'       ?   <Notification type='bad'  msg='A databse error has occured. Please try resetting your password again.' /> 
                    :   notPerformer                        ?   <PasswordChecker              
                                                                                   fk={  'performer_id'                    }
                                                                                table={  'performers'                      }
                                                                              pwTable={  'performer_passwords'             }
                                                                           dataSetter={   setPerformerData                 }
                                                                          setAuthRole={   setAuthRole                      }  
                                                                    setPerformerClass={   setPerformerClass                }  
                                                                />

                        :                                       <ContactPerformer   performerOptions={  performerOptions   } 
                                                                                       performerData={  performerData      } 
                                                                                      performerClass={  performerClass     }
                                                                                   setPerformerClass={  setPerformerClass  }
                                                                                             getData={  getData            }
                                                                />
                    }
            </div>
        </>
    )
}