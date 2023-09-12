








import                            './App.css';    

import { useState, 
         useEffect,
         useCallback,
         useRef,
         lazy, 
         Suspense      }     from 'react';

import { Route,
         Routes, 
         useLocation   }     from 'react-router-dom';

import { Helmet        }     from 'react-helmet';

import   Axios               from 'axios';

import   Info                from './pages/Info';

import   Header              from './components/Header';
import   NavBar              from './components/NavBar';
import   Loader              from './components/Loader';
import   ErrorBoundary       from './components/ErrorBoundary';
import   Picture             from './components/Picture';
import   performerOptions    from './components/performerOptions';


import   logo                from './images/logo_footer.webp';
import   logoPng             from './images/logo_footer.png';



const Contact         = lazy(() => import('./pages/Contact.js'));
const Gallery         = lazy(() => import('./pages/Gallery.js'));
const Team            = lazy(() => import('./pages/Team.js'));
const Reels           = lazy(() => import('./pages/Reels.js'));
const Media           = lazy(() => import('./pages/Media.js'));
const Admin           = lazy(() => import('./pages/Admin.js'));
const UpdatePerformer = lazy(() => import('./pages/UpdatePerformer.js'));

const Fallback        = lazy(() => import('./components/Fallback.js'));
const PasswordReset   = lazy(() => import('./components/PasswordReset.js'));


export default function App() {

  
  const [  constructionMode, setConstructionMode ] = useState(false);
  
  const [  photoData,        setPhotoData        ] = useState([]);
  const [  instaToken,       setInstaToken       ] = useState(null);

  const [  editing,          setEditing          ] = useState('posters');
  const [  links,            setLinks            ] = useState([]);

  const [  performerClass,   setPerformerClass   ] = useState('D');
  const [  adminStatus,      setAdminStatus      ] = useState(false);
  
  const [  boardPosters,     setBoardPosters     ] = useState(false);
  const [  teamPosters,      setTeamPosters      ] = useState(false);
  const [  boardData,        setBoardData        ] = useState(false);
  const [  teamData,         setTeamData         ] = useState(false);

  const    posters = [ boardPosters, teamPosters ];

  const    mainRef                                 = useRef(null);
  const    faqRef                                  = useRef(null);

  const    location                                = useLocation();

  

  //api url for all requests to server.


  // all-terrain multipurpose highly functional trusty data fetcher.
  const getData = useCallback((reqBody) => {

   return Axios.post(`${process.env.REACT_APP_API_URL}getData`, reqBody);
    
  }, []);  


 
  // this hook handles preconnections to external domains to improve performance.
  useEffect(() => {

    const origins = [
                      'https://connect.facebook.net',
                      'https://drive.google.com',
                      'https://scontent.cdninstagram.com',
                      'https://www.gstatic.com',
                      'https://doc-0o-5c-docs.googleusercontent.com',
                      'https://fresnel.vimeocdn.com',
                      'https://player.vimeo.com'
                    ];
  
    origins.forEach( origin => {

      const link      =  document.createElement('link');
            link.rel  = 'preconnect';
            link.href =  origin;

      document.head.appendChild(link);

    });

  }, []);



  //checks if site is in construction mode on initial load.
  useEffect(() => {
    
    getData(['misc', [['description', 'construction_mode']]]).then(res => setConstructionMode(res.data[0].active));
    
  }, [getData])
  

  
  
  // gets team data on initial load. 
  // state lifted to pass poster data to Admin and avoid poster-loading bugs when handled by Team component.
  useEffect(() => {


    // columns for all team and board members
    const basicColumns =  [ 
      'legal_name',
      'title',
      'imdb_id',
      'uploaded_image',
      'image_url',
      'image_id',
      'image_alt',
      'no_posters',
      'poster_1',
      'poster_2',
      'poster_3',
      'poster_4',
      'poster_5',
      'publish',
    ]


    // additional columns just for board members
    const extraColumns = [ 
      'profile',
      'attribute_1',
      'attribute_2',
      'attribute_3',
      'poster_6',
      'poster_7',
      'poster_8',
      'poster_9',
      'poster_10',
    ]



    const teamColumns  = basicColumns.join(', ');
    const boardColumns = basicColumns.concat(extraColumns).join(', ');  




    getData(['board', [['publish', true]], { orderBy: 'rank', columns: boardColumns }]  )
      .then( res => setBoardData(res.data)                                              )
     .catch( err => console.log(err)                                                    );

    getData(['team',  [['publish', true]], { orderBy: 'rank', columns: teamColumns }]   )
      .then( res => setTeamData(res.data)                                               )
     .catch( err => console.log(err)                                                    );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  // creates arrays of arrays of poster image elements for profiles on team page.
  // waits until team data is in state before firing.  
  useEffect(() => {  


    function getPosters ( state, setter ) {  
      
        let teamPosters     = []
        let allPosters      = [];

        // sorts through team and board data and creates an array of arrays (teamPosters) with poster_id's for request.
        for ( let i = 0; i < state.length; i++ ) {  

          let double  = state[i];
          let posters = [];

          for ( let prop in double ) {
              prop.startsWith('poster_')  && posters.push(double[prop]);
          }
          
          teamPosters.push(posters);     
        }


        // creates an array of promises for requests.
        let promises = teamPosters.map( (posters, index) => {


            const boardMember = posters.length > 5;

            return Axios.post(`${process.env.REACT_APP_API_URL}getDoublesPosters`, ['posters', 'poster_id', posters])
                        .then( res => {        

                                            return res.data.map(poster => (
                                            <img
                                                      key={poster.poster_id}
                                                      src={poster.image_url}
                                                className={boardMember ? 'boardPoster' : 'teamPoster'}
                                                      alt={'movie poster for ' + poster.title}
                                            />

                                          )).concat([state[index].imdb_id]);
                                        }
                                )
                          .catch(err => console.log(err));
        });


        // uses Axios.all to wait for all promises to resolve before loading them into state.
        Axios.all(  promises  )
             .then( responses => {
                                    responses.forEach( posterArr => { allPosters = allPosters.concat([posterArr]); } );
                                    setter(allPosters);
                                 } 
                  )
            .catch( err => console.log(err) );
    }

    // functions only run once team data has been loaded and before poster data has been loaded
    boardData && !boardPosters && getPosters( boardData, setBoardPosters );
    teamData  && !teamPosters  && getPosters( teamData,  setTeamPosters  );

   
  }, [boardData, boardPosters, setBoardPosters, setTeamPosters, teamData, teamPosters, editing])





  //scrolls to top of page div whenever path changes, Info component heandles scrolling if FAQ is present.
  useEffect(() => { 
   
    const faq = new URLSearchParams(window.location.search).get('faq'); 

    const scrollToRef = (ref) => window.scroll(0, (ref.current.offsetTop - window.innerHeight*.1));

    if (!faq && location.pathname !== '/') { scrollToRef(mainRef); }

  }, [location])





  // grabs instagam data and refreshes long-lived token.
  // token needs to be refreshed every 60 days, or it will expire and become unrenewable.
  useEffect(() => {

    let gramGetter  = 'https://graph.instagram.com/me/media?fields=media_url&access_token='+instaToken;
    let tokenGetter = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&&access_token='+instaToken;


    // on initial render, get the current token from the database and store it in state.
    if (!instaToken) {  getData(['misc', [[ 'description', 'insta_token' ]]])
                          .then( res => { setInstaToken(res.data[0].value); })
                     }

    // once we have a token in state, use it to send a get request for our instagram data.
    // store the pictures in state, 
    // then send another get request to get a new token.
    else             {  Axios.get(gramGetter)
                             .then( res => {  setPhotoData(res.data.data); 
                                              return Axios.get(tokenGetter);
                                           }
                                  )
                                              // once we get our new token, put it in the database for the next user.
                                              // as long as the site has a visitor every 60 days, the token should stay current.
                             .then( res => {  const reqBody = [    'misc', 
                                                                [  'value'                        ], 
                                                                [   res.data.access_token         ], 
                                                                [ ['description', 'insta_token']  ]
                                                              ];                                               

                                              if (res.data.access_token.length > 0) { return Axios.put(`${process.env.REACT_APP_API_URL}updateData`, reqBody) }
                                            })
                     }
  }, [getData, instaToken])


  // toggles list of links for navbar based on adminStatus and current path.
  // [ forward-facing site, admin director's chair, team member's chair ]
  useEffect(() => {

      location.pathname !== '/director' ? setLinks([ 'info',    'contact',   'gallery',   'reels',    'media',    'team',                                 ])
    : adminStatus                       ? setLinks([ 'misc',    'info',      'reels',     'media',    'board',    'team',       'posters',   'performers' ])
    :                                     setLinks([ 'profile', 'posters',   'performers'                                                                 ]);      

  }, [adminStatus,location.pathname])



 



 


  return (<>

            <Helmet>
              <title>Skene Stunts</title>
              <meta name="description" content="Skene Stunts has been delivering excellence to the Canadian film and commercial industry for over 35 years." />
              <link rel="canonical"    href="https://www.skenestunts.com/" />
            </Helmet>

            { constructionMode                   &&
              location.pathname !== '/director'   ? <Fallback type={'construction'} /> 
                                                 
                                                  : <div id="App">

                                                        { location.pathname !== '/director' &&  <Header  getData={getData}  /> }
                                  
                                  
                                                        <NavBar links={links} editing={editing} setEditing={setEditing} adminStatus={adminStatus} />
                                  
                                  
                                                        <div id="main" ref={mainRef}>

                                                          <ErrorBoundary>

                                                            <Suspense fallback={ <Loader /> }>

                                                              <Routes>

                                                                <Route path='/'                element={<Info               photoData={photoData}
                                                                                                                            faqRef={faqRef}                             
                                                                                                                            getData={getData}                           />   } />  
                                                                
                                                                <Route path='/info'            element={<Info               photoData={photoData}
                                                                                                                            faqRef={faqRef}  
                                                                                                                            getData={getData}                           />   } />  
                                                                

                                                                <Route path='/contact'         element={<Contact            performerOptions={performerOptions()} 
                                                                                                                            performerClass={performerClass} 
                                                                                                                            setPerformerClass={setPerformerClass}
                                                                                                                            getData={getData}                           />   } /> 
                                                                
                                                                <Route path='/gallery'         element={<Gallery            photoData={photoData}                       />   } /> 
                                                                
                                                                <Route path='/reels'           element={<Reels              getData={getData}                           />   } /> 
                                                                
                                                                <Route path='/media'           element={<Media              getData={getData}                           />   } /> 
                                                                
                                                                <Route path='/team'            element={<Team               boardData={boardData}
                                                                                                                            boardPosters={boardPosters}
                                                                                                                            teamData={teamData}
                                                                                                                            teamPosters={teamPosters}                   />   } /> 
                                                                
                                                                <Route path='/updatePerformer' element={<UpdatePerformer    performerOptions={performerOptions()} 
                                                                                                                            performerClass={performerClass} 
                                                                                                                            setPerformerClass={setPerformerClass}       
                                                                                                                            getData={getData}                          />  } />
                                                                
                                                                <Route path='passwordReset'    element={<PasswordReset      getData={getData}                          />  } />
                                                                
                                                                <Route path='/director'        element={<Admin              performerOptions={performerOptions()} 
                                                                                                                            editing={editing} 
                                                                                                                            posters={posters}
                                                                                                                            setEditing={setEditing}  
                                                                                                                            adminStatus={adminStatus}
                                                                                                                            setAdminStatus={setAdminStatus}
                                                                                                                            getData={getData}                          />  } /> 

                                                                <Route path='*'                element={<Fallback           type={'404'}                                /> } /> 

                                                              </Routes>

                                                            </Suspense>

                                                          </ErrorBoundary>
                                  
                                                        </div>

                                  
                                                        { location.pathname !== '/director' &&  
                                                          <div id='footer'>
                                                            <Picture
                                                                     src={logo}
                                                                fallback={logoPng}
                                                                    type='image/webp'
                                                                     alt='Skene Stunts company logo'
                                                                      id='footerLogo'
                                                            />
                                                          </div>
                                                        }
                                  </div>     
            }
        </>);
}



