




import { Cloudinary    } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';





// simple component to display a Cloudinary image
// if no className is provided, set default styles for the image to fill the container
// if a wrapClass is provided, wrap the image in a div with that class
export default function CloudImage ( { id, alt, wrapClass, className} ) {


  const cloud   = new Cloudinary( { cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } } );
  const image   = cloud.image(id);
                                                    // vvvvvif no className is provided, set default styles for the image to fill the container
  const element = <AdvancedImage cldImg={ image } 
                                  alt={ alt }
                                  style={ className ? {} : { width: '100%', height: '100%', objectFit: 'cover' } } 
                                  className={ className } 
                  />

  // if a wrapClass is provided, wrap the image in a div with that class.
  // if no wrapClass is provided, return the image as is.
  return wrapClass ? <div className={wrapClass}>{element}</div> : element;

}
