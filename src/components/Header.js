







import                       './Header.css';
import { useEffect, 
         useState }     from 'react';

import   Picture        from '../components/Picture.js';

import   logo           from '../images/logo_header.webp'
import   logoPng        from '../images/logo_header.png'


import   flames         from '../images/flames.webp';
import   flamesGif      from '../images/flames.gif';



// this component is the hero header for the forward-facing site.
// we don't bother displaying it for Director's Chair.
function Header({getData}) {

        console.log('header api url => ',process.env.REACT_APP_API_URL);


    const [ backgroundId,   setBackgroundId ] = useState(null);
    const [ titleMargin,    setTitleMargin  ] = useState(null);

    // const   backgroundUrl                     = `https://drive.google.com/uc?export=view&id=13Wj_MmZhZqMqn198eP89v56ReUXAu9Gp`;
    const   backgroundUrl                     = `https://drive.google.com/uc?export=view&id=${backgroundId}`;



    // on initial render,
    // this effect gets the background image id from the database,
    // and sets it as the backgroundId state.
    // this hurts performance (slows largest contentful paint by 430ms according to lighthouse), 
    // but it's the cost of making the background image dynamic.
    // I've tried to compensate by dropping the title div asap and fading the background in after.
    useEffect(() => {

        getData(['misc', [['description', 'background']]]    )
          .then(  res => setBackgroundId(res.data[0].value)  )
         .catch(  err => console.log(err)                    );

    }, [getData])

   
   useEffect(() => {

        const setWidth = () => setTitleMargin( ( ( (window.innerWidth - 400) / 1200 ) * 27.5 ) + 5 );

        window.addEventListener('resize', setWidth);
        setWidth();

        return () => window.removeEventListener('resize', setWidth);


   }, [])
                           
  

    // this effect contriols the spotlight animation.
    // it's a little complicated, so I'll explain it in detail.
    useEffect(() => { 
        
        
        //      elementId:  string.  the css id of the element to be spotlighted.
        //      size:       integer. the size of the spotlight.       
        //      speed:      integer. the speed of the spotlight.
        //      scale:      integer. the speed the spotlight will scale. (the scaling range is fixed)
        //      oneLight:   boolean. if true, only one spotlight will be created.
        //      size2:      the optional size of the second spotlight.  (defaults to first value if null)
        //      speed2:     the optional speed of the second spotlight. (defaults to first value if null)
        //      scale2:     the optional scale of the second spotlight. (defaults to first value if null)
        function doubleSpotlight (elementId, size, speed, scale, oneLight, size2, speed2, scale2) {

            
            // this function creates a div that fills its parent element.
            function fullSizedDiv () {

                let div = document.createElement('div');
                    div.style.width  = '100%';
                    div.style.height = '100%';

                return div;
            }

            // start by creating three such divs.
            // the first two will be territories for the lights.
            // the third will be the container for the territories.
            const leftLight   =  fullSizedDiv();
            const rightLight  =  fullSizedDiv();
            const litArea     =  fullSizedDiv();

                // litArea should be absolute, to overlap the background image,
                // and flex, to accommodate the lights properly.
                litArea.style.position  = 'absolute';
                litArea.style.display   = 'flex';
                  
                // in any case, we want at least one light in the litArea.
                litArea.appendChild(leftLight);

                // and unless oneLight is declared, we actually want two.
                !oneLight && litArea.appendChild(rightLight);
        
            // now we can prepend the litArea to the parent element.
            document.getElementById(elementId).prepend(litArea);
    
    

            // next we can set the initial values for the lights.


            // use offsetWidth and offsetHeight to get the size of the first light area.
            // use the size prop to set the anchor size for the first light.
            // this is the size the light will keep coming back to.
            const leftWidth   =  leftLight.offsetWidth;
            const leftHeight  =  leftLight.offsetHeight;
            const leftAnchor  =  size;
    
            // these next variables are used to track the current position and size of the first light.
            // start by initiating the light at the center of its territory.
            // the initial size will be the anchor size.
            let   leftX       =  leftWidth /2;
            let   leftY       =  leftHeight/2;
            let   leftSize    =  leftAnchor;

            // the scale and speed variables keep the light scaling and moving at a steady pace,
            // and they also tell it which way to move and scale.
            let   leftScale   =  scale
            let   leftSpeedX  =  speed * -1; 
            let   leftSpeedY  =  speed * -1; 
    


            // if we're using two lights, we need to give the right light the same treatment,
            // but we gotta check if the optional props were passed in.
            // if they weren't, we'll just use the first values.
            // we'll also start the lights scaling and moving in opposite directions, to prevent them from mirroring each other.
            const rightWidth  =  rightLight.offsetWidth;
            const rightHeight =  rightLight.offsetHeight;
            const rightAnchor =  size2 ? size2 : size;
    

            let   rightX      =  rightWidth /2;
            let   rightY      =  rightHeight/2;
            let   rightSize   =  rightAnchor;


            let   rightScale  =  scale2  ? scale2 * -1  : scale * -1;
            let   rightSpeedX =  speed2  ? speed2       : speed;
            let   rightSpeedY =  speed2  ? speed2       : speed;
    
    
            // this function handles the animation loop.
            function moveLights () {
    

                // first we check if the lights have reached the edge of their territories,
                // and if they have, we reverse their direction.
                // note that we let the edges of the spotlight wander a little bit outside the window,
                // but we keep them further away from the border between territories,
                // as they can't cross that border, and it looks weird if they get too close.
                if ( leftX  >= leftWidth  - leftSize    || leftX  <= leftSize/2  ) { leftSpeedX  = leftSpeedX  * -1 };
                if ( leftY  >= leftHeight               || leftY  <= 0           ) { leftSpeedY  = leftSpeedY  * -1 };
                
                if ( rightX >= rightWidth - rightSize/2 || rightX <= rightSize   ) { rightSpeedX = rightSpeedX * -1 };
                if ( rightY >= rightHeight              || rightY <= 0           ) { rightSpeedY = rightSpeedY * -1 };
    

                // then we move the lights according to their speed.
                leftX  += leftSpeedX;
                leftY  += leftSpeedY;
                
                rightX += rightSpeedX;
                rightY += rightSpeedY;
    

                // then we check if the lights have reached their maximum or minimum size,
                // and if they have, we reverse their scaling.
                if ( leftSize  >= leftAnchor +50 || leftSize  <= leftAnchor -50 ) { leftScale  = leftScale  * -1 };
                if ( rightSize >= rightAnchor+50 || rightSize <= rightAnchor-50 ) { rightScale = rightScale * -1 };
    

                // then we scale the lights according to their scale.
                leftSize  += leftScale;
                rightSize += rightScale;
    

                // lastly, we update the lights' background gradients (which is how the whole show works).
                leftLight.style.background  = `radial-gradient(circle at ${leftX }px ${leftY }px, #00000000 10px, #000000ee ${leftSize }px)`;
                rightLight.style.background = `radial-gradient(circle at ${rightX}px ${rightY}px, #00000000 10px, #000000ee ${rightSize}px)`;
    
            }  
            // start the animation loop and keep it running,
            // at a rate of 30 frames per second.
            setInterval(moveLights, 33);
        }  

        // for screens less than 1000px wide, we only want one light.
        // otherwise, we want two.
        window.innerWidth <= 1000 ? doubleSpotlight( 'header', 250, 10, 1, true )
                                  : doubleSpotlight( 'header', 250, 10, 1, false);

    }, [])


  


    
    
    
    
    return (

        <div id='header' style={{backgroundImage: `url('${backgroundUrl}')`}}>   

{/* 
            {   backgroundId &&  <img    id='headerBackground'
                                        alt='collage of movie posters'
                                        src={backgroundUrl}
                                 />
            } */}


            <div id='title' style={{ margin: `0 ${titleMargin}vw`}}>      


                <Picture
                         src={flames}
                    fallback={flamesGif}
                        type='image/webp'
                         alt='flames burning down'
                          id='flames'
                />


                <Picture
                         src={logo}
                    fallback={logoPng}
                        type='image/webp'
                         alt='Skene Stunts company logo'
                          id='headerLogo'
                />


                <p id='slogan' >
                    {
                            window.innerWidth > 600     ?   <p className='with-bullets'>
                                                                <span>coordinators</span>
                                                                <span>performers</span> 
                                                                <span>second unit directors</span>
                                                            </p>

                                                        :   <>
                                                                <p className='with-bullets'>
                                                                    <span>coordinators</span>
                                                                    <span>performers</span> 
                                                                </p>
                                                                <p> second unit directors</p>
                                                            </>
                    }
                   
                </p>


            </div> 


        </div>
  );
}

export default Header;


       
