









import                   './Gallery.css';

import { useState } from 'react';

import { Helmet   } from 'react-helmet';

import   gramIcon   from '../images/icon_instagram2.png';
import   Loader     from '../components/Loader.js';






function Gallery({photoData}) {


  // state variable is leveraged to coordinate the spectacular hover effect for the Instagram icon.
  const [hoverGram, setHoverGram] = useState(false);
  
  return (

    <>

        <Helmet>
          <title>Skene Stunts - Gallery </title>
          <meta name="description" content="Come check out some pictures of projects we've been working on and things we've been up to lately." />
          <link rel="canonical"    href="https://www.skenestunts.com/gallery" />
        </Helmet>
    


        <div id='gallery' className='page'>
            { photoData.length === 0  ? <Loader />
                                      : <div id='galleryGrid'>  
                                      {/*  display the first 30 images from the database. */}
                                          {photoData.slice(0,30).map((image, index) =>  
                                                                              <a key={index}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                href='https://www.instagram.com/skenestunts/'
                                                                              >
                                                                                {/* 
                                                                                    images swell on hover and perform a 
                                                                                    staggered fade-in animation on page load.
                                                                                */}
                                                                                <img  
                                                                                    className='galleryImage'
                                                                                    alt='imported from Instagram' 
                                                                                    style={{ animationDelay: index * .25+'s' }}
                                                                                    src={image.media_url} 
                                                                                />
                                                                              </a>
                                                                          
                                                      )}
                                        </div>
                                      
            }
            <a id='galleryGramPlug' 
              onMouseOver={  () => setHoverGram(true)  } 
              onMouseLeave={ () => setHoverGram(false) }
              target="_blank"
              rel="noreferrer"
              href='https://www.instagram.com/skenestunts/'
            >
              <p id='galleryGramCaption'
                className={hoverGram ? 'glowGram' : undefined } >Stay current with Skene Stunts photo content<br/>by following us on Instagram.</p>  
              <img  id='galleryGramIcon' 
                    className={hoverGram ? 'spunGram' : undefined } 
                    alt='instagram icon' 
                    src={gramIcon}
              />
            </a>
        </div>
    </>
  );
}

export default Gallery;

