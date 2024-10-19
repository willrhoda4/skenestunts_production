

















// App.js
import                                   './App.css';

import { useCallback,
         useState, 
         useRef, 
         lazy,    
         Suspense     }             from 'react';
import { Route,             
         Routes,              
         useLocation  }             from 'react-router-dom';
import { Helmet       }             from 'react-helmet';

import   Axios                      from 'axios';

import   Info                       from './pages/Info';
import   Header                     from './components/Header';
import   NavBar                     from './components/NavBar';
import   Loader                     from './components/Loader';
import   ErrorBoundary              from './components/ErrorBoundary';
import   Picture                    from './components/Picture';
import   performerOptions           from './components/performerOptions';
import   logo                       from './images/logo_footer.webp';
import   logoPng                    from './images/logo_footer.png';

// Importing custom hooks
import { usePreconnectOrigins     } from './hooks/usePreconnectOrigins';
import { useCheckConstructionMode } from './hooks/useCheckConstructionMode';
import { useFetchTeamData         } from './hooks/useFetchTeamData';
import { useLoadPosters           } from './hooks/useLoadPosters';
import { useScrollToTop           } from './hooks/useScrollToTop';
import { useFetchInstagramData    } from './hooks/useFetchInstagramData';
import { useSetLinks              } from './hooks/useSetLinks';
import { useSentrySetup           } from './hooks/useSentrySetup';


const    Contact =                  lazy(() => import('./pages/Contact.js'            ));
const    Gallery =                  lazy(() => import('./pages/Gallery.js'            ));
const    Team =                     lazy(() => import('./pages/Team.js'               ));
const    Reels =                    lazy(() => import('./pages/Reels.js'              ));
const    Media =                    lazy(() => import('./pages/Media.js'              ));
const    Admin =                    lazy(() => import('./pages/Admin.js'              ));
const    UpdatePerformer =          lazy(() => import('./pages/UpdatePerformer.js'    ));
const    Fallback =                 lazy(() => import('./components/Fallback.js'      ));
const    PasswordReset =            lazy(() => import('./components/PasswordReset.js' ));



// top-level component for the whole show.
export default function App() {


const [ constructionMode,   setConstructionMode ] =   useState(false);
const [ photoData,          setPhotoData        ] =   useState([]);
const [ instaToken,         setInstaToken       ] =   useState(null);
const [ editing,            setEditing          ] =   useState('posters');
const [ links,              setLinks            ] =   useState([]);
const [ performerClass,     setPerformerClass   ] =   useState('D');
const [ adminStatus,        setAdminStatus      ] =   useState(false);
const [ boardPosters,       setBoardPosters     ] =   useState(false);
const [ teamPosters,        setTeamPosters      ] =   useState(false);
const [ boardData,          setBoardData        ] =   useState(false);
const [ teamData,           setTeamData         ] =   useState(false);
const   mainRef                                   =   useRef(null);
const   faqRef                                    =   useRef(null);
const   location                                  =   useLocation();
const   posters                                   = [ boardPosters, teamPosters ];



const getData = useCallback( async (reqBody, headers) => {
    

    try           { return await Axios.post(    `${process.env.REACT_APP_API_URL}getData`, 
                                                reqBody, 
                                                headers ? { headers: headers } : {}

                                           ); 
                  } 
    catch (error) { return await Promise.reject(error);                                          }

}, []);




// Use custom hooks
useSentrySetup();

usePreconnectOrigins();

useCheckConstructionMode(getData, setConstructionMode);

useFetchTeamData(getData, setBoardData, setTeamData);

useLoadPosters(boardData, boardPosters, setBoardPosters, teamData, teamPosters, setTeamPosters);

useScrollToTop(location, mainRef);

useFetchInstagramData(getData, instaToken, setInstaToken, setPhotoData);

useSetLinks(location, adminStatus, setLinks);



const closedForConstruction =   constructionMode 
                            &&  location.pathname !== '/director' 
                            &&  location.pathname !== '/passwordReset';

return (
    <>
        <Helmet>
            <title>Skene Stunts</title>
            <meta name="description" content="Skene Stunts has been delivering excellence to the Canadian film and commercial industry for over 35 years." />
            <link rel="canonical" href="https://www.skenestunts.com/" />
        </Helmet>
        
        <ErrorBoundary>
            { closedForConstruction ? <Fallback type={'construction'} />
                                    : <div id="App">

                                            { location.pathname !== '/director' && <Header getData={getData} /> }

                                            <NavBar 
                                                links={links} 
                                                editing={editing} 
                                                setEditing={setEditing} 
                                                adminStatus={adminStatus} 
                                            />
                                            
                                            <div id="main" ref={mainRef}>
                                                <Suspense fallback={<Loader />}>
                                                    <Routes>
                                                        <Route path='/'                element={<Info              photoData={photoData} 
                                                                                                                    faqRef={faqRef} 
                                                                                                                    getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='/info'            element={<Info              photoData={photoData} 
                                                                                                                    faqRef={faqRef} 
                                                                                                                    getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='/contact'         element={<Contact           performerOptions={performerOptions()} 
                                                                                                                    performerClass={performerClass} 
                                                                                                                    setPerformerClass={setPerformerClass} 
                                                                                                                    getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='/gallery'         element={<Gallery           photoData={photoData} 
                                                                                                                    /> } />
                                                        <Route path='/reels'           element={<Reels             getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='/media'           element={<Media             getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='/team'            element={<Team              boardData={boardData} 
                                                                                                                    boardPosters={boardPosters} 
                                                                                                                    teamData={teamData} 
                                                                                                                    teamPosters={teamPosters} 
                                                                                                                    /> } />
                                                        <Route path='/updatePerformer' element={<UpdatePerformer   performerOptions={performerOptions()} 
                                                                                                                    performerClass={performerClass} 
                                                                                                                    setPerformerClass={setPerformerClass} 
                                                                                                                    getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='passwordReset'    element={<PasswordReset     getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='/director'        element={<Admin             performerOptions={performerOptions()} 
                                                                                                                    editing={editing} 
                                                                                                                    posters={posters} 
                                                                                                                    setEditing={setEditing} 
                                                                                                                    adminStatus={adminStatus} 
                                                                                                                    setAdminStatus={setAdminStatus} 
                                                                                                                    getData={getData} 
                                                                                                                    /> } />
                                                        <Route path='*'                element={<Fallback          type={'404'} 
                                                                                                                    /> } />
                                                    </Routes>
                                                </Suspense>
                                            </div>

                                            { location.pathname !== '/director' && <div id='footer'>
                                                                                        <Picture
                                                                                            id='footerLogo'
                                                                                            alt='Skene Stunts company logo'
                                                                                            src={logo}
                                                                                            type='image/webp'
                                                                                            fallback={logoPng}
                                                                                        />
                                                                                    </div>
                                                                                }
                                        </div>
            }
        </ErrorBoundary>
    </>
);
}


