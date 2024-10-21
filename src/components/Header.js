





import                       './Header.css';
import { useEffect, 
         useState }     from 'react';
import   Picture        from '../components/Picture.js';
import   CloudImage     from './CloudImage.js';

import   useSpotlight   from '../hooks/useSpotlight';

import   logo           from '../images/logo_header.webp';
import   logoPng        from '../images/logo_header.png';
import   flames         from '../images/flames.webp';
import   flamesGif      from '../images/flames.gif';





// header component that includes a spotlight effect and a dynamic background image.
// the spotlight effect is managed using the `useSpotlight` hook.
function Header({ getData }) {
    
    // state to track the background image ID, initialized with 'current_background'.
    const [ backgroundId, setBackgroundId ] = useState('current_background');

    // get the spotlight ref from the custom hook, adjusting for screen width.
    const   spotlightRef                    = useSpotlight({ size: 250, speed: 10, scale: 1, oneLight: window.innerWidth <= 1000 });


    // fetch the background image ID from the database when the component mounts.
    // this isn't strictly necessary, since all backgrounds now use the same public ID,
    // but we still run the hook since we keep the version number attached to the ID for cache busting.
    useEffect(() => {

        getData( [ 'misc', [ [ 'description', 'background' ] ] ] )
            .then( res  => setBackgroundId( res.data[0].value  ) )
            .catch( err => console.log( err )                    );
    
        }, [ getData ] );

    
    return (
    
        <div id="header" ref={spotlightRef}>
        
            {/* the background image is dynamically loaded based on the backgroundId */}
            <div id="headerBackground">
                <CloudImage id={backgroundId}  />
            </div>

            {/* title section with images and text */}
            <div id="title">
                <Picture
                    src={flames}
                    fallback={flamesGif}
                    type="image/webp"
                    alt="flames burning down"
                    id="flames"
                />
                <Picture
                    src={logo}
                    fallback={logoPng}
                    type="image/webp"
                    alt="Skene Stunts company logo"
                    id="headerLogo"
                />

                {/* conditionally render the slogan based on screen width */}
                <div id="slogan">
                    {window.innerWidth > 600 ? (
                        <p className="with-bullets">
                            <span>coordinators</span>
                            <span>performers</span>
                            <span>second unit directors</span>
                        </p>
                    ) : (
                        <>
                            <p className="with-bullets">
                                <span>coordinators</span>
                                <span>performers</span>
                            </p>
                            <p>second unit directors</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;




