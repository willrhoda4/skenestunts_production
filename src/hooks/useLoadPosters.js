





import { useEffect } from 'react';
import   Axios       from 'axios';

import   CloudImage from '../components/CloudImage';



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

                // team members have 5 poster, board members have 10
                const posterClass = posters.length > 5 ? 'boardPoster' : 'teamPoster';

                // get the poster data from the database
                return Axios.post(`${process.env.REACT_APP_API_URL}getDoublesPosters`, [ 'poster_id', posters ] )
                            .then( res => 
                                    
                                    // generate an array of poster images 
                                    // and append the imdb_id for the sake of the profile component
                                    res.data.map( poster => (
                                                                <CloudImage
                                                                    id={  poster.cloudinary_id               }
                                                                    key={ poster.poster_id                   }
                                                                    alt={ 'movie poster for ' + poster.title }
                                                                    // className={ posterClass                  }
                                                                />
                                                            )
                                                )
                                         .concat( [ state[ index ].imdb_id ] ) )

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
