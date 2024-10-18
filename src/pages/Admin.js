






import   Axios             from 'axios';


import { useEffect, 
         useState   }      from 'react';
import { useAuth    }      from '../hooks/useAuth.js';

import { Helmet     }      from 'react-helmet';



import AdminView           from '../components/AdminTools/AdminView.js';
import AdminFormMedia      from '../components/AdminTools/AdminFormMedia.js';
import AdminFormReels      from '../components/AdminTools/AdminFormReels.js';
import AdminFormTeam       from '../components/AdminTools/AdminFormTeam.js';
import AdminFormPerformers from '../components/AdminTools/AdminFormPerformers.js';
import AdminFormInfo       from '../components/AdminTools/AdminFormInfo.js';
import AdminFormMisc       from '../components/AdminTools/AdminFormMisc.js';
import PosterBarn          from '../components/AdminTools/AdminPosterBarn.js';



import PasswordChecker     from '../components/PasswordChecker.js';
import Notification        from '../components/Notification.js';



import Media               from '../components/AdminTools/AdminContentMedia.js';
import Info                from '../components/AdminTools/AdminContentInfo.js';
import Reels               from '../components/AdminTools/AdminContentReels.js';
import Team                from '../components/AdminTools/AdminContentTeam.js';
import Posters             from '../components/AdminTools/AdminContentPosters.js';
import Performers          from '../components/AdminTools/AdminContentPerformers.js';
import Profile             from '../components/AdminTools/AdminContentProfile.js';
import Misc                from '../components/AdminTools/AdminContentMisc.js';



export default function Admin( { performerOptions, editing, adminStatus, setAdminStatus, posters, getData } ) {


 
  const   successfulReset                     = !!(new URLSearchParams(window.location.search).get('successfulReset') === 'true');


  const [ currentData,    setCurrentData    ] = useState([]);
  const [ authenticated,  setAuthenticated  ] = useState(false);
  const [ boardMember,    setBoardMember    ] = useState(false);

  // jwtStatus tells us if the token is valid, invalid, or expired
  // updateJwt is a passed to PasswordChecker as a handler
  const [ authRole,       setAuthRole       ] = useAuth();

  const   validAuthRole                       =  authRole === 'admin' 
                                              || authRole === 'board' 
                                              || authRole === 'team';

  // simple effect hook to clear adminStatus and boardMember states
  // if the authRole state is null. this revokes privileges anytime
  // our useAuth interceptor receives a 401 from the server.
  useEffect(() => {

    if ( authRole === null ) {

      setAdminStatus(false);
      setBoardMember(false);
    
    }

  }, [ authRole, setAdminStatus, setBoardMember ] );
 

  //loads data for editing 
  function loadData   ( table, orderBy='rank', filters, limit ) {

   
    // sets request body for getData request
    // note that the 'profile' table requires a team_id from an authenticated user
    // and the 'info' table requires a special hack to amalgamate the faq and quote data
    // and the 'posters' table needs to be ordered ascendingly in order satisfy alphabetic sensibilities.
    let profileTable = boardMember ? 'board' : 'team';

    console.log('profileTable:', profileTable);
    console.log('authenticated:', authenticated);
    let reqBody      = table === 'profile' ? [  profileTable,    [ [ 'team_id', authenticated.team_id ] ]                                       ]
                     : table === 'info'    ? [ 'faq',                 null,                                { orderBy: 'rank' }                  ] 
                     : table === 'posters' ? [  table,                null,                                { orderBy: [ 'title', true ] }       ] 
                     : table === 'misc'    ? [  table,                null                                                                      ]
                     :                       [  table,                filters,                             { orderBy: orderBy, limit: limit }   ];
 
    let quoteBody    =                        [ 'misc',          [ [ 'description', 'info_quote'      ] ]                                       ];
    let quoteByBody  =                        [ 'misc',          [ [ 'description', 'info_quote_by'   ] ]                                       ];





    // rounds up and amalgemates faq and quote data for the info page.
    // note that this hack is the reason why the AdminButtons component
    // makes special provisions for the info page.
      if (table === 'info')    {      Axios.all([  
                                                   getData(reqBody),
                                                   getData(quoteBody), 
                                                   getData(quoteByBody) 
                                                ]                                                 )
                                           .then( Axios.spread((...responses) => { 

                                                    const data    = responses[0].data;
                                                    const quote   = responses[1].data;
                                                    const quoteBy = responses[2].data;

                                                    setCurrentData([].concat( data,
                                                                              quote,
                                                                              quoteBy
                                                                            ));
                                                                                                }))
                                          .catch( errors => console.log(errors)                   );
                                   }
    else                           { getData(reqBody).then(  res => setCurrentData(res.data) )
                                                    .catch(  err =>  console.log(err)        );
                                   }                 
  }


  // reloads data on page change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadData(editing), [editing]);










    // logs user in after password resets if jwt is valid
    useEffect(() => {


      if ( successfulReset ) {

          Axios.get( `${process.env.REACT_APP_API_URL}loginTeam`, { withCredentials: true } )
              .then( response => {
                                    const { user, role } = response.data;

                                    console.log('successful login:', user, role);
                                    console.log('currentData:', currentData);
                    
                                    // Update the authenticated state
                                    setAuthenticated(user);
                                    setAuthRole(role);
                                    setBoardMember(role === 'admin' || role === 'board');
                                    setAdminStatus(role === 'admin');
                                 }
                   )
             .catch( err      => {
                                    console.log(err);
                                    setAuthenticated('dataError');
                                 }
                   );
      }

  }, [successfulReset, setAuthenticated, setBoardMember, setAdminStatus, setAuthRole] );
  







  // columns for all team and board members
  const teamColumns =  [ 
                        'legal_name',
                        'title',
                        'imdb_id',
                        'email',
                        'uploaded_image',
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


  const boardColumns   = teamColumns.concat(extraColumns);

  const profileColumns = authenticated && authenticated.hasOwnProperty('profile') ? boardColumns : teamColumns;   



  return (
  
    <>

      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      {    authenticated === 'expired'   ? <Notification type='bad' msg='Your token has expired. Try resetting your password again.' />
        :  authenticated === 'dataError' ? <Notification type='bad' msg='There was a database error. Try resetting your password again.' />
        : !authenticated                 ? <PasswordChecker      table={  'board'            }
                                                               pwTable={  'board_passwords'  }
                                                                    fk={  'team_id'          }
                                                            dataSetter={   setAuthenticated  }
                                                           setAuthRole={   setAuthRole       }
                                                        setBoardMember={   setBoardMember    }
                                                        setAdminStatus={   setAdminStatus    }
                                           />
                                         
        :  validAuthRole                 ? <>
            
                              {   editing === 'misc'        ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                             setCurrentData={setCurrentData}
                                                                                      table={editing}
                                                                                  AdminForm={AdminFormMisc}
                                                                                  Generator={Misc}
                                                              />  
                              
                              :   editing === 'posters'     ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                             setCurrentData={setCurrentData}
                                                                                      table={editing}
                                                                                     pkName='poster_id'
                                                                                  AdminForm={PosterBarn}
                                                                                  Generator={Posters}
                                                                                    columns={[ 'title', 'imdb_id', 'cloudinary_id' ]}
                                                                                    getData={getData}
                                                              />  
                              
                                : editing === 'media'       ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                     pkName='article_id'
                                                                                  AdminForm={AdminFormMedia}
                                                                                  Generator={Media}
                                                                                    columns={[ 'headline', 'date', 'outlet', 'article_url', 'image_description' ]}
                                                              />

                                : editing === 'info'        ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                     pkName='faq_id'
                                                                                  AdminForm={AdminFormInfo}
                                                                                  Generator={Info}
                                                                                    columns={[ 'question', 'answer', 'css_id' ]}
                                                              />

                                : editing === 'reels'       ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                     pkName='reel_id'
                                                                                  AdminForm={AdminFormReels}
                                                                                  Generator={Reels}
                                                                                    columns={[ 'title', 'caption', 'embed_code' ]}
                                                              />

                                : editing === 'board'      ? <AdminView            loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                    posters={posters}
                                                                                     pkName='team_id'
                                                                                  AdminForm={AdminFormTeam}
                                                                                  Generator={Team}
                                                                                adminStatus={adminStatus}
                                                                                    columns={boardColumns}
                                                              />
                                 
                                : editing === 'team'       ? <AdminView            loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                    posters={posters}
                                                                                     pkName='team_id'
                                                                                  AdminForm={AdminFormTeam}
                                                                                  Generator={Team}
                                                                                adminStatus={adminStatus}
                                                                                    columns={teamColumns}
                                                              />

                                : editing === 'performers'  ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                             setCurrentData={setCurrentData}
                                                                                      table={editing}
                                                                                     pkName='performer_id'
                                                                                  AdminForm={AdminFormPerformers}
                                                                                adminStatus={adminStatus}
                                                                                boardMember={boardMember}
                                                                                  Generator={Performers}
                                                                           performerOptions={performerOptions}
                                                                                    columns={performerOptions.columns}
                                                              />

                                : editing === 'profile'     ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                             setCurrentData={setCurrentData}
                                                                                      table={editing}
                                                                                    posters={posters}
                                                                                     pkName='team_id'
                                                                                  AdminForm={AdminFormTeam}
                                                                                  Generator={Profile}
                                                                                    columns={profileColumns}
                                                                                     update={ currentData[0].hasOwnProperty('email')        &&
                                                                                              profileColumns.map( key => currentData[0][key]  )
                                                                                                            .concat( [authenticated.team_id]  )
                                                                                            }
                                                              />

                                : <p>Nada</p>
                              }
                          </>
            : <Notification type='bad' msg={`Looks like your token is invalid. Please log in again.`} />
      }
    </>
  );
}

