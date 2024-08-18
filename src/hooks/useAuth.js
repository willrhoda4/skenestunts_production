G







import { useState, 
         useEffect } from 'react';
import   jwtDecode   from 'jwt-decode';
import   Axios       from 'axios';






// Utility function to get JWT from cookies
function getJwtToken () {

    const  token = document.cookie.split('; ')
                                  .find(row => row.startsWith('jwt='));
   
    return token ? token.split('=')[1] 
                 : null;
};


// Utility function to check if JWT is expired
function isTokenExpired ( token ) {
    
    try       {
                const  decoded = jwtDecode(token);
                return decoded.exp < Date.now() / 1000;
              } 
    catch (e) { return true }

};




export function useAuth () {


    // state to keep track of token and force re-renders
    const [ hasToken, setHasToken ] = useState( false );


    // when the component mounts, set hasToken to true if token is valid
    useEffect(() => {

        const token = getJwtToken();

        if ( token && !isTokenExpired( token ) ) setHasToken( true );

    }, []);





    // function to check if token is valid
    // for conditional rendering
    const jwtStatus = () => {

        // get the token from cookies
        const token = getJwtToken();
        
        // if no token, return 'invalid'
        if ( !token ) return  'invalid';

        // if token is expired, return 'expired'
        if ( isTokenExpired( token ) ) return 'expired';
        
        // if token is valid, return 'valid'
        return 'valid';
    };

    // helper to update or delete token
    // we pass this to PasswordChecker and ResetPassword
    // and also use it in the Axios interceptor
    function  updateJwt ( action = 'refresh' ) {
      
        // if 'delete' is passed, clear the cookie and set hasToken to false
        if (action === 'delete') {

            document.cookie = 'jwt=; Max-Age=0';
            return  setHasToken( false );

        // otherwise assume 'refresh' and check if token is valid
        } else {

            const token = getJwtToken();
            setHasToken( !!token && !isTokenExpired( token ) );
        }
    };


    // intercept Axios responses to handle 401 errors globally.
    useEffect(() => {

        const interceptor = Axios.interceptors.response.use(

            // if the response is good, return it as is.
            response => response,
            
            // if the response is an error, that complicates things.
            error => {

                
                // check if it's a 401.
                if ( error.response && 
                     error.response.status === 401 ) {
                                                        // if it is, invalidate the token and update state.
                                                        updateJwt( 'delete' );
                                                        setHasToken( false );
                                                     }   
                // then return the error for further handling.
                return Promise.reject( error );
            }
        );

        // return a cleanup function to remove the interceptor
        return () => Axios.interceptors.response.eject( interceptor );

    }, []);

    // return the token condition and update function
    return [ getJwtToken, jwtStatus, updateJwt ];
};
