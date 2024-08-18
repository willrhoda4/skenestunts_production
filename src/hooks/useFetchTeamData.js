// hooks/useFetchTeamData.js
import { useEffect } from 'react';

export const useFetchTeamData = (getData, setBoardData, setTeamData) => {
    useEffect(() => {
        const basicColumns = [
            'legal_name', 'title', 'imdb_id', 'uploaded_image', 'image_url', 'image_id', 'image_alt', 
            'no_posters', 'poster_1', 'poster_2', 'poster_3', 'poster_4', 'poster_5', 'publish',
        ];

        const extraColumns = [
            'profile', 'attribute_1', 'attribute_2', 'attribute_3', 'poster_6', 'poster_7', 'poster_8', 
            'poster_9', 'poster_10',
        ];

        const teamColumns = basicColumns.join(', ');
        const boardColumns = basicColumns.concat(extraColumns).join(', ');

        getData(['board', [['publish', true]], { orderBy: 'rank', columns: boardColumns }])
            .then(res => setBoardData(res.data))
            .catch(err => console.log(err));

        getData(['team', [['publish', true]], { orderBy: 'rank', columns: teamColumns }])
            .then(res => setTeamData(res.data))
            .catch(err => console.log(err));
    }, [getData, setBoardData, setTeamData]);
};
