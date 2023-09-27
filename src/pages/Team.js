






import                     './Team.css';

import { useEffect }  from 'react';

import { Helmet }     from 'react-helmet';

import   Picture      from '../components/Picture';

import   imdbIcon     from '../images/imdb_icon.png';
import   iconChevron  from '../images/icon_chevronsRight.svg'
import   logo         from '../images/logo_background.webp';
import   logoPng      from '../images/logo_background.png';
import   Loader       from '../components/Loader';




export default function Team({teamData, teamPosters, boardData, boardPosters}) {





  // manages font sizes for board bios and attributes
  useEffect(() => {



      // Adjusts the font size of the text in the board member profiles
      function wrangleFonts() {                              
      
      
        // if the board data hasn't loaded yet, don't do anything
        if (!boardData) { return; }
        
        
        // Accepts css selectors for the text and wrapper elements,
        // adjusts the font size of the text element to fit the wrapper element
        // childSelector is an optional parameter that allows the font size of 
        // the text element's designated children to be adjusted, instead of the text element itself.
        // initialSize is the starting font size in px
        // and it also sets the constant size for small screens.
        // maxIterations is the number of tries the function gets.
        function adjustFontSize(  textDivId, 
                                  wrapperId, 
                                  childSelector,
                                  initialSize = 16,
                                  maxIterations = 15) {                  
      
      
          // get the text and container elements
          const container     = document.querySelector(wrapperId);
          const text          = document.querySelector(textDivId);
          const childElements = text.querySelectorAll(childSelector); 
      
          // Make sure the text and container elements exist before proceeding.
          if (!(container && text))       { return; }
      
      
       
          // for small screens, set the font size to the initial size and return
          if ( window.innerWidth < 1000 ) {                       
        
            if (!childSelector)   { text.style.fontSize = initialSize+'px'; }
      
            else                  { for (const child of childElements) { child.style.fontSize = initialSize+'px'; } }
      
            return;
        
          }
      
      
      
          // set the initial font size
          text.style.fontSize = initialSize+'px';
      
          // declare variables for the loop
          let iterations      = 0;
          let size            = initialSize;
      
          // loop until the text is just right or the max iterations is reached
          while ( iterations  <  maxIterations ) {                     
              
      
            // calculate the area of the text and container elements
            const containerHeight = container.offsetHeight;
            const containerWidth  = container.offsetWidth;
            const containerArea   = containerHeight * containerWidth;
      
            const textHeight      = text.scrollHeight;
            const textWidth       = text.scrollWidth;
            const textArea        = textHeight * textWidth;
      
            // assess how well the text fits in the container
            const tooBig          = containerArea/textArea > 1.2;     // if the container is 20% bigger than the text, it's too big
            const tooSmall        = containerArea/textArea < 1;       // if the container is smaller than the text, it's too small
            const justRight       = !tooBig && !tooSmall;             // right in the goldilocks pocket
      
            // if the text is just right, break out of the loop
            // else, increment the iterations and continue the loop
            if (justRight)        { break;        }   
            else                  { iterations++; }
        
            // adjust the font size up or down depending on the problem
            tooBig ?  size += 1 
                   :  size -= 1;
      
            const  newSize        =  size +  'px';
      
      
            // adjust the font size of the text element
            // if there is no child selector, adjust the text element
            // else, adjust the font size of the text element's designated children
            if (!childSelector)   { text.style.fontSize = newSize; }
      
            else                  { for (const child of childElements) { child.style.fontSize = newSize; } }
          }
        }
      
      
        // Adjust the font sizes of the board member profiles
        for (let i = 0; i < boardData.length; i++) {     
          adjustFontSize( '#blurb'+i,           '#blurbWrapper'+i ,         undefined, 20);
          adjustFontSize( '#boardAttributes'+i, '#boardAttributeWrapper'+i, 'p',       20);
        }
      }

      document.addEventListener('DOMContentLoaded', wrangleFonts());

      // Add an event listener for window resize
      window.addEventListener('resize', wrangleFonts);

      // Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', wrangleFonts);
      };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardData]);





  // generates board member profiles
  function makeBoardProfile (double, index) {

    const {  profile,
             title,
             uploaded_image,
             image_id,
             attribute_1,
             attribute_2,
             attribute_3,
             no_posters,
             imdb_id,
             image_alt,
             image_url,
             legal_name, } = double;


    // generates the attribute list for each  profile
    function attributes () {

      // const    attrArray = [attribute_1, attribute_2, attribute_3];

      function attributeLs (attribute) {

        return <li className={`boardAttribute`}>
                  <img alt='chevron bullet point' src={iconChevron} />
                  <p style={{zIndex: '1'}}>{attribute}</p>
               </li>
      }

      return (  <div  id={`boardAttributeWrapper${index}`} className='boardAttributeWrapper'>
                  <ul id={`boardAttributes${index}`}       className='boardAttributes'>
                    {/* { attrArray.map( (attribute, key) => { return <div key={key}>{attrLs(attribute, key)}</div> } ) } */}
                    { attributeLs(attribute_1) }
                    { attributeLs(attribute_2) }
                    { attributeLs(attribute_3) }
                  </ul>
                </div>
             )
    }



    return (

      <div className='boardProfile' >    


       
            { boardPosters && !no_posters ?   <div className='boardPosterRack'>
                                                {boardPosters[index].slice(0,5).map(poster => poster)} 
                                              </div>

                                          :   <div className='boardRackSubstitute' />
            }


        <div className='boardContent'>
            


            <img className='boardImage'
                        alt={  image_alt } 
                        src={ !uploaded_image ? image_url 
                                              : 'https://drive.google.com/uc?export=view&id=' + image_id
                            } 
            />



            <div className='boardContentTopRight'>

              <div className='boardContentTopRightTop'>

                <div className='boardNameLevel'>
                    <h2 style={{fontFamily: 'BigShoulders', zIndex: '1' }}>{legal_name}</h2>
                    <a      key={index}
                        target="_blank"
                            rel="noreferrer"
                          href={'https://www.imdb.com/name/'+imdb_id+'/'}
                    >
                        <img className='imdbIcon' alt='IMDB logo' src={imdbIcon} style={{zIndex: '99'}}/>
                    </a>
                </div>
                
                <h3 style={{fontSize: '2em', zIndex: '99'}}>{title}</h3>

              </div>

              { attributes() }

            </div>

          
          <div id={`blurbWrapper${index}`}  className='boardProfileBlurbWrapper' >
            <p id={`blurb${index}`}         className='boardProfileBlurb' >{profile}</p>
          </div>



         {/* stripes and logo are absolutely-positoned background elements */}
         <div className='boardProfileStripes' />

          <Picture
                    src={logo}
              fallback={logoPng}
                  type='image/webp'
                    alt='Skene Stunts company logo'
              className='boardProfileLogo'
          />

        </div>




        { boardPosters && !no_posters ?   <div className='boardPosterRack'>
                                                {boardPosters[index].slice(5,10).map(poster => poster)} 
                                              </div>

                                          :   <div className='boardRackSubstitute' />
        }

      </div>
    )
  }


  // generates team member profiles
  function makeTeamProfile (double, index) {

    // variables for each team member from the database
    const {   
              title,
              uploaded_image,
              no_posters,
              image_id,
              imdb_id,
              image_alt,
              image_url,
              legal_name, } = double;

             
    return (

      <div className='teamProfile' >         

        <div className='teamContentTop'>

                <img className='teamImage' 
                           alt={image_alt} 
                           src={ !uploaded_image ? image_url 
                                                 : 'https://drive.google.com/uc?export=view&id='+image_id }  
                />
            
            <div className='teamContentRight'>
                <h2 className='teamName'>{legal_name}</h2>
                <div className='teamTitleLevel'>
                    <p>{title}</p>


                    <a     key={index}
                        target="_blank"
                          rel="noreferrer"
                          href={'https://www.imdb.com/name/'+imdb_id+'/'}
                    >
                        <img className='imdbIcon' alt='IMDB logo' src={imdbIcon} />
                    </a>

                  
                </div>
            </div>
        </div>

        <div className='teamPosterRack'>                      {/* sliced here to ditch team_id at the last index, which is there for the profile component */}
            { teamPosters && !no_posters && teamPosters[index].slice(0,5).map(poster => poster) }
        </div>

      </div>
    
    )
  }

  
  return (<>

              <Helmet>
                <title>Skene Stunts - Team</title>
                <meta name="description" content="Meet the team of talented individuals that is the Skene Stunts family." />
                <link rel="canonical"    href="https://www.skenestunts.com/team" />
              </Helmet>


              { !(boardData && teamData)  ?   <Loader />
                                          :   <>
                                                  {   boardData.filter(double => double.publish)
                                                               .map(  (double, index) => { return   <div key={double.imdb_id}>
                                                                                                      { makeBoardProfile( double, index ) }
                                                                                                    </div> 
                                                                                        } ) 
                                                  }
                                                      <div id='teamGrid'>
                                                        { teamData.filter(double => double.publish)
                                                                  .map(  (double, index) => { return  <div key={double.imdb_id}>
                                                                                                        { makeTeamProfile(  double, index ) }
                                                                                                      </div> 
                                                                                            } ) 
                                                        }
                                                      </div>         
                                              </> 
              }
          </>
  );
}

