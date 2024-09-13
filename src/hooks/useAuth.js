




import { useState, 
         useEffect } from 'react';

import   Axios       from 'axios';


// this hook is used to manage the user's authentication status on the front-end.
// it's functionally a useState hook with a built-in interceptor to handle token errors.
// (our API returns 401 errors for all token problems)
export function useAuth() {


    // role is the user's role, setRole is a function to update the role.
    const [ authRole, setAuthRole ] = useState(null); 

    // intercept Axios responses to handle 401 errors globally.
    useEffect(() => {

        const interceptor = Axios.interceptors.response.use(

            response => response,

            error    => {  
                
                // if the error is a 401, set the role to null.         
                if (error.response && error.response.status === 401) setAuthRole(null); 
                return Promise.reject(error);
            }
        );

        return () => Axios.interceptors.response.eject( interceptor) ;

    }, []);

    return [ authRole, setAuthRole ];
}
 