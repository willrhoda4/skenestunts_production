






import Axios from 'axios';



// helper function to request a signature and upload an image to Cloudinary
export default async function cloudinaryUpload( newImage, id, assetFolder ) { 
    
    
    // prepare a few variables before the show
    const serverURL =  process.env.REACT_APP_API_URL;
    const cloudName =  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const cloudURL  = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const publicId  =  id.replaceAll(' ', '_').toLowerCase();


    try {
    
        // fetch the signature and other signed parameters from your server
        const sigRes   = await Axios.post( `${serverURL}signature`, [ publicId, assetFolder ] );
        const sigData  = sigRes.data;

        // prepare the form data for the upload
        const formData = new FormData();
        
        // If newImage is a URL, fetch the image and convert it to a Blob
        if (typeof newImage === 'string') {
                                            const proxyResponse = await Axios.post( `${ serverURL }fetchImage`, 
                                                                                      { imageUrl: newImage   }, 
                                                                                      { responseType: 'blob' }
                                            
                                                                                    );
                                            const imageBlob = proxyResponse.data;
                                            formData.append('file', imageBlob, 'image.jpg');
                                        
                                          } 
        // If newImage is a File object, append it directly
        else                              {
                                            formData.append('file', newImage);
                                          }
        
        // append the signature data to the form data
        for (const key in sigData) {        formData.append(  key, sigData[ key ] ); }
                                                            /**
                                                             * The signature data adds:
                                                             *  - public_id
                                                             *  - asset_folder
                                                             *  - timestamp
                                                             *  - overwrite
                                                             *  - api_key
                                                             *  - signature
                                                             */

        // upload the new image to Cloudinary
        const uploadResponse = await Axios.post(
                                                    cloudURL, 
                                                    formData, 
                                                  { headers: { 'Content-Type': 'multipart/form-data' } }
                                               );


        // return publicId prepended by version # for cache busting
        return `v${uploadResponse.data.version}/${publicId}`;


    } catch (error) {

        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}
