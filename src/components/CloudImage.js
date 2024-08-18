




import { Cloudinary    } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';





// simple component to display a Cloudinary image
export default function CloudImage ( { id, className, alt } ) {


  const cld = new Cloudinary( { cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } } );
  const img = cld.image(id);

                                     // use full width and height of the parent container
  return <AdvancedImage cldImg={img} 
                           alt={alt}
                         style={ { width: '100%', height: '100%', objectFit: 'cover' } } 
         />

}
