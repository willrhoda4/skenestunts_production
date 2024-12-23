







import { useState,
         useEffect }       from 'react';

import   AdminImageUpdater from './AdminImageUpdater';         
import   Checkbox          from '../FormFunctions/Checkbox';
import   Notification      from '../Notification';

import   Axios             from 'axios';




export default function AdminFormMisc ({ table, loadData, currentData, setCurrentData }) {


const [ constructionMode,       setConstructionMode   ] = useState(false);
const [ modeStatus,             setModeStatus         ] = useState(false);



//  sets the constructionMode state to the value of active in the construction_mode row of the misc table.
useEffect(() => {

   const currentMode = currentData.find(row => row.description === 'construction_mode');

   currentMode !== undefined && setConstructionMode(currentMode.active);

}, [currentData])











// updates the construction_mode row in the misc table.
const updateConstructionMode= (e) => {

   e.preventDefault();

   const changeMode = (newMode) => Axios.put( `${ process.env.REACT_APP_API_URL }updateData`,
                                                [ table, ['active'], [newMode], [ ['description', 'construction_mode'] ] ],
                                                { withCredentials: true }
                                            );

                                                   // throw up a notification to let the user know the mode is updating.
                                                   setModeStatus('updating');

                                                   // throw up a notification to let the user know the mode is updated, and reload the data.
   changeMode(constructionMode).then(  res => {    setModeStatus('updated' ); 
                                                   loadData(table); 
                                              } 
                                     )              // if there's an error, throw up a notification to let the user know.
                               .catch( err =>      setModeStatus('error'   ) );

}




return (<div className='adminForm'>

   <h2>Miscellaneous</h2>

   <form style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '80%', margin: '5vmin 0'}}>


        <AdminImageUpdater
              title={'New Background'     }
             folder={'background'         }
            imageId={'current_background' }
           loadData={ loadData            }
        />



       < Checkbox    
               name={'Construction Mode'}
               state={constructionMode}
               setter={setConstructionMode}
               onClick={() => setModeStatus(null)}
       />


       {
               modeStatus === 'updating' ? <Notification type='wait' msg='Switching modes . This should only take a second...' />
           :   modeStatus === 'error'    ? <Notification type='bad'  msg='There was an issue connecting with the database. Refresh the page and try agin.' />
           :   modeStatus === 'updated'  ? <Notification type='good' msg={ constructionMode ? 'Construction mode engaged'
                                                                                            : 'Construction mode disengaged'
                                                                         } />
           :                                null
       }
   
       <button className='formButton' type='button' onClick={updateConstructionMode}>Update</button>

       
   </form>


</div>)



}/*

*/  