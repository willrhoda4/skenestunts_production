







import                      './PasswordForm.css';
import                      './AdminTools/AdminTools.css';
import   TextField     from './FormFunctions/TextField.js';
import   Notification  from './Notification.js';
import { useState,
         useEffect   } from 'react';
import   Axios         from 'axios';
import { useLocation } from 'react-router-dom';
import   iconPlay      from '../images/icon_play.svg'




// this component is the password form for performer updates and Director's Chair.
// don't confuse it with PasswordReset, which is the form for resetting a forgotten password.
export default function PasswordChecker( {
                                            fk, 
                                            table, 
                                            pwTable, 
                                            dataSetter, 
                                            setAuthRole,
                                            setAdminStatus,
                                            setBoardMember,
                                            setPerformerClass,
                                         } ) {

    
    const [ email,            setEmail           ] = useState('');
    const [ password,         setPassword        ] = useState('');
    const [ status,           setStatus          ] = useState('');
    const [ origin,           setOrigin          ] = useState('');
    
    const [ emailError,       setEmailError      ] = useState(false);
    const [ passwordError,    setPasswordError   ] = useState(false);
    
    const   location                               = useLocation();



    //set origin to current path
    useEffect(() => {  setOrigin( location.pathname );  }, [ location ] )




    // adds event listener to password field to submit form when you smash the enter key
    useEffect(() => {

        let pwField   = document.getElementById('pwField');
        let submitBtn = document.getElementById('formSubmitButton');
    
        if (pwField) {    

            const handleKeyPress = e => {
 
                if (e.key === 'Enter') {

                    e.preventDefault();
                    submitBtn.click();
                }
            };
    
            pwField.addEventListener('keypress', handleKeyPress);
    
            return () => pwField.removeEventListener('keypress', handleKeyPress);
            
        }

    }, []);


    //check email for @ and . symbols
    useEffect(() => { setEmailError(    email.indexOf('@')  ===  -1   ||
                                        email.indexOf('.')  ===  -1   ); }, [email, origin]);




    //check password length is greater than 0
    useEffect(() => { setPasswordError(password.length  ===   0 ); }, [password]);






    // rounds up data from database and checks password on the backend before kicking it back to the flipside.
    function checkPassword (e) {

        e.preventDefault();

        // helper function to authenticate the user
        const authenticateUser = ( data ) => {

            // destructure the user data
            const { user, role } = data;

            // set the user's role in the client
            setAuthRole( role ); 

            // if the user is attempting to access the admin dashboard, set the admin status and board member status
            if ( origin === '/director' ) {

                setAdminStatus( role === 'admin'                     );
                setBoardMember( role === 'admin' || role === 'board' );

            // otherwise, setPerformerClass for performer updates    
            } else {
                
                setPerformerClass      &&
                user.performer_class   && setPerformerClass( user.performer_class );

            }

            // stash the user data in state                                   
            return dataSetter( user );
        
        }


        
        // dislays loading notification
        setStatus('checking');


        // send the email and password to the backend for verification
        // note that { withCredentials: true } is necessary even though we don't have credentials yet.
        // without it, the client will silently ignore the Set-Cookie header returned by the server.
        Axios.post(`${process.env.REACT_APP_API_URL}checkPassword`, 
                     [ table, email, pwTable, fk, password ],
                     { withCredentials: true }
                  )
             .then(  res => {     

                                    // update notification according to response from backend
                                           res.data  === 'no match'      ? setStatus('passwordError')
                                :          res.data  === 'no email'      ? setStatus('emailError')
                                :          res.data  === 'no password'   ? dataSetter('noPassword')
                                :   typeof(res.data) === 'object'        ? authenticateUser(res.data)
                                :                                          setStatus('programError');
                                     
                            }
                  )
            .catch( err => { console.log(err); setStatus('databaseError') } )
    }
   




    function resetPassword () {

        // we declare these here so they can be redefined for
        // Director's Chair password resets.
        // (workaround to accommodate the separate password tables)
        let reqTable   = table;
        let reqPwTable = pwTable;


        // if a valid email hasn't been supplied yet, display error notification and return.
        if (email.length === 0 || emailError) { return setStatus('noEmail'); }
        
        
        // otherwise, display loading notification and continue.
        setStatus('loading');


        // called after a successful database update
        // to send the email with the reset link.
        function resetEmail (id, token) {


            // data for the email
            const inviteBody = {    
                    fk:       fk,
                    type:    'resetEmail',
                    email:    email,
                    origin:   window.location.pathname,
                    pwTable:  reqPwTable,
                    resetId:  id,
                    token:    token 
            };

            Axios.post(`${process.env.REACT_APP_API_URL}email`, inviteBody )
                 .then(  res => { setStatus('resetReady');   }             )
                 .catch( err => { setStatus('programError'); }             );
        }

    

        function registerReset () {
        
        
            let resetId;

            // checks database for email
            Axios.post( `${process.env.REACT_APP_API_URL}checkEmail`, { table: reqTable, email } )
            .then(  res => {  
                                    //email not found                               
                                    if (res.data.length === 0)      {
                                                                        // for Director's Chair login attempts, if the email
                                                                        // isn't found in the board table, check the team table.
                                                                        if (reqTable === 'board') { 
                                                                                                    reqTable   = 'team';
                                                                                                    reqPwTable = 'team_passwords';
                                                                                                    return        registerReset(); 
                                                                                                  }
                                        
                                                                        // otherwise display error notification
                                                                        return setStatus( 'emailError' );                            
                                                                    }
                                else if (res.data.length === 1)     {   
                                                                        resetId = res.data[0][fk]; 

                                                                    // if email is found, register the reset request in the database,
                                                                    // then send the email with the reset link using the resetEmail function.
                                                                    // if there's an error, display error notification.
                                                                        return Axios.post( `${process.env.REACT_APP_API_URL}registerReset`, [ reqPwTable, fk, resetId ]    )
                                                                                    .then(    res => { resetEmail(resetId, res.data[0].token); }                           ); 
                                                                    }  
                                else                                {   return setStatus( 'databaseError' );
                                                                    }                 
                           }
                 )            // if the database update is successful, send the email.
            .catch( err => { setStatus('programError');  } )
        }

        // call registerReset to start the process.
        registerReset();
    }



    return (


        <div className='passwordForm adminForm'>
            
            <h2 className='passwordFormH2'>Sign in to continue</h2>
        
            < TextField
                        name={ origin === '/director' ? 'login' : 'email' }
                       state={email}
                      setter={setEmail}
                       error={emailError}
                      noHelp={true}
                instructions='Whatever address you last submitted.'
            />

            < TextField
                          id='pwField'
                        name='password' 
                       state={password}
                      setter={setPassword}
                       error={passwordError}
                      noHelp={true}
                instructions='Exactly as entered during registration'
            />

            <button id='formSubmitButton' className='formButton' type='button' onClick={(e) => checkPassword(e)}>{<img alt='play icon' src={iconPlay} />}login</button>
            
            <p className='resetLink' 
                style={{marginTop: '5vmin'}}
                onClick={resetPassword}>ResetPassword</p>

            {   
              status === 'checking'         ? <Notification type={'wait'} msg={`Verifying password, this should only take a second...`}                             />
            : status === 'passwordError'    ? <Notification type={'bad' } msg={`You've entered an invalid password.`}                                               />
            : status === 'noPassword'       ? <Notification type={'bad' } msg={`There's been a database error. Please refresh and try again.`}                      />
            : status === 'noEmail'          ? <Notification type={'bad' } msg={`Type in the email you used during signup, so we can send you a reset link.`}        />
            : status === 'emailError'       ? <Notification type={'bad' } msg={`This email doesn't exist in our database.`}                                         />
            : status === 'deliveryError'    ? <Notification type={'bad' } msg={`There was a problem delivering your reset link.\n`+
                                                                               `Please try again and notify us via email form if it persists.`}                     />
            : status === 'programError'     ? <Notification type={'bad' } msg={`There's been a problem with the program.\n`+
                                                                               `Please try again and notify us via email form if it persists.`}                     />
            : status === 'databaseError'    ? <Notification type={'bad' } msg={`Looks like we're having trouble with our database.\n`+
                                                                               `Please try again and notify us via email form if it persists.`}                     />
            : status === 'loading'          ? <Notification type={'wait'} msg={`Processing your request...`}                                                        />
            : status === 'resetReady'       ? <Notification type={'good'} msg={`A password-reset link has been emailed to you.`}                                    />
            :                                  null
            }
            
        </div>
    )






}