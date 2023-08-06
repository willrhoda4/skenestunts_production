






import                        './Media.css';
import {  useEffect,  
          useState    }  from 'react';
import {  Helmet      }  from 'react-helmet';
  
import    logo           from '../images/logo.webpo';
import    logoPNG        from '../images/logo.png';
import    Loader         from '../components/Loader.js';
import    Picture        from '../components/Picture.js'





export default function Media({getData}) {



    const [ mediaData, setMediaData ] = useState([]);


    // loads media data from the database and stores it in component state for rendering.
    useEffect(() => {

      getData(['media', null, { orderBy: 'rank'}]  )
        .then(  res =>  setMediaData(res.data)     )
        .catch( err =>  console.log(err)           );

    }, [getData])



    // generates a media story component.
    function makeStory (headline, date, outlet, url, image, alt, key) {

        return (
            <a key={key} 
               target="_blank"
               rel="noreferrer"
               href={url}>
                <div className='story'>
                    <div className='dateOutlet'>
                        <p style={{fontSize: '1.25em'}}>{date.slice(0,10)}</p>
                        <p><b>{outlet}</b></p>
                    </div>
                    { image !== 'logo' ? <img className='storyImage'      alt={alt}               src={image} />
                                       :  <Picture
                                                   src={logo}
                                              fallback={logoPNG}
                                             className={'storyImage logo'}
                                                  type='image/webp'
                                                   alt='Skene Stunts company logo'
                                                    id='footerLogo'
                                          />
                    }
                    {/* headlines are capitalized for consistency. */}
                    <h3 className='storyHeadline'>{headline.toUpperCase()}</h3>
                </div>
            </a>
        )
    }


  return (

    <>

        <Helmet>
          <title>Skene Stunts - Media </title>
          <meta name="description" content="We've been fortunate enough to have some good stories written about us over the years. Here's a few." />
          <link rel="canonical"    href="https://www.skenestunts.com/media" />
        </Helmet>


        <div id='media' className='page'>
            { mediaData.length === 0  ? <Loader />
                                      : <div id='mediaGrid'>
                                            {mediaData.map(story => makeStory( story.headline,
                                                                              story.date,
                                                                              story.outlet,
                                                                              story.article_url,
                                                                              story.image_url,
                                                                              story.image_description,
                                                                              story.article_id
                                                                            ))}
                                        </div>
            }

        </div>
    
    </>
  );
}

