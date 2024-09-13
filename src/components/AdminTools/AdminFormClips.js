







import './AdminTools.css'

import   React, 
       { useState, 
         useEffect } from 'react'; 
import   Axios       from 'axios';

import TextField from '../FormFunctions/TextField';


export default function ReelForm({loadData, currentData, setCurrentData, table, columns, url}) {


    const [ title,             setTitle             ] = useState('');
    const [ caption,           setCaption           ] = useState('');
    const [ embedURL,          setEmbedURL          ] = useState('');
   

    const [ titleError,        setTitleError        ] = useState(false);
    const [ captionError,      setCaptionError      ] = useState(false);
    const [ embedURLError,     setEmbedURLError     ] = useState(false);
  



    useEffect(() => {   setTitleError(  title.length     ===   0 );   }, [title]);
                

    useEffect(() => {   setCaptionError( caption.length  ===   0 );   }, [caption]);


    useEffect(() => {
        
        if (embedURL) {   let URL                 = document.createElement('input')
                              URL.type            = 'url';
                              URL.value           = embedURL;
                             !URL.checkValidity() ? setEmbedURLError(true)
                                                  : setEmbedURLError(false);
                        }
    }, [embedURL]);




    const uploadReel = (e) => {


        e.preventDefault();

        // concat 'rank' to the end of the columns array,
        // include the next available rank in the parameters array.
        const columnList = columns.concat(['rank']);
        const parameters = [ title, caption, embedURL, currentData.length+1];
      
        Axios.post( `${ url }addData`,
                      [ table, columnList, parameters ],
                      { withCredentials: true }
                  )
             .then( res => { loadData(table); });
        
    }

    return(

            <div className='adminForm'>

                <h2 className='formTitle'>Add Media</h2> 


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
                        state={embedURL}
                        setter={setEmbedURL}
                        error={embedURLError}
                        instructions='Paste in a link to the article page.'
                        noHelp={true}
                    />
                    

                    

                </form>

                <button className='formButton' type="submit" onClick={(e) => uploadReel(e)}>Post Reel</button>

            </div>
    )
}  



