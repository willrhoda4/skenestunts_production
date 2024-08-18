// hooks/useLoadPosters.js
import { useEffect } from 'react';
import Axios from 'axios';

export const useLoadPosters = (boardData, boardPosters, setBoardPosters, teamData, teamPosters, setTeamPosters) => {
    useEffect(() => {
        function getPosters(state, setter) {
            let allPosters = [];

            const teamPosters = state.map(member => {
                const posters = Object.keys(member).filter(prop => prop.startsWith('poster_')).map(prop => member[prop]);
                return posters;
            });

            const promises = teamPosters.map((posters, index) => {
                const boardMember = posters.length > 5;

                return Axios.post(`${process.env.REACT_APP_API_URL}getDoublesPosters`, ['posters', 'poster_id', posters])
                    .then(res => res.data.map(poster => (
                        <img
                            key={poster.poster_id}
                            src={poster.image_url}
                            className={boardMember ? 'boardPoster' : 'teamPoster'}
                            alt={'movie poster for ' + poster.title}
                        />
                    )).concat([state[index].imdb_id]))
                    .catch(err => console.log(err));
            });

            Axios.all(promises)
                .then(responses => {
                    responses.forEach(posterArr => { allPosters = allPosters.concat([posterArr]); });
                    setter(allPosters);
                })
                .catch(err => console.log(err));
        }

        if (boardData && !boardPosters) getPosters(boardData, setBoardPosters);
        if (teamData && !teamPosters) getPosters(teamData, setTeamPosters);
    }, [boardData, boardPosters, setBoardPosters, teamData, teamPosters, setTeamPosters]);
};
