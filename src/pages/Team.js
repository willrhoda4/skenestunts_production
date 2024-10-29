






import                        './Team.css';

import   useFontWrangler from '../hooks/useFontWrangler';
import { Helmet }        from 'react-helmet';
   
import   Picture         from '../components/Picture';
import   CloudImage      from '../components/CloudImage';
   
import   imdbIcon        from '../images/imdb_icon.png';
import   iconChevron     from '../images/icon_chevronsRight.svg'
import   logo            from '../images/logo_background.webp';
import   logoPng         from '../images/logo_background.png';
import   Loader          from '../components/Loader';
   



export default function Team({teamData, teamPosters, boardData, boardPosters}) {


  // generate arrays of IDs based on the boardData length
  const blurbIds     = boardData && boardData.map( (_, index) => `blurb${index}`           );
  const attributeIds = boardData && boardData.map( (_, index) => `boardAttributes${index}` );

  // // use the hook to wrangle font sizes
  // useFontWrangler( { ids: blurbIds                         } );
  // // useFontWrangler( { ids: [ 'teamName' ]                   } );
  // useFontWrangler( { ids: attributeIds, childSelector: 'p' } );


  // generates board member profiles
  function makeBoardProfile (double, index) {



    // use the custom hook to adjust font sizes for the board member blurb and attributes
    

    const {  profile,
             title,
             image_id,
             image_alt,
             attribute_1,
             attribute_2,
             attribute_3,
             no_posters,
             imdb_id,
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
            
                <CloudImage id={image_id} alt={image_alt} wrapClass='boardImage' />

            <div className='boardContentTopRight'>

              <div className='boardContentTopRightTop'>

                <div className='boardNameTitle'>
                    
                  <div className='boardNameWrapper'>
                    <h2 className='boardName' >{legal_name}</h2>
                  </div>
                
                  <h3 style={{fontSize: '2em', zIndex: '99'}}>{title}</h3>
                
                </div>

                <a     
                        key={index}
                     target="_blank"
                        rel="noreferrer"
                       href={'https://www.imdb.com/name/'+imdb_id+'/'}
                  className='profileIcon'
                >
                      <img className='imdbIcon' alt='IMDB logo' src={imdbIcon} style={{zIndex: '99'}}/>
                </a>


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
              no_posters,
              image_id,
              image_alt,
              imdb_id,
              legal_name, } = double;

             
    return (

      <div className='teamProfile' >         

        <div className='teamContentTop'>

            <CloudImage id={image_id} alt={image_alt} className='teamImage'  />
            
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

