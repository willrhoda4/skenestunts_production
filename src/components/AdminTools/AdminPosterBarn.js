





import   Axios        from 'axios';
import { useState }   from 'react';
import   Notification from '../Notification.js';





export default function PosterBarn( { setCurrentData, getData, gopher } ) {
    



    const [ updateLog,    setUpdateLog    ] = useState([]);
    const [ lastProgress, setLastProgress ] = useState('');


    // global variables for GitHub API and Node API
    const GITHUB_TOKEN       = process.env.REACT_APP_GITHUB_TOKEN;
    const GITHUB_API_URL     = process.env.REACT_APP_GITHUB_API_URL;
    const GITHUB_WORKFLOW_ID = process.env.REACT_APP_GITHUB_WORKFLOW_ID;
    const NODE_API_URL       = process.env.REACT_APP_API_URL;


    // helper function to display error messages
    function throwError() {
        
        setUpdateLog( updateLog => [    ...updateLog, 
                                       <Notification type="bad" 
                                                      msg="There was a problem connecting to the database." 
                                      />
                                   ]
                    );
    }

   

    // poll GitHub Actions API to track the progress of the workflow
    async function pollWorkflow( workflowId ) {

        const githubApiUrl = `${GITHUB_API_URL}runs/${workflowId}`;

        const intervalId   = setInterval( async () => {
            
            try {

                const headers = { headers: { 
                                                Authorization: `Bearer ${GITHUB_TOKEN}`, 
                                                Accept: 'application/vnd.github.v3+json' 
                                           } 
                                };
            
                const res = await Axios.get( githubApiUrl, headers );

                const { status, conclusion, outputs } = res.data;


                if ( status === 'completed' ) {
                
                    // end the interval and display the final message
                    clearInterval( intervalId );

                    if ( conclusion === 'success' ) {

                        // if the update was successful, display a success message
                        setUpdateLog( updateLog => [ ...updateLog, <Notification type="good" msg="Update complete!" /> ] );

                        

                        // if new titles were added, display them
                        const newTitles = outputs.new_titles;
                         
                              newTitles.length === 0 ?  setUpdateLog( updateLog => [ ...updateLog, <Notification type="good" msg="No new posters found. Your database is up to date." /> ] )
                                                     :  setUpdateLog( updateLog => [ ...updateLog, <Notification type="good" msg={`Added titles: ${ newTitles.join(', ') }`}          /> ] );
                                                
                    } else {

                        // if the update failed, display an error message
                        setUpdateLog( updateLog => [ ...updateLog, <Notification type="bad" msg="Update failed." /> ] );
                    }

                } else {

                    const progress = outputs.progress;
 
                    if ( progress !== lastProgress ) {
 
                        setLastProgress( progress );
                        setUpdateLog( updateLog => [ ...updateLog, <Notification type="wait" msg={progress} /> ] );
                    }
                }
            } catch ( error ) {

                console.error( 'Error polling workflow:', error );
                throwError();
                clearInterval( intervalId );
            }
        }, 10000 );
    }


    // initiates the GitHub Actions workflow and tracks its progress
    async function updateBarn() {
        
        try {
        
            // set initial log state
            setUpdateLog( [ <Notification type="wait" msg="Starting update process..." /> ] );


            // trigger the GitHub Actions workflow
            const res = await Axios.post(
                `${GITHUB_API_URL}workflows/${GITHUB_WORKFLOW_ID}/dispatches`,
                { ref: 'main' }, // branch to run the workflow on
                {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                        Accept:        'application/vnd.github.v3+json',
                    },
                }
            );

            // get the workflow ID and start polling for updates
            const runId = res.data.id;
            pollWorkflow( runId );

        } catch ( error ) {
            
            console.error( 'Error starting update workflow:', error );
            throwError();
        }
    }

    // function to search posters by letter from the database
    function letterSearch() {
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        function getLetterPosters( letter ) {

            Axios.post( `${NODE_API_URL}getPostersByLetter`, [ letter ], { withCredentials: true } )
                .then(  res => setCurrentData(res.data))
                .catch( err => {
                                    console.log(err);
                                    throwError();
                               }
                      );
        }

        return alphabet.map( ( letter, index ) => (
            <p className="letterLink" key={ index } onClick={ () => getLetterPosters( letter ) } >
                { ' ' + letter + ' ' }
            </p>
        ) );
    }

    return (

        <div className="adminForm">
            <div id="posterBarnBlurb">
                <h2>Welcome to the</h2>
                <h2 style={{ marginBottom: '5vh' }}>poster barn!</h2>
                <p style={{ marginBottom: '2.5vh' }}>
                    This page provides a place to peruse posters and offers quick-and-easy, single-button database updates.
                </p>
                <p style={{ marginBottom: '2.5vh' }}>Enjoy!</p>
            </div>

            <div id="barnButtons">
                <button className="formButton" type="button" onClick={updateBarn}>
                    Update Barn
                </button>
                <button className="formButton" type="button" onClick={() => setUpdateLog([])}>
                    Clear Log
                </button>
            </div>

            <div id="barnLog">{updateLog}</div>
            <div id="letterSearch">{letterSearch()}</div>
        </div>
    );
}



// import   Axios        from 'axios';
// import { useState }   from 'react';
// import   Notification from '../Notification.js';



// // a whole lot of mechanical and not much bodywork.
// // the PosterBarn is a tool for perusing and updating posters in the database.
// export default function PosterBarn ({setCurrentData, getData, gopher}) {

    
//     // the update log is a list of notifications that are displayed to the user as the update process progresses.
//     const [  updateLog,  setUpdateLog  ] = useState([]);
   

//     // displays error message if there is a problem connecting to the database.
//     function throwError   ()      { setUpdateLog( updateLog => [...updateLog, <Notification type='bad' msg='There was a problem connecting to the database.' />])}
 

//     // displays a message when the update process is complete.
//     function endUpdate    (type)  { setUpdateLog( updateLog => [...updateLog, <Notification type={type} msg='THE END' />])}
   
    
//     // retrieves all posters beginning with a specified letter from the database and displays them in the barn.
//     function letterSearch (letter, key) {
        
//         // bespoke endpoint makes retrieval a breeze.
//         function getLetterPosters (letter) {
            
//             Axios.post(  `${ process.env.REACT_APP_API_URL }getPostersByLetter`,
//                            [ letter ],
//                            { withCredentials: true }
//                      )
//                  .then(  res =>   setCurrentData(res.data)           )
//                  .catch( err => { console.log(err); throwError(); }  );
//         }   

//         // creates alphabetic array of letters
//         const alphabet    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

//         // creates a clickable link for each letter
//         const letterLink  = (letter, index) => <p className='letterLink' key={index} onClick={() => getLetterPosters(letter)} >{' '+letter+' '}</p>
           
//         // returns a list of clickable letters
//         return alphabet.map((letter, index) =>   letterLink(letter, index)  )           
//     }

    



 
    
//     // checks IMDB for new projects and adds them to the database if they are not already there.
//     async function updateBarn() {


//         try {

//             // set it off by clearing the log with a wait message
//             setUpdateLog( [ <Notification type='wait' msg='Retrieving data from IMDB...' /> ] );
    

//             // retrieve Skene Stunts team from the database
//             const res     = await getData( [ 'team' ] );
//             const team    = res.data.map( double  => double.imdb_id );
//             const board   = [ 'nm0804055', 'nm1819605', 'nm1451329' ];
//             const allIMDB = board.concat( team );
    

//             // call the microservice to retrieve IMDb credits for the team
//             const flicksResponse = await Axios.post( `${gopher}server/getFlicks/`, { team: allIMDB }, { withCredentials: true } );


//             // flicksResponse.data[0] is the total number of credits, flicksResponse.data[1] is the list of credits
//             // if the response is not as expected, log an error and end the update
//             if ( flicksResponse.data.length !== 2 ) {

//                 setUpdateLog( updateLog => [ ...updateLog, <Notification type='bad' msg='Problem retrieving credits' /> ] );
//                 return endUpdate('bad');
//             }
    

//             // else log the number of credits and projects and proceed
//             const [ creditCount, flickList ] = flicksResponse.data;

//             setUpdateLog( updateLog => [ ...updateLog, <Notification type='good' msg={`Skene Stunts has ${creditCount} credits on ${flickList.length} projects.`} /> ] );
    

//             // retrieve posters from the database, then count the number of projects in the database
//             const dbRes         = await getData(['posters']);
//             const databaseCount = dbRes.data.length;
    

//             // if the database is up to date, log a message and end the update
//             if (databaseCount >= flickList.length) {

//                 setUpdateLog( updateLog => [ ...updateLog, <Notification type='good' msg={`Your database is up to date with ${databaseCount} projects.`} /> ] );
//                 return endUpdate('good');
//             }
    

//             // build a list of projects that are not in the database yet
//             const newFlicks = flickList.filter( flick => !dbRes.data.find( dbFlick => dbFlick.imdb_id === flick ) );
    

//             // we'll now call on the microservice to retrieve and upload 
//             // the posters for each new project, one by one (to avoid timing out in the microservice)
//             const uploadPromises = newFlicks.map( async flickId => {
 
//                 try {

//                     // call the microservice to retrieve and upload the poster to Cloudinary
//                     // posterRes.data[2] should return a cloudinary reference if the poster was found, or 'no poster' if not
//                     const posterRes   =   await Axios.post(`${gopher}server/getPoster/`, { imdbId: flickId }, { withCredentials: true } );
//                     const noPoster    = ( posterRes.data && posterRes.data[2] ) === 'no poster';

//                     const responseMsg =   noPoster ? `Couldn't find a poster for ${posterRes.data[0]}.`
//                                                    : `Poster for ${posterRes.data[0]} added to the database.`;
    
//                     // add the movie to the database
//                     await Axios.post(`${process.env.REACT_APP_API_URL}newPoster`, posterRes.data, { withCredentials: true });

//                     setUpdateLog( updateLog => [ ...updateLog, <Notification type={noPoster ? 'bad' : 'good'} msg={responseMsg} /> ] );
                
//                 } catch (error) {

//                     setUpdateLog( updateLog => [ ...updateLog, <Notification type='bad' msg={`Error adding ${flickId} to the database.`} /> ] );
                
//                 }
//             });
    
//             // wait for all the posters to be uploaded before ending the update
//             await Promise.all( uploadPromises );
//             endUpdate( 'good' );
            
//         } catch ( error ) {

//             console.log( error );
//             setUpdateLog( updateLog => [ ...updateLog, <Notification type='bad' msg='There was an error updating the barn.' /> ] );
//             endUpdate( 'bad' );
//         }
//     }
    

    

//     return (<div className='adminForm'>
//                 <div id='posterBarnBlurb'>
//                     <h2>Welcome to the</h2>
//                     <h2 style={{marginBottom: '5vh'  }}>poster barn!</h2>
//                     <p  style={{marginBottom: '2.5vh'}}>This page provides a place to peruse posters and offers quick-and-easy, single-button database updates.</p>
//                     <p style={{marginBottom: '2.5vh'}}>Enjoy!</p>
//                 </div>
//                 <div id='barnButtons'>
//                     <button className='formButton' type="button" onClick={(e) => updateBarn()    }>Update Barn</button>
//                     <button className='formButton' type="button" onClick={(e) => setUpdateLog([])}>Clear Log</button>
//                 </div>

               

//                 <div id='barnLog'>
//                     {updateLog}
//                     </div>
//                     <div id='letterSearch'>{ letterSearch() }</div>
//                 </div>)
// }       
        

