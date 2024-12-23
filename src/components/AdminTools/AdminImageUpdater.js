






import    FileUploader         from "../FormFunctions/FileUploader"
import    Notification         from "../Notification"

import    cloudinaryUpload     from "../../utils/cloudinaryUpload";

import    Axios                from 'axios';

import { useState,
         useEffect, }          from "react"
         





// component to handle image updates to cloudinary.
// we use this to power header-background and team-photo updates
export default function AdminImageUpdater ( { title, folder, imageId, loadData } ) {



    const [ image,        setImage        ] = useState(false);
    const [ uploadStatus, setUploadStatus ] = useState('');
    const [ imageError,   setImageError   ] = useState(false);


    
    // checks if the new background image is a jpeg, and sets the newBackgroundError state accordingly.
    useEffect(() => {
    
       const jpegRegEx   =  /^(.)+\.(jpg|jpeg|JPG|JPEG)$/;
       const validImage  =  jpegRegEx.exec(image.name);
    
       setImageError(!validImage);
       
    }, [ image ] );
     



// uploads the new background image to the server,
// then updates the background id in the misc table.
async function uploadBackground( e) {


    e.preventDefault();


    // check for errors before proceeding
    if ( imageError ) { return setUploadStatus( 'error'     ); } 
    else              {        setUploadStatus( 'uploading' ); }


    try {

        // use the helper function to upload the image and get the new versioned public ID
        const nuPublicId = await cloudinaryUpload( image, imageId, folder );

        // Update the background id in the misc table
        const serverURL  = process.env.REACT_APP_API_URL;
        const reqBody    = [
                                  'misc',
                                [ 'value'     ],
                                [  nuPublicId ],
                                [  [ 'description',  imageId ]  ]
                           ];
                          
        // update the background id in the misc table, then set the upload status to success                  
        await Axios.put(    `${ serverURL }updateData`, 
                                reqBody, 
                              { withCredentials: true } 
                       );


        setUploadStatus('success'); 
        folder === 'background' && loadData('misc');
 
    } catch (error) {
 
        console.error(error);
        setUploadStatus('httpError');
 
    }
}




    return (<>


        
               < FileUploader
                   name={title}
                   state={image}
                   setter={setImage}
                   onClick={() => setUploadStatus(null)}
                   error={imageError}
                   instructions='Make it a .jpeg formatted photo, please.'
                   noHelp={true}
               />
               
           
        
               {       uploadStatus === 'uploading' ? <Notification type='wait' msg='Uploading background. This might take a minute...' />
                   :   uploadStatus === 'error'     ? <Notification type='bad'  msg='The background needs to be .jpeg formatted.' />
                   :   uploadStatus === 'httpError' ? <Notification type='bad'  msg='Looks like there was a network error. Try refreshing the page and reattempting.' />
                   :   uploadStatus === 'uploaded'  ? <Notification type='wait' msg='Image successfully uploaded. Nowe we just need to catologue it in your database...' />
                   :   uploadStatus === 'success'   ? <Notification type='good' msg='New background successfully added to database!' />
                   :                                  null
               }
        
        
               <button className='formButton' type='button' onClick={uploadBackground}>Upload</button>
        

    </>)
}