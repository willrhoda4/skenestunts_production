




  




const cloudinary = require('cloudinary').v2;
const axios      = require('axios');







const api_secret  =     process.env.CLOUDINARY_API_SECRET;
const api_key     =     process.env.CLOUDINARY_API_KEY;



// sends a bunch of parameters to the client, which are used to sign a request to Cloudinary.
// this is used to upload board member headshots straight from the admin dashboard.
function getSignature (request, response) {

     console.log('\nretrieving signature...\n');


// we'll first pass this parameter object to the api_sign_request method.
// then we'll bundle it with the api_key and signature, and send it as
// a response object for the client to use in their upload request.
const params     = {
                       public_id:    request.body[0],
                       asset_folder: request.body[1],
                       timestamp:    Math.round( ( new Date().getTime() / 1000 ) ),
                       overwrite:    true, 
                  }


const signature  = cloudinary.utils.api_sign_request( params, api_secret );


response.json({ api_key, signature, ...params });

}


async function fetchImage ( request, response ) {

     console.log('\nfetching image...\n');

     try {
               const { imageUrl } = request.body;
               const   image      = await axios.get(imageUrl, { responseType: 'arraybuffer' });
               const   buffer     = Buffer.from(image.data, 'binary');
               
               response.set('Content-Type', image.headers['content-type']);
               response.send(buffer);

     } catch (error) {

       console.error('Error fetching image:', error);
       response.status(500).send('Error fetching image');
     }
   };





module.exports = { getSignature, fetchImage };