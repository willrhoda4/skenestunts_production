





import { useEffect, useState } from 'react';

import Notification from '../Notification';



export default function AdminContentMisc ({currentData}) {




    const [ backgroundId,       setBackgroundId     ] = useState(false);
    const [ constructionMode,   setConstructionMode ] = useState(false);




    // retrieves reference to current backvround for display and sets the backgroundId state.
    useEffect(() => {

        const id = currentData.find(row => row.description === 'background');

        id !== undefined && setBackgroundId(id.value);

    }, [currentData])




    // retrieves reference to current construction mode for display and sets the constructionMode state.
    useEffect(() => {

        const currentMode = currentData.find(row => row.description === 'construction_mode');

        currentMode !== undefined && setConstructionMode(currentMode.active);

    }, [currentData])




    return (<>
    

        <img   alt='demo background'
                                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                        src={'https://drive.google.com/uc?export=view&id='+backgroundId }
                                 />

        {
            constructionMode ? <Notification type='bad'  msg='While construction mode is engaged, skenestunts.com is not be available to the public. Use the checkbox in the adjacent form to turn it off.' />
                             : <Notification type='good' msg='skenestunts.com is currently open for business.' />
        }
        
    </>)
    
}