





import promoteIcon      from '../../images/icon_arrowUp.svg';
import demoteIcon       from '../../images/icon_arrowDown.svg';
import editIcon         from '../../images/icon_edit.svg';
import deleteIcon       from '../../images/icon_trash.svg';
import sendIcon         from '../../images/icon_send.svg';
import linkIcon         from '../../images/icon_link.svg';

import Axios            from 'axios';  



export default function AdminButtons ({ id,
                                        rank, 
                                        data, 
                                        index,
                                        email, 
                                        table,
                                        cssId,
                                        pkName,
                                        loadData,
                                        expanded, 
                                        boardMember,
                                        setExpanded,
                                        setFloatingNotification, }) {


   


    // reveals or hides the form for editing the item.
    function showForm () {
        expanded !== id ? setExpanded(id)
                        : setExpanded(false);
    }



    // determines which table to use for the delete and reRank functions.
    let reqTable = table === 'info' ? 'faq' : table;



    // deletes item from database.
    function deleteItem () {   

        // prevents the user from deleting the advice faq.
        if (table === 'info' && cssId === 'advice') { return window.alert(`You can't delete this FAQ!`); }

        let warning = 'Are you sure you want to delete this item from the database?';

        window.confirm(warning) &&  Axios.post(`${process.env.REACT_APP_API_URL}deleteData`,  [ reqTable, pkName, id, rank ])
                                         .then(res => {     loadData(table)    });   
    }



    // moves the item down one in the database
    function demoteItem () {

                
        Axios.post(`${process.env.REACT_APP_API_URL}reRankData`,  [ reqTable, pkName, id, rank, rank-1 ] )  
             .then(  res => {  loadData(table);  }                                                       )
             .catch( err => console.log(err)                                                             );  
  
    }


    // moves the item up one in the database
    function promoteItem () {

        
        Axios.post(`${process.env.REACT_APP_API_URL}reRankData`,  [ reqTable, pkName, id, rank, rank+1 ])
             .then(  res => { console.log(res); loadData(table); }                               )
             .catch( err => console.log(err)                                                     );  
     
    }


    // sends email to new team members with a link to the director's chair.
    function inviteTeam () {



        // called after a successful database update.
        // emails the invite link to the new board or team member.
        // dispalys a notification on response saying whether the email failed to send or succeeded.
        function inviteEmail (token) {


            // data for the email
            // note that pwTable isn't required here as the passwordReset component
            // is trained to check the team table if the board table doesn't have a match.
            const inviteBody = {    
                    fk:      'team_id',
                    type:    'resetEmail',
                    email:    email,
                    invite:   true,
                    origin:  '/director',
                    resetId:  id,
                    token:    token 
            };

            Axios.post(`${process.env.REACT_APP_API_URL}email`, inviteBody                      )
                 .then(  res =>   { console.log(res); setFloatingNotification('emailSent') ; }  )             
                 .catch( err =>   { console.log(err); setFloatingNotification('emailError'); }  );
        }

        // table to use for the database update
        const pwTable = table === 'board' ? 'board_passwords' : 'team_passwords';

        // data for the database update
        const reqBody = [  pwTable,  'team_id',  id, ];

        // warning message
        const warning = `Confirm that you're ok with sending this team member an invite to Skene Stunts Director's Chair`;


        window.confirm(warning) &&  Axios.post(`${process.env.REACT_APP_API_URL}registerReset`,  reqBody )
                                         .then( res =>   { 
                                                            const token = res.data[0].token;

                                                            // if the token is not a string, there was an error.
                                                            // if the token is a string, send the email.
                                                            if (typeof token !== 'string') { return setFloatingNotification('dataError'); }
                                                            else                           {        inviteEmail(token);                   }
                                                         } 
                                              )
                                        .catch( err =>     setFloatingNotification('emailError')                    );
     
    }


    // copies a link to the faq item to the clipboard
    function copyLink () {

        navigator.clipboard.writeText(`${process.env.REACT_APP_LINK_URL}info?faq=`+cssId);
    }


    
    return  <div className='adminItemButtons'>
                {/* Invite Team Member */}
                { (table === 'team'         ||
                   table === 'board')       &&  <button className='formButton adminButton' type="button" onClick={ () => inviteTeam()    }> {<img className='buttonIcon' alt=' icon' src={sendIcon}    />} </button>    }
                {/* Delete Item */}
                                                <button className='formButton adminButton' type="button" onClick={ () => deleteItem()    }> {<img className='buttonIcon' alt=' icon' src={deleteIcon}  />} </button>
                {/* Reveal Edit Form */}
                                                <button className='formButton adminButton' type="button" onClick={ () => showForm()      }> {<img className='buttonIcon' alt=' icon' src={editIcon}    />} </button>
                {/* Copy FAQ Link */}
                { table === 'info'         &&   <button className='formButton adminButton' type="button" onClick={ () => copyLink()      }> {<img className='buttonIcon' alt=' icon' src={linkIcon}    />} </button>    }
                {/* Promote Item */}
                { index !== 0               ?   <button className='formButton adminButton' type="button" onClick={ () => promoteItem()   }> {<img className='buttonIcon' alt=' icon' src={promoteIcon} />} </button>
                                            :   <div    className='formButton adminButton'><div className='buttonIcon' /></div>     
                }
                {/* Demote Item ---- workaround used here for info table as quote data is store at CurrentData's last two indexes*/}
                {  (  index === data.length -1   ) ||
                   (  table === 'info'      && 
                      index === data.length -3   )  ? <div className='formButton adminButton'><div className='buttonIcon' /></div> 
                                                    : <button className='formButton adminButton' type="button" onClick={ () => demoteItem()    }> {<img className='buttonIcon' alt=' icon' src={demoteIcon}  />} </button>          
                }

            </div>
}