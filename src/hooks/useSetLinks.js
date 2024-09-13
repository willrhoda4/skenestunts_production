





// hooks/useSetLinks.js
import { useEffect } from 'react';


// This hook sets the links that are displayed in the navigation bar based on the current location and the admin status.
export const useSetLinks = (location, adminStatus, setLinks) => {

    useEffect(() => {
        if (location.pathname !== '/director') {
            setLinks(['info', 'contact', 'gallery', 'reels', 'media', 'team']);
        } else if (adminStatus) {
            setLinks(['misc', 'info', 'reels', 'media', 'board', 'team', 'posters', 'performers']);
        } else {
            setLinks(['profile', 'posters', 'performers']);
        }
    }, [adminStatus, location.pathname, setLinks]);
};
