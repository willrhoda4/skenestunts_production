







import   Axios        from 'axios';
import { useState }   from 'react';
import   Notification from '../Notification.js';



// a whole lot of mechanical and not much bodywork.
// the PosterBarn is a tool for perusing and updating posters in the database.
export default function PosterBarn ({setCurrentData, getData, url}) {

    
    // the update log is a list of notifications that are displayed to the user as the update process progresses.
    const [  updateLog,  setUpdateLog  ] = useState([]);
   

    // displays error message if there is a problem connecting to the database.
    function throwError   ()      { setUpdateLog( updateLog => [...updateLog, <Notification type='bad' msg='There was a problem connecting to the database.' />])}
 

    // displays a message when the update process is complete.
    function endUpdate    (type)  { setUpdateLog( updateLog => [...updateLog, <Notification type={type} msg='THE END' />])}
   
    
    // retrieves all posters beginning with a specified letter from the database and displays them in the barn.
    function letterSearch (letter, key) {
        
        // bespoke endpoint makes retrieval a breeze.
        function getLetterPosters (letter) {
            
            Axios.post(  `${url}getPostersByLetter`, [letter]        )
                 .then(  res =>   setCurrentData(res.data)           )
                 .catch( err => { console.log(err); throwError(); }  );
        }   

        // creates an array of letters
        const alphabet    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        // creates a clickable link for each letter
        const letterLink  = (letter, index) => <p className='letterLink' key={index} onClick={() => getLetterPosters(letter)} >{' '+letter+' '}</p>
           
        // returns a list of clickable letters
        return alphabet.map((letter, index) =>   letterLink(letter, index)  )           
    }

    



 
    
    // checks IMDB for new projects and adds them to the database if they are not already there   
    function updateBarn () {

        let databaseCount, databaseData, creditCount, flickCount, flickList;
    
        let newFlicks = [];

        // resets the update log and displays a message to the user
        setUpdateLog([<Notification type='wait' msg='Retrieving data from IMDB...' />]);

        // retrieves the list of Skene Stunts team members from the database and creates an array of their IMDB IDs
        getData(['team'])
          .then(  res => {

       
                        // Rick Skene   Daniel Skene     Sean Skene                          
            let board = [ 'nm0804055',   'nm1819605',    'nm1451329' ];
        
            let team  = res.data.map(double => double.imdb_id);

            let allIMDB = board.concat(team)
            

            // calls a python script that retrieves the number of credits and projects for the Skene Stunts team from IMDB
            Axios.post(`${url}py/getFlicks`, [allIMDB])
                 .then( res => {

                            // the script should return the number of credits, the number of projects, and a list of the projects.
                            // if it comes back with anything but an array of length 3, there is a problem.
                            if (res.data.length !== 3) {   setUpdateLog(updateLog => [...updateLog, <Notification type='bad' msg='There was a problem retrieving your company credits' />]);
                                                           return endUpdate('bad');
                                                       }
                            
                            // if it is an array of three, you can bet this is what's inside.
                            creditCount = res.data[0];
                            flickCount  = res.data[1];
                            flickList   = res.data[2];


                            // add an update to the update log to keep the user looped in.                           
                            setUpdateLog(updateLog => [...updateLog, <Notification type='good' msg={`Looks like the Skene Stunts team has ${creditCount} credits on ${flickCount} projects.`} />]);
                            

                            // checks how many posters are in the database and compares that number to the new number of credits
                            getData(['posters'])
                              .then(  res =>  { 
 

                                databaseCount = res.data.length;
                                databaseData  = res.data;
                                
                               // if res.data is not an array, there is a problem.
                                if (typeof(databaseCount) !== 'number')        {  setUpdateLog(updateLog => [...updateLog, <Notification type='bad'  msg={`There was trouble loading your database. Try again, and if the problem persists call your guy.`} />]);
                                                                                  endUpdate('bad');
                                                                               }
                                // if the database has the same amount or more projects than IMDB,
                                // there's no need to head back to IMDB for poster data.
                                else if (databaseCount >= flickCount)          {  setUpdateLog(updateLog => [...updateLog, <Notification type='good' msg={`Your database already has ${databaseCount} projects in it, so you should be up to date.`} />]);
                                                                                  endUpdate('good');
                                                                               }
                                // if the database has fewer projects than IMDB, we need to find the missing projects.                                           }
                                else    {                                         setUpdateLog(updateLog => [...updateLog, <Notification type='wait' msg={`Your database only has ${databaseCount} projects in it. Let's see if we can find the missing ${flickCount - databaseCount}...`} />]);

                                            for (let i = 0; i < flickList.length; i++) {

                                                // finds which projects are not in the database and adds them to an array
                                                // continues if it finds a match.
                                                // eslint-disable-next-line no-loop-func
                                                if (databaseData.find(flick => flick.imdb_id === flickList[i])) { continue; }
                                                else                                                            { newFlicks.push(flickList[i])}
                                            }

                                            let promises = [];

                                            // retrieves posters for the new projects if they exist and adds them to the promises array.
                                            for (let i = 0; i < newFlicks.length; i++) {
                                               
                                                promises.push(
                                                    Axios.post(`${url}py/getPoster`, [newFlicks[i]]).then(res => {
                                                           res.status  === 400         ? setUpdateLog(updateLog => [...updateLog, <Notification type='bad'  msg={`There was an error retrieving a poster. Try again and, if the problem persists, call your guy.`}   />])
                                                        :  res.data[2] === 'no poster' ? setUpdateLog(updateLog => [...updateLog, <Notification type='bad'  msg={`Couldn't find a poster for ${res.data[0]}.`}                                                        />])
                                                        :                                setUpdateLog(updateLog => [...updateLog, <Notification type='good' msg={`A poster for ${res.data[0]} was added to the database.`}                                            />]);   
                                                        })
                                                )
                                            }

                                            // when all the promises are fulfilled, end the update. You made it!
                                            Promise.all(promises).then(   () => endUpdate('good') )
                                                                 .catch( err => setUpdateLog(updateLog => [ ...updateLog, 
                                                                                                            <Notification type='bad'  
                                                                                                                           msg={`There was a problem getting your posters: \n\n${err}`}   
                                                                                                            />])  
                                                                       ); 
                                }
                            // catch blocks on catch blocks on catch blocks                   
                            }).catch(err => console.log(err))

           }).catch(err => console.log(err))

        }).catch(err => console.log(err))
        

        
    }

    

    return (<div className='adminForm'>
                <div id='posterBarnBlurb'>
                    <h2>Welcome to the</h2>
                    <h2 style={{marginBottom: '5vh'  }}>poster barn!</h2>
                    <p  style={{marginBottom: '2.5vh'}}>This page provides a place to peruse posters and offers quick-and-easy, single-button database updates.</p>
                    <p style={{marginBottom: '2.5vh'}}>Enjoy!</p>
                </div>
                <div id='barnButtons'>
                    <button className='formButton' type="button" onClick={(e) => updateBarn()    }>Update Barn</button>
                    <button className='formButton' type="button" onClick={(e) => setUpdateLog([])}>Clear Log</button>
                </div>

               

                <div id='barnLog'>
                    {updateLog}
                    </div>
                    <div id='letterSearch'>{ letterSearch() }</div>
                </div>)
}       
        

