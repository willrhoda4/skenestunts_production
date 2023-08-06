






import { useState,  
         useEffect  }   from 'react';
import   Axios          from 'axios';

import   TextField      from '../../FormFunctions/TextField.js';
import   TextArea       from '../../FormFunctions/TextArea.js';
import   Notification   from '../../Notification.js';

import   iconRewind     from '../../../images/icon_rewind.svg';


// Page 10 is the last page of the form. 
// it collects a password and optional note, then submits the form.
export default function Page10 ({ 
                                  update, 
                                  columns, 
                                  formState, 
                                  pageState, 
                                  newPhotos, 
                                  setPageState, 
                                  setCurrentPage, 
                                  performerClass, 
                               }) {

    
    const [  uploadProgress, setUploadProgress  ] = useState(0);
    const [  uploading,      setUploading       ] = useState(false);

    const [  valuesLoaded,   setValuesLoaded    ] = useState(false);
    const [  updateCount,    setUpdateCount     ] = useState(0);

    const [  password,       setPassword        ] = useState('');
    const [  whatElse,       setWhatElse        ] = useState('');

    const [  passwordError,  setPasswordError   ] = useState(false);
    const [  whatElseError,  setWhatElseError   ] = useState(false);


    
    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === 3) {

            setValuesLoaded(true);
            setWhatElse(pageState[0]);

            update && setUpdateCount(pageState[1]+1)
        }
        
    }, [pageState, update, valuesLoaded])


    // update pageState when values change
    useEffect(() => { setPageState([ whatElse, updateCount, performerClass ]); }, [ performerClass, setPageState, updateCount, whatElse ])


    // keeps password a respectable length
    useEffect(() => { setPasswordError(password.length  <    8);  }, [password]);


    // keeps whatElse a respectable length... just differently.
    useEffect(() => { setWhatElseError(whatElse.length  >   500); }, [whatElse]);


    // waits for imageIds to land in state, then submits the rest of the data.
   


    // throws up an apologetic notification if image uploading takes longer than 30 seconds.
    useEffect(() => {    

        let takingTooLong;

        if (uploading) { takingTooLong = setTimeout(() => { 
                                                            if ( uploadProgress !==  200 &&
                                                                 uploadProgress !==  400 &&
                                                                 uploadProgress !==  412 ){ setUploadProgress(408); }  
                                                         }, 30000); }

        return () => clearTimeout(takingTooLong);

    }, [uploading, uploadProgress])




    const uploadProfile = (e) => {

        setUploading(true);
        
        // declare variables for updateData/newPerformer requests
        let columnList;
        let databaseState;

        // attaches a submitted_when or updated_when timestamp to the formState
        let allState        = formState.concat([ Date.now() ])

        // attaches a submitted_when or updated_when column name to the column list
        let flatColumns     = !update ? columns.flat().concat([ 'submitted_when' ])
                                      : columns.flat().concat([ 'updated_when'   ]);

        // if there are no new photos, remove the headshot and bodyshot state and columns.
        if (update && !newPhotos)  { databaseState = [].concat(  allState.slice(   0,8), allState.slice(   10) );
                                     columnList    = [].concat(  flatColumns.slice(0,8), flatColumns.slice(10) );
                                   } 
       

        e.preventDefault();


        // newPerformer request requires a password to be passed in at index 2.
        const newPerformer = () => {

            Axios.post( `${process.env.REACT_APP_API_URL}newPerformer`, [ columnList, databaseState, password ])
                 .then(   res => { setUploadProgress(res.status); console.log(res);  })
                 .catch(  err => { console.log(err); setUploadProgress(400);         })
                 .finally( () => { setUploading(false);                              });

        }


        // updateData request requires a performer_id filter array  to be passed in at index 3.
        const updateProfile = () => {

            Axios.put( `${process.env.REACT_APP_API_URL}updateData`, ['performers', columnList, databaseState, [['performer_id', update]]])
                 .then(   res => { setUploadProgress(res.status); console.log(res); })
                 .catch(  err => { console.log(err); setUploadProgress(400);        })
                 .finally( () => { setUploading(false);                             });

        }


        // uploadPhotos request requires a headshot, and bodyshot loaded into a FormData object.
        const uploadPhotos = () => {

            let fd = new FormData();
                fd.append('name',     formState[1]+'_'+formState[0]     );
                fd.append('headshot', formState[8],    formState[8].name);
                fd.append('bodyshot', formState[9],    formState[9].name);

                                                                        // onUploadProgress is a function that updates the uploadProgress state
                                                                        // for display in the uploadProgress notification.
            Axios.post( `${process.env.REACT_APP_API_URL}performerPhotos`,  fd, {  onUploadProgress: progressEvent => {  
                                                                            setUploadProgress( Math.floor(progressEvent.loaded / progressEvent.total * 100 ) );
                                                                        }
                                                                     }
                      )
                 .then( res => { 
                                    // if the upload is successful, update the notification to let the user know.
                                    setUploadProgress(100);

                                    // wrap the imageIds in an array, and insert them into the databaseState at the appropriate index.
                                    // take the flatColumns list as is.
                                    const imageIds = [ res.data[0], res.data[1] ]

                                    databaseState  = [].concat(  allState.slice(0,8),   imageIds, allState.slice(10) );
                                    columnList     = flatColumns;
                                            
                                    // if this is a new performer, call newPerformer(), otherwise call updateProfile().
                                    update ? updateProfile() : newPerformer();    
                               }
                      )             // if the upload fails, update the notification to let the user know.
                .catch( err => {    console.log(err);
                                    setUploading(false);
                                    setUploadProgress(412);    
                               })
        }

        

        // if the note is too long (in any case), or the password is too short (in the case of a new performer),
        // throw up an error notification and return.

             if ( ( update &&  whatElseError) ||
                  (!update && (whatElseError  || passwordError) ) ) { return setUploadProgress(-1);  }
       
        // unless this is an update with no new photos, start by uploading the photos.
        // the uploadPhotos function will taker care of calling updateProfile or newPerformer when it's done.
        else if (!(update && !newPhotos) )                          { return uploadPhotos();         }
        
        // if this is an update with no new photos, skip to updateProfile().
        else                                                        { return updateProfile();        }


    }

    const uploadStatus = () => {


             if ( uploadProgress ===   0  ) { return null            
                                                                                                                                      }
        // form error
        else if ( uploadProgress ===  -1  ) { return <Notification type='bad'  msg={'Make sure both lights are shining green before you submit.'} />                                           }

        // upload in progress  
        else if ( uploadProgress  <   100 ) { return <Notification type='wait' msg={`Image uploads ${uploadProgress}% complete`} />                                                             }

        // upload complete, but database still working
        else if ( uploadProgress ===  100 ) { return <Notification type='wait' msg={'Loading profile into database...'} />                                                                     }

        // upload is taking longer than 30 seconds
        else if ( uploadProgress ===  408 ) { return <Notification type='wait' msg={'Still working here, we swear it. Hang tight...'} />                                                       }

        // upload complete, database complete
        else if ( uploadProgress ===  200 ) { return <Notification type='good' msg={`Profile successfully saved! We'll get in touch with you if any opportunities come up.`} />                }

        // upload complete, database error
        else if ( uploadProgress ===  400 ) { return <Notification type='bad'  msg={'There was a problem uploading your profile. Try again, and please email us if the problem persists.'} />  }
        
        // upload error
        else if ( uploadProgress ===  412 ) { return <Notification type='bad'  msg={'There was a problem uploading your photos. Try again, and please email us if the problem persists.'} />   }

        else                                { return null }

    }



    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Wrapping Up</h2>
                </div>

                {   !update ? <>
                                <p>Almost done! Last thing we need is a password, and you can use the area below if there's anything else we should know.</p>
                                <p style={{margin:'1em 0 2em'}}>Thank you for verifying the accuracy of all information provided before submitting.</p>
                              </>
                            : <>
                                <p>Thanks for taking the time to update your profile. Current information is a huge help to us during the hiring process.</p>
                                <p style={{margin:'1em 0 2em'}}>As always, we appreciate you taking a minute to double-check your facts before submission.</p>
                              </> 
                } 

                {   !update &&
                    < TextField
                        name='password'
                        state={password}
                        setter={setPassword}
                        error={passwordError}
                        instructions='Minimum of eight characters.'

                    />
                }
                <div style={{width: '100%'}}>
                    < TextArea
                        name='what else?'
                        state={whatElse}
                        setter={setWhatElse}
                        error={whatElseError}
                        instructions={`Let's keep it under 500 characters. Right now you're at ${whatElse.length}.`}
                        noHelp={true}
                    />
                </div>
                {   (performerClass ==='D' || performerClass === 'C') &&
                        <Notification type='idea' msg='Providing a link to a demo reel is the best way to give us a better sense of your abilities.' />

                }

                {   uploadProgress !== 200  &&

                        <div className='pageButtons' style={{marginTop: '2em'}}>
                            <button  className='formButton'              
                                          type='button' 
                                       onClick={()  => setCurrentPage(9)}>{ <img alt='rewind icon' 
                                                                           className='buttonIcon'
                                                                                 src={iconRewind}/>
                                                                          }back</button>
                            <button  className='formButton submitButton' 
                                            id='formSubmitButton'
                                          type='button' 
                                       onClick={(e) => uploadProfile(e)}>{ <div style={{ borderRadius: '100%', 
                                                                                         background: 'white', 
                                                                                         height: '.8em',
                                                                                         width:  '.8em',
                                                                                         margin: '.1em'
                                                                                      }} />
                                                                          }{ update ? 'update' : 'submit' }</button>
                        </div>      
                }

               { uploadStatus() }
               
            </>)
}







