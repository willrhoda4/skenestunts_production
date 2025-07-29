







import                         '../../pages/Contact.css'

import   React, 
       { useState,  
         useEffect }      from 'react'; 
import   Axios            from 'axios';

import   TextField        from '../FormFunctions/TextField';
import   TextArea         from '../FormFunctions/TextArea';
import   Notification     from '../Notification';



//  after some back and forth with the team ContactProducer ended up virtually
//  identical to ContactEmail, at least for the time being.
//  I'm leaving it in place in case we need to add more functionality to the
//  producer contact form in the future, but for now the only real differences
//  are the field instructions and the reqBody type.
export default function ContactProducer({setContactDisplay}) {




    const [  name,              setName               ] = useState('');
    const [  phone,             setPhone              ] = useState('');
    const [  email,             setEmail              ] = useState('');
    const [  message,           setMessage            ] = useState('');
    const [  subject,           setSubject            ] = useState('');

    const [  uploadProgress,    setUploadProgress     ] = useState(0);

    const [  nameError,         setNameError          ] = useState(false);
    const [  phoneError,        setPhoneError         ] = useState(false);
    const [  emailError,        setEmailError         ] = useState(false);
    const [  subjectError,      setSubjectError       ] = useState(false);
    const [  messageError,      setMessageError       ] = useState(false);



    // error-handling hooks
    useEffect(() => { setNameError(name.length    ===   0); }, [name]);

    

    useEffect(() => {

    var phoneRegEx   = /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/;
    var validPhone   = phoneRegEx.exec(phone);

    setPhoneError(!validPhone);
                        
    }, [phone]);



    useEffect(() => { setEmailError(    email.indexOf('@')  ===  -1   ||
                                        email.indexOf('.')  ===  -1   ); }, [email]     );
                                   



    useEffect(() => { setSubjectError(subject.length === 0); }, [subject]);


    

    useEffect(() => { setMessageError(message.length <  1); },  [message]);


    // email delivery function
    const sendEmail = (e) => {


        e.preventDefault();

        // if any of the error states are true, display error notification.
        if ( nameError      ||
            phoneError      ||
            emailError      ||
            subjectError    ||
            messageError    ){ return setUploadProgress(-1); } 
            
        else {

            // set uploadProgress to 1 to display delivery message.
            setUploadProgress(1);

            // type is used to determine which email template to use on the backend
            let type = 'producerEmail';   
        
                                                    
            Axios.post( `${process.env.REACT_APP_API_URL}email`, { name, phone, email, subject, message, type }, 
                      )
                 .then( res => { setUploadProgress(res.status);            }
                      )
                .catch( err => { setUploadProgress(400); console.log(err); } );
        } 
    }


    // upload status notification
    const uploadStatus = () => {


        // clear form function
        const clearForm = () => {

            setName('');
            setPhone('');
            setEmail('');
            setSubject('');
            setMessage('');
            setUploadProgress(0);

            }
        
        // if uploadProgress is 0, return null (default).
             if (uploadProgress ===   0   ) { return null }

        // form validation error     
        else if (uploadProgress ===  -1   ) { return <Notification type='bad'  msg='All lights need to shine yellow before message can be sent' /> }
        
        // email delivery in progress
        else if (uploadProgress ===   1   ) { return <Notification type='wait' msg='Email delivering...' /> }

        // successful email delivery
        else if (uploadProgress ===  200  ) { return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}> 
                                                        <Notification type='good' msg='Email successfully sent!' />
                                                        <button className='formButton' onClick={clearForm} >Reset Form</button>
                                                     </div> 
                                            }
        
        // email delivery error
        else if (uploadProgress ===  400  ) { return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}> 
                                                        <Notification type='bad' msg='ERROR!!! Looks like your message got stuck somewhere in the pipeline. Try again, and if the problem persists, please email skene.stunts.website@gmail.com from another application.' />
                                                        <button className='formButton' onClick={clearForm} >Reset Form</button>
                                                     </div> 
                                            }
        
        // any other 
        else                                { return null; }

    }


    return(
            <div className='contactForm'>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Producer Contact Form</h2>
                </div>

                <form id='emailForm'>
                    
                    < TextField
                        className='emailField'
                        name='name'
                        state={name}
                        setter={setName}
                        error={nameError}
                        instructions='Whatever you go by'
                        noHelp={true}
                    />

                
                    < TextField
                        className='emailField'
                        name='email'
                        state={email}
                        setter={setEmail}
                        error={emailError}
                        instructions='Where should we reply to?'
                        noHelp={true}
                    />
                    

                    < TextField
                        className='emailField'
                        name='phone'
                        state={phone}
                        setter={setPhone}
                        error={phoneError}
                        instructions='Use this format: ###-###-####'
                        noHelp={true}
                    />
                    

                    < TextField
                        className='emailField'
                        name='subject'
                        state={subject}
                        setter={setSubject}
                        error={subjectError}
                        instructions='Name of your project works fine.'
                        noHelp={true}
                    />     

                    < TextArea
                        className='emailField'
                        name='message'
                        state={message}
                        setter={setMessage}
                        error={messageError}
                        instructions='Response by phone or email?'
                        noHelp={true}
                    />
                        
                   {    
                        uploadProgress !== 200 &&  <button className='formButton' 
                                                                type='submit' 
                                                             onClick={(e) => sendEmail(e)}
                                                               style={{marginTop: '2em', alignSelf: 'center'}}
                                                   >Send Email</button>
                   }

                </form>

                {uploadStatus()}

            </div>
    )
}  



