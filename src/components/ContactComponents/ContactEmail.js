







import '../../pages/Contact.css'

import   React, 
       { useState, 
         useEffect }  from 'react'; 
import   Axios        from 'axios';

import   TextField    from '../FormFunctions/TextField';
import   TextArea     from '../FormFunctions/TextArea';
import   Notification from '../Notification';


export default function ContactProducer({setContactDisplay}) {


    const [ name,              setName               ] = useState('');
    const [ phone,             setPhone              ] = useState('');
    const [ email,             setEmail              ] = useState('');
    const [ message,           setMessage            ] = useState('');
    const [ subject,           setSubject            ] = useState('');

    const [ uploadProgress,    setUploadProgress     ] = useState(0);

    const [ nameError,         setNameError          ] = useState(false);
    const [ phoneError,        setPhoneError         ] = useState(false);
    const [ emailError,        setEmailError         ] = useState(false);
    const [ subjectError,      setSubjectError       ] = useState(false);
    const [ messageError,      setMessageError       ] = useState(false);



    // error-handling hooks
    useEffect(() => { setNameError(name.length === 0); }, [name]);


    useEffect(() => {

    var phoneRegEx   = /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/;
    var validPhone   = phoneRegEx.exec(phone);

    setPhoneError(!validPhone);
                        
    }, [phone]);


    useEffect(() => {   setEmailError(  email.indexOf('@')  ===  -1   ||
                                        email.indexOf('.')  ===  -1   ); }, [email]     );

    useEffect(() => { setSubjectError(subject.length === 0); },             [subject]   );


    useEffect(() => { setMessageError(message.length > 500); },             [message]   );




    // email delivery function
    const sendEmail = (e) => {


        e.preventDefault();

        // if any fields are flagged as errors, do not send email and display error message
        if ( nameError      ||
            phoneError      ||
            emailError      ||
            subjectError    ||
            messageError    ){ return setUploadProgress(-1); } 
            

        else {

            // set uploadProgress to 1 to display delivery message.
            setUploadProgress(1);

            // type property is used by the server to determine which email template to use
            let type = 'userEmail' 
      
            // send email to server for delivery        email endpoint expects a req.body object, not an array.
            Axios.post(`${process.env.REACT_APP_API_URL}email`, { name, phone, email, subject, message, type }, 
                      )
                 .then(res => {  setUploadProgress(res.status);  }
                      );
        }
    }


    // controls notification message and reset button
    const uploadStatus = () => {


        // reset form function
        const clearForm = () => {

            setName('');
            setPhone('');
            setEmail('');
            setSubject('');
            setMessage('');
            setUploadProgress(0);

            }

            // default
            if (uploadProgress ===   0   ) { return null }

            // form error
            else if (uploadProgress ===  -1   ) { return <Notification type='bad'  msg='All lights need to shine yellow before message can be sent' /> }

            // email delivery in progress
            else if (uploadProgress ===   1   ) { return <Notification type='wait' msg='Email delivering...' /> }
    
            // email delivery success
            else if (uploadProgress ===  200  ) { return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}> 
                                                            <Notification type='good' msg='Email successfully sent!' />
                                                            <button className='formButton' onClick={clearForm} >Reset Form</button>
                                                         </div> 
                                                }
            // email delivery failure
            else if (uploadProgress ===  400  ) { return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}> 
                                                            <Notification type='bad' msg='ERROR!!! Looks like your message got stuck somewhere in the pipeline. Try again, and if the problem persists, please email skene.stunts.website@gmail.com from another application.' />
                                                            <button className='formButton' onClick={clearForm} >Reset Form</button>
                                                         </div> 
                                    }
    
            else                                { return null; }

    }


    return (
            <div className='contactForm'>

                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Get in Touch</h2>
                </div>

                <form id='emailForm'>

                    < TextField
                        name='name'
                        state={name}
                        setter={setName}
                        error={nameError}
                        instructions='As it appears on your birth certificate.'
                        noHelp={true}
                    />

                
                    < TextField
                        name='email'
                        state={email}
                        setter={setEmail}
                        error={emailError}
                        instructions='A valid address is required.'
                        noHelp={true}
                    />
                    

                    < TextField
                        name='phone'
                        state={phone}
                        setter={setPhone}
                        error={phoneError}
                        instructions='Use this format: ###-###-####'
                        noHelp={true}
                    />
                    

                    < TextField
                        name='subject'
                        state={subject}
                        setter={setSubject}
                        error={subjectError}
                        instructions='It helps to be descriptive.'
                        noHelp={true}
                    />     

                    < TextArea
                        name='message'
                        state={message}
                        setter={setMessage}
                        error={messageError}
                        instructions={`Let's keep it under 500 characters. Right now you're at ${message.length}.`}
                        noHelp={true}
                    />
                        
                        <button className='formButton' 
                                    type="submit" 
                                onClick={(e) => sendEmail(e)}
                                    style={{marginTop: '2em', alignSelf: 'center'}}
                                >Send Email</button>

                </form>

                {uploadStatus()}

            </div>
    )
}  



