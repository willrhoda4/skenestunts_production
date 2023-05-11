






import   Axios             from 'axios';
import { useEffect, 
         useState   }      from 'react';

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



function Admin({performerOptions, editing, adminStatus, setAdminStatus, posters, getData, url}) {


  const   token                               = new URLSearchParams(window.location.search).get('token'); 
  const   invite                              = new URLSearchParams(window.location.search).get('invite') === 'true' ? true : false; 

  const [ currentData,    setCurrentData    ] = useState([]);
  const [ authenticated,  setAuthenticated  ] = useState(false);
  const [ boardMember,    setBoardMember    ] = useState(false);



  //loads data for editing
  function loadData   (table, orderBy='rank', filters, limit) {

  
    // sets request boody for getData request
    // note that the 'profile' table requires a team_id from an authenticated user
    // and the 'info' table requires a special hack to amalgamate the faq and quote data
    // and the 'posters' table needs to be ordered ascendingly in order satisfy alphabetic sensibilities.
    let profileTable = boardMember ? 'board' : 'team';

    let reqBody      = table === 'profile' ? [  profileTable,    [[ 'team_id', authenticated.team_id ]]                                       ]
                     : table === 'info'    ? [ 'faq',               null,                                { orderBy: 'rank' }                  ] 
                     : table === 'posters' ? [  table,              null,                                { orderBy: [ 'title', true] }        ] 
                     : table === 'misc'    ? [  table,              null                                                                      ]
                     :                       [  table,              filters,                             { orderBy: orderBy, limit: limit }   ];

    let quoteBody    =                       [ 'misc',           [[ 'description', 'info_quote']]                                             ];
    let quoteByBody  =                       [ 'misc',           [[ 'description', 'info_quote_by']]                                          ];


    

// FIGURE OUT WHETHER THIS setAuthenticated IS REDUNDANT
          // if (table === 'profile') { getData(reqBody).then(  res => setAuthenticated(res.data[0]) )
          //                                            .catch( err => console.log(err)              ); 
                                  //  }

    // rounds up and amalgemates faq and quote data for the info page.
    // note that this hack is the reason why the AdminButtons component
    // makes special provisions for the info page.
      if (table === 'info')    {  Axios.all([  getData(reqBody),
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



  // activates admin status if user's imdb id matches Janice Skene.
  useEffect(() => {

      authenticated && authenticated.imdb_id === 'nm0804052' ? setAdminStatus(true)      
                                                             : setAdminStatus(false);

  }, [authenticated, setAdminStatus]);



  // checks if user is a board member and sets boardMember state accordingly
  useEffect(() => {

    if (authenticated && authenticated.hasOwnProperty('profile')) { setBoardMember(true); }

    // if (authenticated) { setBoardMember( authenticated.imdb_id === 'nm0804055' || /*  Rick Skene   */
    //                                      authenticated.imdb_id === 'nm0804052' || /*  Jan Skene */
    //                                      authenticated.imdb_id === 'nm7777777' || /*  Jan Skene */
    //                                      authenticated.imdb_id === 'nm1819605' || /*  Daniel Skene */
    //                                      authenticated.imdb_id === 'nm1451329'    /*  Sean Skene   */ 
    //                                    );
    //                    }
    }, [authenticated]);

  // checks if token is valid for password reset
  useEffect(() => {


    // if token is present, checks if it is valid
    if (token) {

      const reqBody   = [   'board_passwords',   [['token', token]],   {  columns: 'team_id, reset_at' }   ];

      const checkToken = () => {
  
        // grab data from reqBody[0] table
        getData(reqBody).then( res => {              console.log(res.data);

                  // if token is not preseent and unique in board_passwords, 
                  // check team_passwords before declaring 'dataError'.
                  if (res.data.length !== 1) { 
                                                if (reqBody[0] === 'board_passwords') {
                                                                                        reqBody[0] = 'team_passwords';
                                                                                        return checkToken();
                                                                                      }
                                                else                                  {
                                                                                        return setAuthenticated('dataError'); 
                                                                                      }
                                             }
                  else                       {

                    const { team_id, reset_at } = res.data[0];

                    // if token is present and unique, checks if it has expired.
                    // 900000 milliseconds = 15 minutes
                    if ( !invite && Date.now() - parseInt(reset_at) > 900000 ) { return setAuthenticated('expired'); }


                    const dataTable =      reqBody[0] === 'board_passwords' ? 'board' : 'team';


                    // if token is present, unique and not expired, sets authenticated to the team member's data.
                    getData([ dataTable, [['team_id', team_id]] ])
                      .then(  res =>  {      
                                              // if team_id is not present and unique, sets authenticated to 'dataError'.
                                              if (res.data.length !== 1) { setAuthenticated('dataError'); } 
                                              else                       { setAuthenticated(res.data[0]); }
                                      }                                                                       
                                )
                  }
                  })         
            .catch( err =>  { console.log(err); setAuthenticated('dataError'); } )
      }

      checkToken();

    }

  }, [getData, invite, token])








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
                                                                   url={    url              } 
                                                               getData={    getData          }
                                           />
                                         
        :  <>
            
                              {   editing === 'misc'        ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                             setCurrentData={setCurrentData}
                                                                                      table={editing}
                                                                                  AdminForm={AdminFormMisc}
                                                                                  Generator={Misc}
                                                                                        url={url}
                                                              />  
                              
                              :   editing === 'posters'     ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                            setCurrentData={setCurrentData}
                                                                                      table={editing}
                                                                                     pkName='poster_id'
                                                                                  AdminForm={PosterBarn}
                                                                                  Generator={Posters}
                                                                                    columns={[ 'title', 'imdb_id', 'image_url' ]}
                                                                                    getData={getData}
                                                                                        url={url}
                                                              />  
                              
                                : editing === 'media'       ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                     pkName='article_id'
                                                                                  AdminForm={AdminFormMedia}
                                                                                  Generator={Media}
                                                                                    columns={[ 'headline', 'date', 'outlet', 'article_url', 'image_url', 'image_description' ]}
                                                                                        url={url}
                                                              />

                                : editing === 'info'        ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                     pkName='faq_id'
                                                                                  AdminForm={AdminFormInfo}
                                                                                  Generator={Info}
                                                                                    columns={[ 'question', 'answer', 'css_id' ]}
                                                                                        url={url}
                                                              />

                                : editing === 'reels'       ? <AdminView           loadData={loadData} 
                                                                                currentData={currentData}
                                                                                      table={editing}
                                                                                     pkName='reel_id'
                                                                                  AdminForm={AdminFormReels}
                                                                                  Generator={Reels}
                                                                                    columns={[ 'title', 'caption', 'embed_code' ]}
                                                                                        url={url}
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
                                                                                        url={url}
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
                                                                                        url={url}
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
                                                                                        url={url}
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
                                                                                        url={url}
                                                                                     update={ currentData[0].hasOwnProperty('email')        &&
                                                                                              profileColumns.map( key => currentData[0][key]  )
                                                                                                            .concat( [authenticated.team_id]  )
                                                                                            }
                                                              />

                                : <p>Nada</p>
                              }
                          </>
      }
    </>
  );
}

export default Admin;
