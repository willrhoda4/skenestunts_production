







import                      '../components/AdminTools/AdminTools.css';
import                      '../components/PasswordForm.css';
import { useState, 
         useEffect   } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet      } from 'react-helmet';
import   Axios         from 'axios';


import TextField       from '../components/FormFunctions/TextField.js';
import Notification    from '../components/Notification.js';



// this component is the password form for resetting a forgotten password.
// it can only be accessed via a link sent to the user's email address.
// don't confuse it with PasswordChecker, which is the form for performer updates and Director's Chair.
export default function PasswordReset ({getData}) {



    const     navigate    = useNavigate();


    

    // extract parameters from url
    const   id                                  = new URLSearchParams(window.location.search).get('id'); 
    const   token                               = new URLSearchParams(window.location.search).get('token');
    const   origin                              = new URLSearchParams(window.location.search).get('origin');
    const   invite                              = new URLSearchParams(window.location.search).get('invite') === 'true' ? true : false;  
    
    
    
    const [ status,         setStatus         ] = useState('');
    const [ formStatus,     setFormStatus     ] = useState('');
    
    const [ password1,      setPassword1      ] = useState('');
    const [ password2,      setPassword2      ] = useState('');
    
    const [ password1Error, setPassword1Error ] = useState(false); 
    const [ password2Error, setPassword2Error ] = useState(false); 
    
    // set table and fk for http request based on origin
    const [ table,          setTable          ] = useState(false);
    const [ fk,             setFk             ] = useState(false);



    
    // identify dom elements for following effect hook.
    let pwField                                 = document.getElementById('pwField');
    let submitBtn                               = document.getElementById('formSubmitButton');


    // adds event listener to password field to submit form when you smash the enter key
    useEffect(() => {

        if (pwField) {    
            
            pwField.addEventListener('keypress', function(e) {
            
                if (e.key === 'Enter') {
                
                    e.preventDefault();
                    submitBtn.click();
                }
            })
        };

    }, [pwField, submitBtn])


    // check password length
    useEffect(() => {

        password1.length  <  8  ?   setPassword1Error(true)
                                :   setPassword1Error(false);                     
    }, [password1]);



    // check password length
    useEffect(() => {

        password2.length  <  8  ?   setPassword2Error(true)
                                :   setPassword2Error(false);                     
    }, [password2]);


    // checks if a password reset request exists in the database,
    // and if it does, checks if it has expired.
    // sets state to authenticated and displays form if it exists and has not expired
    useEffect(() => {


        let usersTable = origin === '/director' ? 'board_passwords' : 'performer_passwords';
        let usersFk    = origin === '/director' ? 'team_id'         : 'performer_id';

        setTable(usersTable);
        setFk(usersFk);


        
        function verifyReset () {

        
            getData( [ usersTable, [[ usersFk, parseInt(id) ]]] )
                 .then( res => {    console.log(res.data);
                                            
                             // if user has no password reset requests, they are not authenticated
                             if (res.data.length === 0)    {    // for Director's Chair resets, check the team table if it isn't on the board table.
                                                                if (usersTable === 'board_passwords')   {   
                                                                                                                     usersTable = 'team_passwords';
                                                                                                            setTable(usersTable);

                                                                                                            return verifyReset();
                                                                                                        }
                                                                // if it's not on the team table either, they aren't scheduled for a password reset.
                                                                return setStatus('unscheduled'); 
                                                           }
                        else if (res.data.length === 1)    {
                                                                // if user is invited, they are authenticated, regardless of when they were invited
                                                                     if ( invite                                     ) { return setStatus('authenticated'); }

                                                                // if user is not invited, check if they have a password reset request in the database
                                                                else if (!res.data[0].reset_at                       ) { return setStatus('unscheduled')    }

                                                                // if user has a password reset request, check if it has expired
                                                                else if ( Date.now() - res.data[0].reset_at > 900000 ) { return setStatus('expired');       }

                                                                // then check if their token is valid
                                                                else if (res.data[0].token !== token                 ) { return setStatus('tokenProblem')   }

                                                                // if user has a password reset request and it has not expired, they are authenticated
                                                                else                                                   { return setStatus('authenticated'); }
                                                           }
                                                                // if user has more than one password reset request, there's a problem with the database
                        else                               {                                                             return setStatus('databaseError'); }
                    })
                .catch( err => console.log(err) )

        }

        // if any of the parameters are missing, there's a problem with the url
        if (!( id && token && origin )) { return setStatus('urlProblem'); }
        
        // if all parameters are present, check if the password reset request exists in the database
        else                            {        verifyReset();           }
 
     

        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])





    // sends password reset request to database if password fields are filled out and match.
    function resetPassword (e) {

        e.preventDefault();

            //checks if password fields are filled out
             if (     password1Error ||
                      password2Error          ) { return setFormStatus('inputError'); }
    
            //checks if passwords match
        else if (     password1 !== password2 ) { return setFormStatus('matchError'); }

        else  {                                          // clears any previous error messages
                                                         setFormStatus('');
            // sends password reset request to database
            Axios.post(`${process.env.REACT_APP_API_URL}resetPassword`, [ id, password1, table, fk, token ] )
                 .then( res => { setFormStatus('reset');                                                  } )
                .catch( err => { setFormStatus('resetError');                                             } )
        }
    }



    // if password reset succeeds, redirects to origin page to continue visit on site.
    // keeps invite and token in url so user can be authenticated on the next page.
    useEffect(() => {

        if (formStatus === 'reset') { navigate(`../${origin}?successfulReset=true`, { replace: true } ); }

    }, [ formStatus, invite, navigate, origin, token ] )
    





    return ( 
    
        <>

            <Helmet>
                <meta name="robots" content="noindex" />
            </Helmet>
    
            <div style={{marginTop: '10vh'}}>

                {/* don't even show the form if any of these errors apply. */}
                {
                  status === 'urlProblem'        ?  <Notification type={'bad'} msg={'There\'s a problem with your reset url. Try resetting again to get a fresh link.' }                /> 
                : status === 'unscheduled'       ?  <Notification type={'bad'} msg={'We have no record of you requesting this reset. Try resetting again,.' }                           />   
                : status === 'expired'           ?  <Notification type={'bad'} msg={'Your token has expired. Reset again and make it back in less than 15 minutes.' }                   />   
                : status === 'tokenProblem'      ?  <Notification type={'bad'} msg={'Your token is invalid. Try resetting your password again to refresh it.' }                         />   
                : status === 'databaseError'     ?  <Notification type={'bad'} msg={'There\'s been a data error. Please let us know via email form so we can get it fixed for you.'}    />  
                : status === 'authenticated'     ?  <div className='passwordForm adminForm'>

                                                    <h2 className='passwordFormH2'>{ invite ? 'Welcome to Skene Stunts' : 'Reset your password'}</h2>
                                                    
                                                    < TextField
                                                            name='new password'
                                                            state={password1}
                                                            setter={setPassword1}
                                                            error={password1Error}
                                                        instructions='Minimum of eight characters'
                                                                type='password'
                                                    />
                                            
                                                    < TextField
                                                                id='pwField'
                                                                name='confirm password'
                                                            state={password2}
                                                            setter={setPassword2}
                                                            error={password2Error}
                                                        instructions='Exactly as you just entered it'
                                                                type='password' 
                                                    />
                                            
                                                    <button id='formSubmitButton' className='formButton' type='button' onClick={(e) => resetPassword(e)}>Reset Password</button>
                                            
                                                            {  
                                                              formStatus === 'reset'       ? <Notification type={'wait'} msg={`Password successfully reset, you should be redirected shortly...`} />
                                                            : formStatus === 'inputError'  ? <Notification type={'bad' } msg={`Both password fields need to be filled out.`}                      />
                                                            : formStatus === 'matchError'  ? <Notification type={'bad' } msg={`Passwords must be an exact match.`}                                />
                                                            : formStatus === 'resetError'  ? <Notification type={'bad' } msg={`There's been a problem with your reset. \n
                                                                                                                                Please try again, and notify us via email form if it persists.`}   />
                                                            :                                 null
                                                            }
                                                </div>     

                :                              null                                                               
                }

            </div>
        </>
    )




}