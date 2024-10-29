





import { useEffect } from 'react';
import   Axios       from 'axios';




// custom hook to load the posters for the board and team members
export function useLoadPosters ( boardData, boardPosters, setBoardPosters, teamData, teamPosters, setTeamPosters) {
    
    
    useEffect(() => {

    
        function getPosters( state, setter ) {
    
            // declare an array to hold all the array poster images
            let   allPosters   = [];

            // get the poster ids from the state
            const teamPosters  = state.map( member => {

                const  posters = Object.keys(   member   )
                                       .filter( prop   => prop.startsWith( 'poster_' ) )
                                       .map(    prop   => member[ prop ] );
                return posters;
            } );


            const promises = teamPosters.map( ( posters, index ) => {


                // get the poster data from the database
                return Axios.post(`${process.env.REACT_APP_API_URL}getDoublesPosters`, [ 'poster_id', posters ] )
                            .then( res => 
                                    
                                    // and append the imdb_id for the sake of the profile component
                                    res.data.concat( [ state[ index ].imdb_id ] ) )

                            .catch(err => console.log(err));
            });

            // when all the promises have resolved, set the state
            Axios.all(  promises )
                 .then( responses => {
                                          responses.forEach( posterArr => { allPosters = allPosters.concat( [ posterArr ] ); } );
                                          setter( allPosters );
                                     }
                      )
                .catch( err => console.log( err ) );
        
        }


        // if the boardData or teamData has been loaded, but the posters have not, get the posters
        if ( boardData && !boardPosters ) getPosters( boardData, setBoardPosters );
        if ( teamData  && !teamPosters  ) getPosters( teamData,  setTeamPosters  );
    
    }, [ boardData, boardPosters, setBoardPosters, teamData, teamPosters, setTeamPosters ] );
};
