



import { useState, 
         useEffect }  from 'react';
import Notification from '../components/Notification'; 



export default function useFloatingNotification() {

    const [ notification,   setNotification ] = useState(null); // { msg, type }
    const [ fading,         setFading       ] = useState(false);

    // automatically handle fading and disappearing of notifications
    useEffect(() => {

        if ( notification ) {

            // Fade out after 5 seconds
            const fadeTimeout       = setTimeout(() =>   setFading(true),          5000 ); 
            // Clear notification after fade
            const clearNotification = setTimeout(() => { setFading(false);
                                                         setNotification(null); }, 5500 );

            return () => {
                clearTimeout(fadeTimeout);
                clearTimeout(clearNotification);
            };
        }

    }, [ notification ] );


    // function to trigger a new notification
    // default to 'good' type,
    const newNotification = ( msg, type = 'good' ) => setNotification( { msg, type } );


    // renderable JSX for the notification
    const FloatingNotification = notification && <div className={fading ? 'floatingNotification fading' 
                                                                        : 'floatingNotification'
                                                                }
                                                 >
                                                    <Notification type={notification.type} msg={notification.msg} />
                                                 </div>;

    return [ newNotification, FloatingNotification ];
}
