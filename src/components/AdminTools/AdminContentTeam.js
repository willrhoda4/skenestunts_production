







import   AdminButtons    from './AdminButtons.js';
import   AdminFormTeam   from './AdminFormTeam.js';

import   Notification    from '../Notification.js';  
import   CloudImage      from '../CloudImage.js';
import   cloudPoster     from '../../utils/cloudPoster.js';

import { useState, 
         useEffect  }    from 'react';
        
import   imdbIcon        from '../../images/imdb_icon.svg';


export default function Team ( {     
                                    table,
                                    pkName, 
                                    columns,
                                    posters, 
                                    loadData,  
                                    currentData,
                                    adminStatus    } ) { 
       

    
    
                           
    const [ expanded,              setExpanded              ] = useState(false);

    // controls the floating notification that appears when a team member
    // is successfully or unsuccessfully invited to Director's Chair.
    const [ floatingNotification,  setFloatingNotification  ] = useState(false);
    const [ fadingNotification,    setFadingNotification    ] = useState(false);

    const   posterList                                        = table === 'board' ? posters[0] : posters[1];


    // close the current form if the table changes.
    // this hook keeps the program from running off the rails 
    // when an adminStatus user clicks 'Board'
    // while an edit form is expanded on the 'Team' page.
    useEffect(() => { setExpanded(false); }, [table]);


    // fades floating div out after five seconds, then disappears it.
    useEffect(() => { 

        if (floatingNotification) {

            setTimeout(() => { setFadingNotification(true) }, 5000);
            setTimeout(() => { setFadingNotification(false); setFloatingNotification(false); }, 5500);
        }

    }, [floatingNotification])



    
  


    // generates a double component 
    function makeDouble ( double, index ) {

        // passed in value for double is an object with the following properties:
        const {     rank,
                    email,
                    imdb_id,
                    team_id,
                    image_id,
                    legal_name } = double;

        // prepares data to be passed to TeamForm component for updates
        const       doubleData   = columns.map(key => double[key]).concat([team_id]); 

        return (

            <li key={index} className='adminItem'>


               
                
                <div className='adminTeamGrid'>

                     {/* thumbnail image of profile */}
                        <CloudImage id={image_id} className='adminTeamThumbnail'/>
                 

                    <div className='adminTeamControls'>    

                        {/* team member's name and IMDB link */}
                        <div className='adminTeamNameLevel'>
                            <p>{legal_name}</p>
                            <a      key={index}
                                 target="_blank"
                                    rel="noreferrer"
                                   href={'https://www.imdb.com/name/' + imdb_id + '/'}
                            >
                                <img className='imdbIcon' alt='IMDB logo' src={imdbIcon} />
                            </a>
                        </div>

                        <div className='adminTeamButtons'>

                            <AdminButtons   id={team_id}
                                            rank={rank}
                                            data={currentData}
                                            table={table}
                                            index={index}
                                            email={email}
                                            pkName={pkName}
                                            loadData={loadData}
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                            setFloatingNotification={setFloatingNotification}
                            />

                        </div>
                    </div>

                </div>

                {/* if the team member is expanded, show the form and the poster rack */}
                {  expanded === team_id &&  <>
                                                <AdminFormTeam loadData={loadData}
                                                                  table={table}
                                                                 pkName={pkName}
                                                                columns={columns}
                                                                 update={doubleData}
                                                            adminStatus={adminStatus}
                                                />

                                             
                                                {/* five posters for team members, 10 for the board */}
                                                <div className='adminTeamPosterRack'>
                                                    { posterList.length === currentData.length && posterList[index].slice(0,5).map((poster, index) => cloudPoster(poster, 'adminTeamPoster')) }
                                                </div>

                                                {   table === 'board' &&
                                                        <div className='adminTeamPosterRack'>
                                                            { posterList.length === currentData.length && posterList[index].slice(5,10).map((poster, index) => cloudPoster(poster, 'adminTeamPoster')) }
                                                        </div>
                                                }
                                            </>
                }
            </li>
        )
    }

    return (<>

                <div className='adminTeamHeading'>
                    <p>{ table === 'board' ? 'Board' : 'Team' } Members</p>
                </div>

                { currentData.length !==0                    &&
                  currentData[0].hasOwnProperty('team_id')   &&   currentData.map(( double, index ) => makeDouble(double, index))
                }

                <div className={ fadingNotification ? 'floatingNotification fading' : 'floatingNotification' }>
                    {       
                            floatingNotification === 'emailError'   ?  <Notification type={'bad'}  msg={'There was an error sending the invitation.'} />
                        :   floatingNotification === 'dataError'    ?  <Notification type={'bad'}  msg={'There was a problem registering the reset.'} />
                        :   floatingNotification === 'emailSent'    ?  <Notification type={'good'} msg={'Invitation successfully sent.'}              />
                        :                                               null
                    }
                </div>
    </>)
}


