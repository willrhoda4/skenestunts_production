





/*
    This is a collection of functions that are used by the AdminPerformer component.
    They live here to (try to) keep the AdminPerformer component clean and readable.
*/


import   Notification     from '../Notification.js';
import   TextField        from '../FormFunctions/TextField.js';
import   TextArea         from '../FormFunctions/TextArea.js';

import   pinIcon          from '../../images/icon_pin.svg';
import   sendIcon         from '../../images/icon_send.svg';

import   Axios            from 'axios';







// conjures a note form inside performer profiles.
// this is for internal use only, and is not visible to the public.
function noteForm (id, note, setter, loadDat) {


    // helper function that updates the note in the database.
    function pinNote (e, id, setNote) {

        e.preventDefault();
    
        // get the note from the text area.
        let note = document.getElementById('adminPerformerNote'+id).value
            
        // updates the form notification
        setNote('noting');
    
        // update the database.
        // the response will be handled by the notification component,
        // but the note itself won't refresh until another query is made.
        Axios.put( `${process.env.REACT_APP_API_URL}updateData`, [ 'performers', ['admin_notes'], [note], [['performer_id', id ]] ] )
             .then(  res => { setNote('noted');   })
             .catch( err => { setNote('error');   });             
    }

    return (

        //  this is real simple. a text area, a button, and a notification. 
        <form className='adminPerformerEmailForm' >


            < TextArea
                name='message'
                inputId={'adminPerformerNote' + id} 
                noHelp={true}
                noIndicator={true}
                defaultValue={note}
            />


            <button className='formButton' 
                         type="submit" 
                        style={{marginTop: '5vmin'}}
                      onClick={ e => pinNote(e, id, setter)}>
                {<img className='adminPerformerIcon' alt='pin icon' src={pinIcon} />}
            </button>

            {     note === 'noting' ? <Notification type='wait' msg='Noting your note...'                 />
                : note === 'noted'  ? <Notification type='good' msg='Note successfully stored!'           />
                : note === 'blank'  ? <Notification type='bad'  msg={`There's no use noting nothing.`}    />
                : note === 'error'  ? <Notification type='bad'  msg='There was a database error.'         />
                :                      null
                                        }


        </form>
    )
} 


// give performer the axe after confirming that user wouldn't
// rather just make them a class F, which might do more damage.
function deletePerformer (id, loadData) {

    const warning = `Are you sure you don't just want to make this performer a class F? Proceeding will totally delete them from your database.`;
    
    // eslint-disable-next-line no-restricted-globals
    window.confirm(warning) &&  Axios.post(`${process.env.REACT_APP_API_URL}deleteData`, [ 'performers', 'performer_id', id ])
                                     .then(  res => { loadData('performers');             })
                                     .catch( err => { console.log(err);                   })
}




// allows admin and bnoard to reclassify a performer
// according to their relationship with the company.
function updateClass (id) {

    let newClass  = document.getElementById('newPerformerClass'+id).value;
    let classIcon = document.getElementById('updateClassIcon'+id  );
    let checkIcon = document.getElementById('checkIcon'+id        );

    classIcon.className = 'adminPerformerIcon updating';

    Axios.put(`${process.env.REACT_APP_API_URL}updateData`, [ 'performers', [' performer_class' ], [ newClass ], [[ 'performer_id', id ]] ])
         .then(  res => { 
                          classIcon.style.display = 'none';
                          checkIcon.style.display = 'inline';   
                          console.log(res);                   })
         .catch( err => { console.log(err);                   })
}





// triggers a python script that counts the number of
// stunt credits a performer has on IMDB.
function countCredits (id, setter) {

    setter('counting');

    Axios.post(`${process.env.REACT_APP_API_URL}`, [[id]]                     )
         .then(  res => { setter(res.data[0]);     })
         .catch( err => { console.log(err);        })
}







// summons a simple email form so that admin can reach out to performers
// without having to leave the page.
function emailForm (id, email, status, setter, inputStyle, formStyle) {


    // helper function that sends the email.
    function sendEmail (e, id, email, setter) {

        e.preventDefault();

        
        let type    = 'reachingOut';
        let cc      = document.getElementById('adminPerformerCC'+id).value
        let subject = document.getElementById('adminPerformerSubject'+id).value
        let message = document.getElementById('adminPerformerMessage'+id).value
        

        // subject and message are mandatory
        if ( !subject ||
             !message ){ return setter('blank'); } 
            
        // update the form notification if they aren't blank.
        setter('sending');                                                      
            
        // attempt to send the email, and update the form notification accordingly.
        Axios.post(`${process.env.REACT_APP_API_URL}email`,  { email, subject, message, type, cc  })
             .then(   res => { setter('done');  console.log(res);       })
             .catch(  err => { setter('error'); console.log(err);       });            
    }

    return (


        // quick and dirty email form for fast correspondance.
        <form style={formStyle} className={ status ? 'adminPerformerEmailForm open' : 'adminPerformerEmailForm'} >

                                

                                < TextField
                                    name='subject'
                                    inputId={'adminPerformerSubject' + id} 
                                    style={inputStyle}
                                    noHelp={true}
                                    noIndicator={true}
                                />


                                < TextField
                                    name='cc'
                                    inputId={'adminPerformerCC' + id} 
                                    style={inputStyle}
                                    noHelp={true}
                                    noIndicator={true}
                                />

                               
                                < TextArea
                                    name='message'
                                    inputId={'adminPerformerMessage' + id} 
                                    style={inputStyle}
                                    noHelp={true}
                                    noIndicator={true}
                                />


                                <button className='formButton' 
                                            type="submit" 
                                            style={{marginTop: '5vmin'}}
                                        onClick={(e) => sendEmail(e, id, email, setter)}>
                                    {<img className='adminPerformerIcon' alt='phone icon' src={sendIcon} />}
                                </button>

                                {     status === 'sending' ? <Notification type='wait' msg='Email delivering...'                   />
                                    : status === 'done'    ? <Notification type='good' msg='Message successfully sent!'            />
                                    : status === 'blank'   ? <Notification type='bad'  msg='Subject and message are mandatory!'    />
                                    : status === 'error'   ? <Notification type='bad'  msg='There was an email error.'             />
                                    :                           null
                                }
        </form>
    )


}


// ship'em off to AdminLand
export {  
         noteForm, 
         emailForm, 
         updateClass, 
         countCredits, 
         deletePerformer
};
