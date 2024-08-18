// hooks/useCheckConstructionMode.js
import { useEffect } from 'react';

export const useCheckConstructionMode = (getData, setConstructionMode) => {
    useEffect(() => {
        getData(['misc', [['description', 'construction_mode']]])
            .then(res => setConstructionMode(res.data[0].active))
            .catch(err => console.log(err));
    }, [getData, setConstructionMode]);
};
