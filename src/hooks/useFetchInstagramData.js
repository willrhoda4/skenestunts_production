




import { useEffect } from 'react';
import   Axios       from 'axios';

// this hook is used to fetch Instagram data from the Instagram Graph API.
export const useFetchInstagramData = ( getData, instaToken, setInstaToken, setPhotoData ) => {


    useEffect(() => {

        // graamGetter is the URL to get the Instagram data
        // tokenGetter is the URL to refresh the Instagram token 
        const gramGetter  = `https://graph.instagram.com/me/media?fields=media_url,media_type&access_token=${instaToken}`;
        const tokenGetter = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${instaToken}`;


        // if there is no Instagram token, get it from the database
        if ( !instaToken ) {

            getData( [ 'misc', [ [ 'description', 'insta_token' ] ] ]               )
              .then(  res => setInstaToken( res.data[0].value )                     )           
             .catch(  err => console.error( "Error getting Instagram token:", err ) );
       
        } else {

            // if there is an Instagram token, get the Instagram data
            Axios.get( gramGetter )
                .then( res => {

                    // filter out videos and set the photo data state.
                    setPhotoData( res.data.data.filter( pic => pic.media_type !== 'VIDEO' ) );
                    
                    // next, refresh the Instagram token
                    return Axios.get( tokenGetter );
                })
                .then( res => { 

                    const nuToken = res.data.access_token;


                    if (res.data.access_token.length > 0) {
                        return Axios.put(`${process.env.REACT_APP_API_URL}updateIGToken`, { nuToken } );
                    }
                })
                .catch(error => console.error("Error refreshing Instagram token:", error));
        }
    }, [getData, instaToken, setInstaToken, setPhotoData]);
};
