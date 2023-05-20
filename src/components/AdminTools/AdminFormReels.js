







import './AdminTools.css'

import   React, 
       { useState, 
         useEffect }   from 'react'; 
import   Axios         from 'axios';

import   TextField     from '../FormFunctions/TextField.js';
import   Notification  from '../Notification.js';





export default function ReelForm({loadData, currentData, setCurrentData, table, columns, update, pkName, url}) {


    const [ title,             setTitle             ] = useState('');
    const [ caption,           setCaption           ] = useState('');
    const [ embedCode,         setEmbedCode         ] = useState('');
   

    const [ formStatus,        setFormStatus        ] = useState(false);
    const [ titleError,        setTitleError        ] = useState(false);
    const [ captionError,      setCaptionError      ] = useState(false);
    const [ embedCodeError,    setEmbedCodeError    ] = useState(false);
  

    useEffect(() => {
        
        
        const setters = [   
                            setTitle,
                            setCaption,
                            setEmbedCode,
                        ]

        if (update) {
            
            for (let i = 0; i < setters.length; i++) {
                setters[i](update[i])
            }
        }

    }, [update])



    useEffect(() => { setTitleError(title.length  ===   0); }, [title]);
   

    useEffect(() => { setCaptionError(caption.length  ===   0); }, [caption]);


    useEffect(() => { setEmbedCodeError(!embedCode.startsWith('<iframe') &&
                                        !embedCode.startsWith('<div')         ) }, [embedCode]);



    // function to upload reel to database.
    const uploadReel = (e) => {

        e.preventDefault();


        // if any of the fields are empty, display an error notification.
        // otherwise, clear current notification and continue.

        if ( titleError     ||
             captionError   ||
             embedCodeError ){ return setFormStatus('inputError');  }
        else                 {        setFormStatus(false);         }


        let columnList = columns;
        let parameters = [ title, caption, embedCode ];

        if (!update) {

            // if this is a new reel, add the rank column and parameter to the list.
            columnList = columnList.concat( ['rank']               );
            parameters = parameters.concat( [currentData.length+1] );
            
            Axios.post( `${url}addData`,  [table, columnList, parameters]                    )
                 .then(  res => { setFormStatus('uploaded'); loadData(table); }              )
                 .catch( err =>   setFormStatus('uploadError')                               );
             
        } else {

            // if this is an update, add the primary key name and value to the end of the 
            // request body, as a filter.
            Axios.put( `${url}updateData`, [ table, columnList, parameters, [[ pkName, update.at(-1)]] ])
                                                                    .then(  res => { 
                                                                                        console.log(res);
                                                                                        loadData(table); 
                                                                                        setFormStatus('updated')
                                                                                    }
                                                                         )
                                                                    .catch( err => { console.log(err); setFormStatus('httpError'); } );
        }


        
    }

    return(
            <div className='adminForm'>
                <h2 className='formTitle'>Add Reel</h2> 


                <form className='adminFormFields'>

                    < TextField
                        name='title'
                        state={title}
                        setter={setTitle}
                        error={titleError}
                        instructions='Headlines will be capitalized automatically.'
                        noHelp={true}
                    />

                  

                    < TextField
                        name='caption'
                        state={caption}
                        setter={setCaption}
                        error={captionError}
                        instructions='Capitalize as appropriate.'
                        noHelp={true}
                    />

                
                    < TextField
                        name='embed URL'
                        state={embedCode}
                        setter={setEmbedCode}
                        error={embedCodeError}
                        instructions='This is where you paste the embed code from Vimeo.'
                        noHelp={true}
                    />
                    
                    {
                            formStatus === 'inputError'  ? <Notification type='bad'  msg='Looks like something is filled out incorrectly. Make sure all the lights are shining green, then try again.' />
                        :   formStatus === 'uploadError' ? <Notification type='bad'  msg='There was a problem uploading your reel. Try refreshing the page before you reattempt.' />
                        :   formStatus === 'uploaded'    ? <Notification type='good' msg='Reel successfully uploaded!' />
                        :   formStatus === 'updated'     ? <Notification type='good' msg='Reel successfully updated!' />
                        :   formStatus === 'dataError'   ? <Notification type='bad'  msg='A data error has occured. Try refreshing the page and reattempting.' />
                        :   formStatus === 'httpError'   ? <Notification type='bad'  msg='A network error has occured. Try refreshing the page and reattempting.' />
                        :                                  null
                    }

                    

                </form>

                <button className='formButton' type="submit" onClick={(e) => uploadReel(e)}>{ update ? 'Update Reel' : 'Post Reel' }</button>

            </div>
    )
}  



