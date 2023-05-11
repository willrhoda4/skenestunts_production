







import './AdminTools.css'

import   React, 
       { useState, 
         useEffect } from 'react'; 
import   Axios       from 'axios';

import TextField    from '../FormFunctions/TextField.js';
import DatePicker   from '../FormFunctions/DatePicker.js';
import Notification from '../Notification.js';


export default function MediaForm({loadData, currentData, setCurrentData, table, columns, update, pkName, url}) {


    const [ headline,        setHeadline        ] = useState('');
    const [ date,            setDate            ] = useState('');
    const [ outlet,          setOutlet          ] = useState('');
    const [ articleURL,      setArticleURL      ] = useState('');
    const [ imageURL,        setImageURL        ] = useState('');
    const [ imageAlt,        setImageAlt        ] = useState('');

    const [ headlineError,   setHeadlineError   ] = useState(false);
    const [ dateError,       setDateError       ] = useState(false);
    const [ outletError,     setOutletError     ] = useState(false);
    const [ articleURLError, setArticleURLError ] = useState(false);
    const [ imageURLError,   setImageURLError   ] = useState(false);
    const [ imageAltError,   setImageAltError   ] = useState(false);
    const [ uploadError,     setUploadError     ] = useState(false);

    const [ formStatus,      setFormStatus      ] = useState(false);




    // if update is not null, then we are updating an existing record,
    // so we need to set the state variables to the right values.
    useEffect(() => {
        
        
        const setters = [   
                            setHeadline,
                            setDate,
                            setOutlet,
                            setArticleURL,
                            setImageURL,
                            setImageAlt,
                        ]

        if (update) {
            
            for (let i = 0; i < setters.length; i++) {
                setters[i](update[i])
            }
        }
    }, [update])


    useEffect(() => { setHeadlineError(headline.length  ===   0) }, [headline]);
                

    useEffect(() => {

        const dateRegEx       = /^\d{4}[-/\s]?((((0[13578])|(1[02]))[-/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[-/\s]?(([0-2][0-9])|(30)))|(02[-/\s]?[0-2][0-9]))$/;
        const validBirthday   = dateRegEx.exec(date);
    
         setDateError(!validBirthday);

    }, [date]);


    useEffect(() => { setOutletError(outlet.length  ===   0) }, [outlet]);


    useEffect(() => {
        
        if (articleURL) { let URL                 = document.createElement('input')
                              URL.type            = 'url';
                              URL.value           = articleURL;
                             !URL.checkValidity() ? setArticleURLError(true)
                                                  : setArticleURLError(false);
                        }
    }, [articleURL]);


    // the imageURL field accepts the strong 'logo' in lieu of a valid URL.
    // unsurprisingly, if selected the website will substitute a logo instead of a photo.
    useEffect(() => {
        
            if ( imageURL === 'logo' ) {               setImageURLError(false); }

      else  if ( imageURL) { let URL                 = document.createElement('input')
                                 URL.type            = 'url';
                                 URL.value           = imageURL;
                                !URL.checkValidity() ? setImageURLError(true)
                                                     : setImageURLError(false);

                        }
    }, [imageURL]);


    useEffect(() => { setImageAltError(imageAlt.length  ===   0); }, [imageAlt]);





    const uploadArticle = (e) => {
       
        e.preventDefault();


        // drop everything an d throw up a notification if there are any errors,
        // take it down and proceed with caution if there isn't.
        if   (  articleURLError ||
                headlineError   ||
                imageURLError   ||
                imageAltError   ||
                outletError     ||
                dateError       ){ return setFormStatus('inputError');  }
        else                     {        setFormStatus(false);         }


        let columnList =   columns;
        let parameters = [ headline, date, outlet, articleURL, imageURL, imageAlt ];
        

        if (!update) {

            // if we are adding a new record, we need to add the rank column to the list of columns
            columnList = columnList.concat( ['rank']               );
            parameters = parameters.concat( [currentData.length+1] );
            
            Axios.post( `${url}addData`,  [table, columnList, parameters]    )
                    .then(  res => { setFormStatus('uploaded'); loadData(table); }              )
                    .catch( err =>   setFormStatus('uploadError')                               );
                
        } else {

            // if we are updating an existing record, we need to add the primary key to the request body as a filter .
            Axios.put( `${url}updateData`, [table, columnList, parameters, [ pkName, update.at(-1)]])
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
                <h2 className='formTitle'>Add Media</h2> 


                <form className='adminFormFields'>

                    < TextField
                        name='headline'
                        state={headline}
                        setter={setHeadline}
                        error={headlineError}
                        instructions='Headlines will be capitalized automatically.'
                        noHelp={true}
                    />

                    < DatePicker
                        name='date'
                        state={date}
                        setter={setDate}
                        error={dateError}
                        instructions='Use this format: YYYY-MM-DD'
                        noHelp={true}
                    />  

                    < TextField
                        name='outlet'
                        state={outlet}
                        setter={setOutlet}
                        error={outletError}
                        instructions='Capitalize as appropriate.'
                        noHelp={true}
                    />

                
                    < TextField
                        name='article URL'
                        state={articleURL}
                        setter={setArticleURL}
                        error={articleURLError}
                        instructions='Paste in a link to the article page.'
                        noHelp={true}
                    />
                    

                    < TextField
                        name='image URL'
                        state={imageURL}
                        setter={setImageURL}
                        error={imageURLError}
                        instructions={`Enter 'logo' to substitute the company logo`}
                        noHelp={true}
                    />
                    

                    < TextField
                        className='emailField'
                        name='image description'
                        state={imageAlt}
                        setter={setImageAlt}
                        error={imageAltError}
                        instructions='be brief and specific.'
                        noHelp={true}
                    />     

{
                            formStatus === 'inputError'  ? <Notification type='bad'  msg='Looks like something is filled out incorrectly. Make sure all the lights are shining green, then try again.' />
                        :   formStatus === 'uploadError' ? <Notification type='bad'  msg='There was a problem uploading your article. Try refreshing the page before you reattempt.' />
                        :   formStatus === 'uploaded'    ? <Notification type='good' msg='Article successfully uploaded!' />
                        :   formStatus === 'updated'     ? <Notification type='good' msg='Article successfully updated!' />
                        :   formStatus === 'dataError'   ? <Notification type='bad'  msg='A data error has occured. Try refreshing the page and reattempting.' />
                        :   formStatus === 'httpError'   ? <Notification type='bad'  msg='A network error has occured. Try refreshing the page and reattempting.' />
                        :                                  null
                    }
                    

                </form>

                <button className='formButton' type="submit" onClick={(e) => uploadArticle(e)}>{ update ? 'Update Article' : 'Post Article' }</button>
                
                { uploadError && <Notification type='bad' msg='Make sure all the lights on the form are shining green before you post!' /> }

            </div>
    )
}  



