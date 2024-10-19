import React, { useEffect, useState } from 'react';
import Notification from '../Notification';
import CloudImage from '../CloudImage';



export default function Profile({ currentData = [], posters }) {

    const [posterBank, setPosterBank] = useState([]);

    // Ensure that currentData[0] exists before destructuring
    const userData = currentData[0] || {};

    const {
        title,
        email,
        profile,
        publish,
        imdb_id,
        image_id,
        image_alt,
        legal_name,
        no_posters,
        attribute_1,
        attribute_2,
        attribute_3
    } = userData;

    useEffect(() => {
        if (email && posters) {
            console.log('posters =>', posters);

            const allPosters = [].concat(posters[0], posters[1]);
            console.log('all posters => ', allPosters);

            const doubleIndex = allPosters.findIndex(arr => arr.at(-1) === imdb_id);
            console.log('double index => ', imdb_id, doubleIndex);

            if (doubleIndex === -1) return;

            const doublePosters = allPosters[doubleIndex];
            console.log('double posters => ', doublePosters);

            setPosterBank(doublePosters.slice(0, -1).map(poster => {
                return (
                    <img
                        key={poster.key}
                        src={poster.props.src}
                        className={'adminTeamPoster'}
                        alt={poster.props.alt}
                    />
                );
            }));
        }
    }, [currentData, email, imdb_id, posters]);

    if (!userData || !Object.keys(userData).length) {
        // If userData is undefined or empty, show a loading or error message
        return <div>Loading...</div>;
    }

    return (
        currentData[0] && <>
            <CloudImage id={image_id} wrapClass='adminPerformerProfile' />
            <p>{image_alt}</p>

            <table className='adminPerformerTable'>
                <tbody>
                    <tr>
                        <td><h5 className='adminPerformerAttribute'>name:</h5></td>
                        <td><p className='adminPerformerAttribute'>{legal_name}</p></td>
                    </tr>
                    <tr>
                        <td><h5 className='adminPerformerAttribute'>title:</h5></td>
                        <td><p className='adminPerformerAttribute'>{title}</p></td>
                    </tr>
                    <tr>
                        <td><h5 className='adminPerformerAttribute'>IMDB ID:</h5></td>
                        <td><p className='adminPerformerAttribute'>{imdb_id}</p></td>
                    </tr>
                    <tr>
                        <td><h5 className='adminPerformerAttribute'>email:</h5></td>
                        <td><p className='adminPerformerAttribute'>{email}</p></td>
                    </tr>
                </tbody>
            </table>

            {profile && (
                <>
                    <table className='adminPerformerTable'>
                        <tbody>
                            <tr>
                                <td><h5 className='adminPerformerAttribute'>profile:</h5></td>
                                <td><p className='adminPerformerAttribute'>{profile}</p></td>
                            </tr>
                            <tr>
                                <td><h5 className='adminPerformerAttribute'>Attribute 1:</h5></td>
                                <td><p className='adminPerformerAttribute'>{attribute_1}</p></td>
                            </tr>
                            <tr>
                                <td><h5 className='adminPerformerAttribute'>Attribute 2:</h5></td>
                                <td><p className='adminPerformerAttribute'>{attribute_2}</p></td>
                            </tr>
                            <tr>
                                <td><h5 className='adminPerformerAttribute'>Attribute 3:</h5></td>
                                <td><p className='adminPerformerAttribute'>{attribute_3}</p></td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

            <div className='adminTeamPosterRack'>
                {!no_posters && posterBank}
            </div>

            {publish ? (
                <Notification type='good' msg='Your profile is currently live!' />
            ) : (
                <Notification type='wait' msg='Activate the publish toggle to put your profile online' />
            )}
        </>
    );
}


