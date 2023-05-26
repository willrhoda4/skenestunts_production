






import                     './Team.css';

import { Helmet }     from 'react-helmet';

import   Picture      from '../components/Picture';

import   imdbIcon     from '../images/imdb_icon.png';
import   iconChevron  from '../images/icon_chevronsRight.svg'
import   logo         from '../images/logo_background.webp';
import   logoPng      from '../images/logo_background.png';
import   Loader       from '../components/Loader';



export default function Team({teamData, teamPosters, boardData, boardPosters}) {

  




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

      function attribute (attribute) {

        return <div className='boardAttribute'>
                  <img alt='chevron bullet point' src={iconChevron} />
                  <p style={{zIndex: '1'}}>{attribute}</p>
               </div>
      }

      return (  <ul className='boardAttributes'>
                  {attribute(attribute_1)}
                  {attribute(attribute_2)}
                  {attribute(attribute_3)}
                </ul>
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

              <div className='boardNameLevel'>
                  <h2 style={{fontFamily: 'BigShoulders', zIndex: '1'}}>{legal_name}</h2>
                  <a      key={index}
                       target="_blank"
                          rel="noreferrer"
                         href={'https://www.imdb.com/name/'+imdb_id+'/'}
                  >
                      <img className='imdbIcon' alt='IMDB logo' src={imdbIcon} />
                  </a>
              </div>
              
              <h3 style={{fontSize: '2em', zIndex: '99'}}>{title}</h3>

              { attributes() }
            </div>

          
          <p className='boardProfileBlurb' >{profile}</p>


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
                                                              .map(  (double, index) => { return   <div key={index}>
                                                                                                      { makeBoardProfile( double, index ) }
                                                                                                    </div> 
                                                                                        } ) 
                                                  }
                                                      <div id='teamGrid'>
                                                        { teamData.filter(double => double.publish)
                                                                  .map(  (double, index) => { return  <div key={index}>
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

