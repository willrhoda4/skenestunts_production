





import   Axios            from 'axios';
import { useState,    
         useEffect }      from 'react';

import   TextField        from '../FormFunctions/TextField.js';
import   Notification     from '../Notification.js';
import   cloudinaryUpload from '../../utils/cloudinaryUpload.js';



export default function PosterBarn( {   setCurrentData, 
                                        adminStatus,
                                        loadData,
                                        getData, 
                                        columns, 
                                        table 
                                    } ) {
    



    const [ posterURL,      setPosterURL      ] = useState('');
    const [ title,          setTitle          ] = useState('');
    const [ imdbID,         setImdbID         ] = useState('');

    const [ posterURLError, setPosterURLError ] = useState(false);
    const [ titleError,     setTitleError     ] = useState(false);
    const [ imdbIDError,    setImdbIDError    ] = useState(false);

    const [ formStatus,     setFormStatus     ] = useState(false);



    // validate the poster URL                                    
    useEffect(() => {
   
        function validateURL( url ) {
            
            try { new URL(url); return true;  } 
            
            catch (e) {         return false; }
        }

        setPosterURLError( !validateURL( posterURL ) );
    
    }, [ posterURL ] );


    // validate the title
    useEffect(() => { setTitleError( title.length === 0 ); }, [ title ] );


    // validate the IMDb ID
    useEffect(() => {

        function validateIMDbID( id ) {
            const imdbRegex = /^tt\d{7}$/;
            return imdbRegex.test(id);
        }

        setImdbIDError( !validateIMDbID( imdbID ) );
    
    }, [ imdbID ] );


    // extract the IMDb ID from the poster URL
    // and set it as the state
    useEffect(() => {
    
        function extractIMDbIDFromURL( url ) {

            const  imdbIdMatch = url.match(/tt\d{7}/);
            return imdbIdMatch ? imdbIdMatch[0] : null;
        }

        const extractedImdbID = extractIMDbIDFromURL( posterURL );
    
        extractedImdbID && extractedImdbID !== imdbID && setImdbID(extractedImdbID);

    }, [ posterURL, imdbID ] );

    
    // function to add a poster to the database
    async function addPoster() {


        // make sure all the fields are filled out correctly
        if (  posterURLError 
           || imdbIDError 
           || titleError 
           ){ return setFormStatus('inputError') }


        setFormStatus('uploading');

        // remove any special characters from the title for Cloudinary
        const cleanString = str => str.replace(/[^a-zA-Z0-9 ]/g, '');

        const cleanTitle  = cleanString(title);

        let parameters = [ cleanTitle, imdbID ];          

        
        // upload the poster to Cloudinary
        try         {
                        const imageId = await cloudinaryUpload( posterURL, cleanTitle, table );
                        parameters    = parameters.concat( [ imageId ] );
                    }
        catch (err) {   
                        console.log(err); 
                        setFormStatus('cloudinaryError');   
                    }
                    console.log(parameters);

        // add a record to the database
        Axios.post( `${ process.env.REACT_APP_API_URL}addData`, 
                      [ table, columns, parameters   ], 
                      { withCredentials: true        } 
                  )
             .then(  res => {
                                loadData(table);
                                setFormStatus('uploaded');
                            }
                 )
           .catch(   err => {
                                console.log(err);
                                setFormStatus('uploadError');
                            }
                 );

    }


    // function to search posters by letter from the database
    function letterSearch() {
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        function getLetterPosters( letter ) {

            Axios.post( `${process.env.REACT_APP_API_URL}getPostersByLetter`, [ letter ], { withCredentials: true } )
                .then(  res => setCurrentData(res.data))
                .catch( err => {
                                    console.log(err);
                                    setFormStatus('dataError');
                               }
                      );
        }

        return alphabet.map( ( letter, index ) => (
            <p className="letterLink" key={ index } onClick={ () => getLetterPosters( letter ) } >
                { ' ' + letter + ' ' }
            </p>
        ) );
    }



    return (

        <div className="adminForm">

            <div id="posterBarnBlurb">
                <h2>Welcome to the</h2>
                <h2 style={{ marginBottom: '5vh' }}>poster barn!</h2>
                <p style={{ marginBottom: '2.5vh' }}>
                    {`A place to peruse the posters in your database. ${ adminStatus && ' You can also use the form below to manually add a new poster.' }`}
                </p>
            </div>

            {   adminStatus && <form className='adminFormFields'>
                
                    < TextField
                        name='poster URL'
                        state={posterURL}   
                        setter={setPosterURL}
                        error={posterURLError}
                        instructions='right-click > copy image link'
                        noHelp={true}
                    />

                    
                    < TextField
                        name='title'
                        state={title}
                        setter={setTitle}
                        error={titleError}
                        instructions='punctuation will be automatically removed'
                        noHelp={true}
                    />
                    
                    
                    < TextField
                        name='IMDb ID'
                        state={imdbID}
                        setter={setImdbID}
                        error={imdbIDError}
                        instructions='use the format tt1234567'
                        noHelp={true}
                    />


                    <div id="barnButtons">
                        <button className="formButton" type="button" onClick={addPoster}>
                            Add Poster
                        </button>
                    </div>
                
                </form>
            }
            {
                    formStatus === 'inputError'       ? <Notification type='bad'  msg='Looks like something is filled out incorrectly. Make sure all the lights are shining green, then try again.' />
                :   formStatus === 'dataError'        ? <Notification type='bad'  msg='There was a problem connecting with the database. Try refreshing the page and reattempting.' />
                :   formStatus === 'cloudinaryError'  ? <Notification type='bad'  msg='Looks like there was a problem uploading the image to your cloud server.' />
                :   formStatus === 'uploadError'      ? <Notification type='bad'  msg='There was a problem uploading your poster. Try refreshing the page before you reattempt.' />
                :   formStatus === 'uploading'        ? <Notification type='wait' msg='Uploading poster now...' />
                :   formStatus === 'uploaded'         ? <Notification type='good' msg='Poster successfully uploaded!' />
                :                                   null
            }


            <div id="letterSearch">{letterSearch()}</div>
        </div>
    );
}


