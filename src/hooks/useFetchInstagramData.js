




import { useEffect,
         useState  } from 'react';
import   Axios       from 'axios';

// this hook is used to fetch Instagram data from the Instagram Graph API.
// it's been significantly simplified since its original implementation,
// and now it simply fetches the current instagram token from the database,
// then uses that token to fetch the Instagram data annd store it in state.
// refreshing the token is now handled by a GitHub Action that runs every 50 days.
export const useFetchInstagramData = ( getData, setPhotoData ) => {



    const [ instaToken, setInstaToken ] = useState('');


    // graamGetter is the URL to get the Instagram data
    const gramGetter  = `https://graph.instagram.com/v17.0/8830259350403033/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${instaToken}`;
    

    useEffect(() => { 
    

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
                    
                })
                 .catch(error => console.error("Error refreshing Instagram token:", error));
        }
    }, [ getData, gramGetter, instaToken, setInstaToken, setPhotoData ]);
};
