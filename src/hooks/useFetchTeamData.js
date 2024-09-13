





import { useEffect } from 'react';


// this hook is used to fetch data for the team and board components. I
// it takes three arguments: getData, setBoardData, and setTeamData. 
// getData is a function that fetches data from the database, 
// setBoardData and setTeamData are functions that set the state of the board and team components, respectively. 
// the hook fetches data for the board and team components and sets the state of the board and team components using the setBoardData and setTeamData functions.
export const useFetchTeamData = (getData, setBoardData, setTeamData) => {


    useEffect(() => {

        // columns for the board and team tables
        const basicColumns = [
            'legal_name', 'title', 'imdb_id', 'uploaded_image', 'image_id', 'image_alt', 
            'no_posters', 'poster_1', 'poster_2', 'poster_3', 'poster_4', 'poster_5', 'publish',
        ];

        // extra columns for the board table
        const extraColumns = [
            'profile', 'attribute_1', 'attribute_2', 'attribute_3', 'poster_6', 'poster_7', 'poster_8', 
            'poster_9', 'poster_10',
        ];

        // columns for the board and team tables
        const teamColumns  = basicColumns.join(', ');
        const boardColumns = basicColumns.concat(extraColumns).join(', ');

        getData(['board', [['publish', true]], { orderBy: 'rank', columns: boardColumns }])
            .then(res => setBoardData(res.data))
            .catch(err => console.log(err));

        getData(['team', [['publish', true]], { orderBy: 'rank', columns: teamColumns }])
            .then(res => setTeamData(res.data))
            .catch(err => console.log(err));

    }, [ getData, setBoardData, setTeamData ] );
};
