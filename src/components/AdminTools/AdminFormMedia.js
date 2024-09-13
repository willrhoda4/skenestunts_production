







import                           './AdminTools.css'

import   React,         
       { useState,      
         useEffect }        from 'react'; 
import   Axios              from 'axios';

import   TextField          from '../FormFunctions/TextField.js';
import   DatePicker         from '../FormFunctions/DatePicker.js';
import   Checkbox           from '../FormFunctions/Checkbox.js';
import   Notification       from '../Notification.js';

import   cloudinaryUpload   from '../../utils/cloudinaryUpload.js';


export default function MediaForm({loadData, currentData, setCurrentData, table, columns, update, pkName}) {


    const [ headline,        setHeadline        ] = useState('');
    const [ date,            setDate            ] = useState('');
    const [ outlet,          setOutlet          ] = useState('');
    const [ articleURL,      setArticleURL      ] = useState('');
    const [ imageURL,        setImageURL        ] = useState('');
    const [ imageAlt,        setImageAlt        ] = useState('');

    const [ newImage,        setNewImage        ] = useState(false);

    const [ headlineError,   setHeadlineError   ] = useState(false);
    const [ dateError,       setDateError       ] = useState(false);
    const [ outletError,     setOutletError     ] = useState(false);
    const [ articleURLError, setArticleURLError ] = useState(false);
    const [ imageURLError,   setImageURLError   ] = useState(false);
    const [ imageAltError,   setImageAltError   ] = useState(false);

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





    async function uploadArticle (e) {
       
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


        // prepare the data for the upload request.
        let   columnList   =   columns;

        let   parameters   = [ headline, date, outlet, articleURL, imageAlt ];

        const updloadStory = ( cols, params ) => Axios.post( `${ process.env.REACT_APP_API_URL }addData`,   
                                                               [ table, cols, params ],
                                                               { withCredentials: true } 
                                                           );
        
        const updateStory  = ( cols, params ) => Axios.put(  `${ process.env.REACT_APP_API_URL }updateData`,
                                                               [ table, cols, params, [ [ pkName, update.at(-1) ] ] ],
                                                               { withCredentials: true }  
                                                          );
        
        const sendStory    =   update ? updateStory : updloadStory;




        // if we are adding a new record, we need to add the rank column to the list of columns
        if (!update) {

            columnList = columnList.concat( ['rank']               );
            parameters = parameters.concat( [currentData.length+1] );          
        } 



        // if we are uploading a new image, we need to upload it to Cloudinary first.
        if ( !(update && !newImage) ) {


            try         {

                            const imageId  = imageURL === 'logo' ? imageURL
                                                                 : await cloudinaryUpload( imageURL, headline, table );
                     
                            parameters     = parameters.concat( [ imageId  ] );
                            columnList     = columnList.concat( ['image_id'] );
                        }
            catch (err) {   
                            console.log(err); 
                            setFormStatus('imageError'); 
                        }
        }



        sendStory( columnList, parameters )
            .then( res => { 
                            console.log(res);
                            loadData(table); 
                            setFormStatus('uploaded');
                          }
                 )
           .catch( err => { 
                            console.log(err); 
                            setFormStatus('uploadError'); 
                          } 
                 );


        

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
                    


                     {/* Next two conditional blocks handle the image upload process. */}
                     {   update && !newImage    ?   <div style={ { marginBottom: '2em' } }>
                                                        < Checkbox    
                                                              name={ 'update profile photo' }
                                                             state={  newImage              }
                                                            setter={  setNewImage           }
                                                        />
                                                    </div>
                    
                                                :   < TextField
                                                        name='image URL'
                                                        state={imageURL}
                                                        setter={setImageURL}
                                                        error={imageURLError}
                                                        instructions={`Enter 'logo' to substitute the company logo`}
                                                        noHelp={true}
                                                    />
                    }
                    {   update && newImage      &&  <p id='oldImageGraf' onClick={() => setNewImage(false)}>stick with old image</p>    }
                    

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
                        :   formStatus === 'imageError'  ? <Notification type='bad'  msg='Looks like there was a problem uploading the image to your cloud server.' />
                        :   formStatus === 'uploadError' ? <Notification type='bad'  msg='There was a problem uploading your information. Try refreshing the page before you reattempt.' />
                        :   formStatus === 'uploading'   ? <Notification type='wait' msg='Uploading article now...' />
                        :   formStatus === 'uploaded'    ? <Notification type='good' msg={`Article successfully ${ update ? 'updated' : 'uploaded'}!`} />
                        :   formStatus === 'dataError'   ? <Notification type='bad'  msg='A data error has occured. Try refreshing the page and reattempting.' />
                        :                                   null
                    }
                    

                </form>

                <button className='formButton' type="submit" onClick={(e) => uploadArticle(e)}>{ update ? 'Update Article' : 'Post Article' }</button>
                

            </div>
    )
}  



