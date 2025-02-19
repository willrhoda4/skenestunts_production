






import   Notification            from '../Notification.js';
import   CloudImage              from '../CloudImage.js';
         
import   imdbIcon                from '../../images/imdb_icon.png';
import   dropdownIcon            from '../../images/icon_dropdown.svg';
import   phoneIcon               from '../../images/icon_phone.svg';
import   emailIcon               from '../../images/icon_email.svg';
import   reelIcon                from '../../images/icon_reel.svg';
import   noteIcon                from '../../images/icon_note.svg';
import   deleteUserIcon          from '../../images/icon_deleteUser.svg';
import   levelIcon               from '../../images/icon_level.svg';
import   refreshIcon             from '../../images/icon_refresh.svg';
import   checkIcon               from '../../images/icon_check.svg';
import   mailClosedIcon          from '../../images/icon_mailClosed.svg';
import   mailOpenIcon            from '../../images/icon_mailOpen.svg';
         
import { useState }              from 'react';
import   useFloatingNotification from '../../hooks/useFloatingNotification.js';

import { noteForm, 
         emailForm, 
         updateClass, 
         deletePerformer  }      from './AdminPerformerFunctions.js';



export default function Performers ( {  currentData, loadData, adminStatus, boardMember, gopher  } ) { 


    const [ adminNote,          setAdminNote            ] = useState(false);
    const [ noting,             setNoting               ] = useState(false);
    const [ emailStatus,        setEmailStatus          ] = useState(false);
    const [ expanded,           setExpanded             ] = useState(false);
    const [ groupMail,          setGroupMail            ] = useState(false);
    const [ newNotification,    floatingNotification    ] = useFloatingNotification();
    


    // wrangles email addresses for all search results into a comma-separated string for the 'mailto' link.
    const   groupEmails = currentData.map( double => double.email ).join(', ');

    // clickhandler for group-email envelope icon in top-right corner
    // it opens/closes the group-email form and copies the addresses to a list.
    function clickEnvelope () { 
        
        //open the email form for admins
        adminStatus && setGroupMail(!groupMail); 
        
        //copy the emails for everybody else
        navigator.clipboard.writeText(groupEmails);
        newNotification('emails copied to clipboard');

    }
    
    function makePerformer (performer, index) {
 
        const { performer_notes, 
                performer_class,
                submitted_when,
                workers_union,
                performer_id,
                updated_when,
                update_count,
                admin_notes,
                experienced,
                first_name,
                last_name,
                birthyear,
                province,
                reel_url,
                headshot,
                bodyshot,
                pronouns,
                imdb_id, 
                weight,
                height,
                gender,
                phone,
                email,
                hair,
                eyes, }           = performer;


                // performer's full name
                const name        = first_name+' '+last_name;
                // performer's current age (+/- 1 year)
                const age         = new Date().getFullYear() - parseInt(birthyear);
                // first hit the database when
                const submitDate  = new Date(parseInt(submitted_when)).toLocaleDateString();
                // last updated when. defaults to 'unupdated' if never updated.
                const updateDate  = update_count === 0 ? 'unupdated'
                                                       : new Date(parseInt(updated_when)).toLocaleDateString()+` (${update_count})`

                const formattedHeight = `${Math.floor(height / 12)}'${height % 12}"`;
             


                const ethnicities = [];
                const licenses    = []; 
                const skills      = [];


        // iterates through the performer object's booleans and pushes any true values to the appropriate array.
        for ( let prop in performer) {
                                                                                    // ethnicities trap
            if ( typeof(performer[prop]) === 'boolean' && performer[prop] )  { if ( prop === 'mena'            ||
                                                                                    prop === 'black'           ||
                                                                                    prop === 'white'           ||
                                                                                    prop === 'hispanic'        ||
                                                                                    prop === 'east_asian'      ||
                                                                                    prop === 'indigenous'      ||
                                                                                    prop === 'south_asian'      ) { ethnicities.push(<p key={prop} >{ prop.replace('_', ' ')    }</p>) }

                                                                                    // licenses trap
                                                                          else if ( prop === 'air_brake'       ||
                                                                                    prop.startsWith('class_')  ||
                                                                                    prop.endsWith('_trailer')   ) {    licenses.push(<p key={prop} >{ prop.replaceAll('_', ' ') }</p> ) }

                                                                                    // experienced escape
                                                                          else if ( prop === 'experienced'      ) {      continue;                                                      }         
                                                                                    // skills trap
                                                                          else                                    {      skills.push(<p key={prop} >{ prop.replaceAll('_', ' ') }</p> ) }



        }}  

        // if the performer has no attributes, push a 'none' placeholder to the appropriate array.
        const attributes = [ ethnicities, licenses, skills ];

        for (let i =0; i < attributes.length; i++ ) {
            if (attributes[i].length === 0) { attributes[i].push(<p key='none'>None</p>) };
        }





        return( 
        
            <li key={index} className='adminItem'>

                {/* this is the always-visible unexpanded portion of profile */}
                <div className='adminPerformerGrid'>


                    {/* performer headshot thumbnail */}
                    <div className='adminPerformerThumbnailWrapper'>
                        <CloudImage id={headshot} className='adminPerformerThumbnail' />
                    </div> 


                    {/* performer bodyshot thumbnail */}
                    <div className='adminPerformerThumbnailWrapper'>
                        <CloudImage id={bodyshot} className='adminPerformerThumbnail' />
                    </div> 






                    {/* performer name, weight, height, age */}
                    <p className='adminPerformerGridItem'
                           style={{ paddingLeft: '.5em' }}>{name}</p>
                    <p className='adminPerformerGridItem'>{weight} lbs</p>
                    <p className='adminPerformerGridItem'>{formattedHeight}</p>
                    <p className='adminPerformerGridItem'>{age}</p>


                    {/* expand icon */}
                    <img className={ expanded === performer_id ? 'adminPerformerDropdownIcon adminPerformerGridItem spun' 
                                                               : 'adminPerformerDropdownIcon adminPerformerGridItem' 
                                   } 
                               alt='dropdown icon'
                             style={{height: '5vh', margin: '2.5vh', color: 'red'}}
                           onClick={ expanded !== performer_id ? () => { setExpanded(performer_id); 
                                                                         setEmailStatus(false); 
                                                                         setAdminNote(false);
                                                                         setNoting(false);
                                                                       }
                                                               : () =>   setExpanded(false)
                                   }
                               src={dropdownIcon}
                    />

                </div>


                {/* this is the expanded portion of profile where the real meat and potatoes are to be found */}
                <div className={ expanded === performer_id ? 'adminPerformerExpansion open' : 'adminPerformerExpansion' }>

                    {/* Layer 1: The Photo Row */}
                    <div className='adminPerformerPhotoRow'>
                    
                        {/* performer headshot large */}
                        <div className='adminPerformerPhotoWrapper' >
                            <CloudImage className='adminPerformerPhoto' id={headshot} />
                        </div>


                        {/* performer bodyshot large */}
                        <div className='adminPerformerPhotoWrapper' >
                            <CloudImage className='adminPerformerPhoto' id={bodyshot} />
                        </div>
                        
                    </div>

                    {/* Layer 2: The Info Row */}
                    <div className='adminPerformerInfoRow'>

                        <table className='adminPerformerTable'>
                            <tbody>
                                {/* Performer Hair */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Hair:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{hair}</p></td>
                                </tr>
                                {/* Performer Eyes */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Eyes:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{eyes}</p></td>
                                </tr>
                                {/* Performer Height */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Height:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'> {formattedHeight}</p></td>
                                </tr>  
                                {/* Performer Weight */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Weight:</h5></td>
                                    <td><p  className='adminPerformerAttribute'> {weight}lbs</p></td>
                                </tr>
                                {/* Date of Original Submission */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Submitted:</h5></td>
                                    <td><p  className='adminPerformerAttribute'> {submitDate}</p></td>
                                </tr>
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Form Used:</h5></td>
                                    <td><p  className='adminPerformerAttribute'> {experienced ? 'experienced' : 'aspiring'}</p></td>
                                </tr>
                            </tbody>
                        </table>


                        <table className='adminPerformerTable'>
                            <tbody>
                                {/* Performer Gender */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Gender:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{gender}</p></td>
                                </tr>
                                {/* Performer Pronouns – truncates 'prefer not to disclose' to 'not disclosed' for brevity in display. */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Pronouns:</h5></td>                             
                                    <td><p  className='adminPerformerAttribute'>{ pronouns === 'prefer not to disclose' ? 'not disclosed'
                                                                                                                        :  pronouns }</p></td>
                                </tr>
                                {/* Performer Age (+/- 1 Year) */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Age:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'> {age}</p></td>
                                </tr>  
                                {/* Performer Union */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Union:</h5></td>
                                    <td><p  className='adminPerformerAttribute'> {workers_union}</p></td>
                                </tr>
                                {/* Date Last Updated – defaults to 'unupdated' if never. */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Updated:</h5></td>
                                    <td><p  className='adminPerformerAttribute'> {updateDate}</p></td>
                                </tr>
                                {/* Performer Home Province */}
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Province:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{province}</p></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>


                    {/* Layer 3: Admin Notes – if any notes have been made on a performer's profile, they'll appear here. */}
                    { admin_notes && <Notification type='idea' msg={admin_notes} />  } 


                    {/* Layer 4: Skill Section (which also includes ethnicities) */}
                    <div className='adminPerformerSkillSection'>


                        {/* Performer Ethnicities */}
                        <h5 style={{fontSize: '4vmin'}}>Ethnicities</h5>
                        <div className='adminPerformerSkills'>
                            { ethnicities }
                        </div>


                        {/* Performer Skills */}
                        <h5 style={{fontSize: '4vmin'}}>Skills</h5>
                        <div className='adminPerformerSkills'>
                            { skills }
                        </div>


                        {/* Performer Licenses */}
                        <h5 style={{fontSize: '4vmin'}}>Licenses</h5>
                        <div className='adminPerformerSkills'>
                            { licenses }
                        </div>


                        {/* Peformer Notes – anything that was included in the 
                           'anything else we should know' section of intake form. */}
                        {   performer_notes &&
                                <>
                                    <h5 style={{fontSize: '4vmin'}}>Notes</h5>
                                    <p style={{fontSize: '1.5em', margin: '2.5vmin 0'}}>{performer_notes}</p>
                                </>
                        }


                    </div>



                        
                    {/* Layer 5: Note Form – this is used to add admin notes to a profile. 
                        It's hidden by default, and  appears when the note icon below is clicked. */}
                    {   noting && noteForm(performer_id, adminNote, setAdminNote, newNotification) }



                        
                    {/* Layer 6: Contact Section – this is where the performer's contact info is displayed,
                        as well as their internally manged performer class and a link to their reel, if applicable. 
                        this is also where the note icon to fire the Note Form lives.*/}
                    <div className='adminPerformerContactSection'>
                        

                        {/* note icon to summonm note form */}
                        {
                            boardMember && <img className='adminPerformerIcon' 
                                                      alt='note icon' 
                                                      src={noteIcon} 
                                                  onClick={ () => { setAdminNote(admin_notes); setNoting(noting => !noting); } }
                                            />
                        }

                        {/* delete icon to delete performer. only available to users with adminStatus. */}
                        {   adminStatus &&
                                <img className='adminPerformerIcon' 
                                    alt='delete user icon' 
                                    src={deleteUserIcon} 
                                onClick={() => deletePerformer(performer_id, loadData) }
                                /> 
                        }         
                        
                        
                        {/* link to latest reel. doesn't appear if they haven't supplied one. */}
                        { reel_url !== 'none'    &&        <a target="_blank"
                                                                 rel="noreferrer"
                                                                href={reel_url}
                                                           >
                                                                <img className='adminPerformerIcon' alt='film reel icon' src={reelIcon} />
                                                            </a>
                        }


                        {/* Performer Class Row */}
                        <div className='adminPerformerContactRow' >

                            {/* icon is just for show. doesn't link out. */}
                            <img className='adminPerformerIcon'     
                                       alt='bar chart icon' 
                                     style={{cursor: 'auto'}}
                                       src={levelIcon} 
                            />


                            {/* if admin or board member, display dropdown to change performer class and refresh icon.
                                if not,  display existing class with no opportunity to interact. */}
                            {   adminStatus  ||
                                boardMember   ?   <>
                                                    {/* class dropdown */}
                                                    <select key={performer_id} id={'newPerformerClass'+performer_id} defaultValue={performer_class}>
                                                        <option value={'A'}>A — team member</option>
                                                        <option value={'B'}>B — endorsed</option>
                                                        <option value={'C'}>C — IMDB ID and reel</option>
                                                        <option value={'D'}>D — IMDB ID no reel</option>
                                                        <option value={'R'}>R — reel but no IMDB  ID</option>
                                                        <option value={'E'}>E — rookie</option>
                                                        <option value={'F'}>F — listed</option>
                                                    </select>


                                                    {/* refresh icon to update status if changed */}
                                                    <img className='adminPerformerIcon'
                                                                id={'updateClassIcon'+performer_id}
                                                            alt='refresh icon' 
                                                            src={refreshIcon} 
                                                        onClick={() => updateClass(performer_id) }
                                                    />


                                                    {/* checkmark icon will appear to show that status has been updated */}
                                                    <img className='adminPerformerIcon checkIcon'
                                                                id={'checkIcon'+performer_id}
                                                               alt='checkmark icon' 
                                                             style={{display: 'none'}}
                                                               src={checkIcon} 
                                                    />
                                                </>

                                            :   <>  {
                                                        // if not admin or board member, display existing class, and nothing else.
                                                          performer_class ==='A' ? <p>A — team member</p>
                                                        : performer_class ==='B' ? <p>B — good books</p>
                                                        : performer_class ==='C' ? <p>C — IMDB ID and reel</p>
                                                        : performer_class ==='D' ? <p>D — IMDB ID no reel</p>
                                                        : performer_class ==='R' ? <p>D — reel but no IMDB ID</p>
                                                        : performer_class ==='E' ? <p>E — rookie</p>
                                                        : performer_class ==='F' ? <p>F — bad books</p>
                                                        :                          null
                                                }  </>
                            }
                                        


                        </div>



                        {/* if a valid imdb id has been supplied, an icon linking to the performer's imdb page appears.
                            for convenience, a count credits link also appears next to the icon, which should transform to 
                            the performer's credit count in short order, once pushed. */}
                        { imdb_id.startsWith('nm') &&   <div className='adminPerformerContactRow'>


                                                            {/* IMDB icon link */}
                                                            <a  target="_blank"
                                                                    rel="noreferrer"
                                                                    href={'https://www.imdb.com/name/'+imdb_id+'/'}
                                                            >
                                                                <img className='adminPerformerIcon' alt='IMDB logo' src={imdbIcon} />
                                                            </a>

                                                            {/* 
                                                            
                                                                this feature is currently disabled, until such a time that a better solution
                                                                can be found for counting credits. the current solution is too slow.
                                                            
                                                            
                                                            {
                                                                            // if no imdb credits have been counted yet, display link to count credits.
                                                             !creditCount ?  <p    style={{cursor: 'pointer'}}
                                                                                 onClick={() => countCredits(imdb_id, setCreditCount, gopher)}>count credits</p>


                                                                                // if credits are being counted, display 'counting...' message. 
                                                                                // once credit count is in state it will be displayed.
                                                                           :    creditCount === 'counting' ? <p>counting...</p>
                                                                                                           : <p>{creditCount} stunt credits</p>
                                                                
                                                            } */}
                                                        </div>
                        }

                        {/* The Phone Row – click the icon to call the number or click the number copy it. */}
                        <div className='adminPerformerContactRow'>
                            <a href={'tel:+'+phone.replaceAll('-','')}>
                                <img className='adminPerformerIcon' alt='phone icon' src={phoneIcon} />
                            </a>
                            <p onClick={() => navigator.clipboard.writeText(phone)}
                                    style={{cursor: 'copy'}}
                            >{phone}</p>
                        </div>


                        {/* The Email Row – click the icon to reveal an email form or click the address to copy it. */}
                        <div className='adminPerformerContactRow'>
                            <img className='adminPerformerIcon' alt='email icon' onClick={() => setEmailStatus(emailStatus => !emailStatus)} src={emailIcon} />
                            <p onClick={() => navigator.clipboard.writeText(email)}
                                    style={{cursor: 'copy'}}
                            >{email}</p>
                        </div>

                    </div>


                    {/* Layer 7: The Email Form – appears when email icon is clicked. */}
                    {  emailStatus && emailForm(performer_id, email, emailStatus, setEmailStatus, null, null)  }

                </div>

            </li>
        ) 
    }

    return (
        <>  
            {/* black-background header that's fairly self-explanatory */}
            <div className='adminPerformerKey' >

                <div className='adminPerformerGrid'> 
                   
                    <p className='adminPerformerGridItem' style={{paddingLeft: '.5em'}}>HS</p>
                    <p className='adminPerformerGridItem' style={{paddingLeft: '.5em'}}>BS</p>
                    <p className='adminPerformerGridItem'>name</p>
                    <p className='adminPerformerGridItem'>weight</p>
                    <p className='adminPerformerGridItem'>height</p>
                    <p className='adminPerformerGridItem'>age</p>
                    
                    {/* groupMail icon to summon or banish email-all form */}
                    <div onClick={clickEnvelope} className='groupMailIcon' >   
                        {
                            // if group mail is open, display open envelope icon. if closed, display closed envelope icon.
                            !groupMail ? <img alt='closed envelope icon' src={mailClosedIcon} style={{height: '40%'}} />
                                       : <img alt='open   envelope icon' src={mailOpenIcon  } style={{height: '40%'}} />
                        }
                    </div>

                </div>

                {/* The Email-All Form – appears when groupMail icon is clicked. */}
                <div style={{paddingTop: groupMail && '5vh'}}>
                {  groupMail && emailForm(  'groupMail', 
                                             groupEmails, 
                                             groupMail, 
                                             setGroupMail, 
                                             {  color:'white', 
                                                borderBottom: '2px white ridge'
                                             },
                                             {  boxShadow: 'rgba(255, 255, 255, 0.35) 0px -50px 36px -28px inset' }
                                         ) 
                }
                </div>

            </div>

           {/*  list of performers */}
           {    currentData.length !==0                       &&
                currentData[0].hasOwnProperty('performer_id') && currentData.map((performer, index) => makePerformer( performer, index ))
           }

           { floatingNotification }
        </>
    )
}

  



