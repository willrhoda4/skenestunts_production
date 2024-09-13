




import { Cloudinary    } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';





// simple component to display a Cloudinary image
export default function CloudImage ( { id, alt, wrapClass, className} ) {


  const cld = new Cloudinary( { cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } } );
  const img = cld.image(id);

  // if no className is provided, set default styles for the image to fill the container
  return <div className={wrapClass}> 
            <AdvancedImage cldImg={img} 
                              alt={alt}
                              style={className ? {} : { width: '100%', height: '100%', objectFit: 'cover' }} 
                              className={className}
            />
          </div>
}
