




import { useEffect, 
         useState }    from 'react'


import   Notification from '../Notification';
import   CloudImage   from '../CloudImage';


export default function Profile ({currentData = [], posters}) {     




    const   [ posterBank, setPosterBank ] = useState([]);


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
    
    // if data and posters are both defined,
    // concats poster arrays into single array of arrays, 
    // searches the array for the array with the imdb_id at its last index that matches data.imdb_id,
    // and sets the posters state to the array of posters that matches the imdb_id
    useEffect(() => {


        if (email && posters)  {        

            const allPosters    = [].concat(posters[0],posters[1]); 

            const doubleIndex   = allPosters.findIndex( arr => arr.at(-1) === imdb_id);

            if (doubleIndex === -1) return;

            const doublePosters = allPosters[doubleIndex];

                                    // removes the imdb_id from the array of posters
            setPosterBank(doublePosters.slice(0, -1).map( poster => {
                                    
                return <img
                                  key={poster.key}
                                  src={poster.props.src}
                            className={'adminTeamPoster'}
                                  alt={poster.props.alt}
                       />
           }));
            
        } 

    }, [currentData, email, imdb_id, posters])
            
   

    return ( 
            userData && <>
                {/* display photo at top of profile */}
                    <CloudImage id={image_id} wrapClass='adminPerformerProfile' />

                <p>{image_alt}</p>

                {/* display name, title, and IMBD ID and email for all team/board members */}
                <table className='adminPerformerTable'>
                    <tbody>
                        <tr>
                            <td><h5 className='adminPerformerAttribute'>name:</h5></td> 
                            <td><p  className='adminPerformerAttribute'>{legal_name}</p></td>
                        </tr>
                        <tr>
                            <td><h5 className='adminPerformerAttribute'>title:</h5></td> 
                            <td><p  className='adminPerformerAttribute'>{title}</p></td>
                        </tr>
                        <tr>
                            <td><h5 className='adminPerformerAttribute'>IMBD ID:</h5></td> 
                            <td><p  className='adminPerformerAttribute'> {imdb_id}</p></td>
                        </tr>      
                        <tr>
                            <td><h5 className='adminPerformerAttribute'>email:</h5></td>
                            <td><p  className='adminPerformerAttribute'> {email}</p></td>
                        </tr>
                    </tbody>
                </table>

                {   currentData.profile && <>


                      
                        {/* display the following additional properties for board members */}
                        <table className='adminPerformerTable'>
                            <tbody>
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>profile:</h5></td>
                                    <td><p  className='adminPerformerAttribute'> {profile}</p></td>
                                </tr>
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Attribute 1:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{attribute_1}</p></td>
                                </tr>
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Attribute 2:</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{attribute_2}</p></td>
                                </tr>
                                <tr>
                                    <td><h5 className='adminPerformerAttribute'>Attribute_3</h5></td> 
                                    <td><p  className='adminPerformerAttribute'>{attribute_3}</p></td>
                                </tr>  
                            </tbody>    
                        </table>

                </> }

                
                {/* display the posters for the team member, as long as admin doesn't have no_posters engaged. */}
                <div className='adminTeamPosterRack'>
                    { !no_posters && posterBank.map(poster => poster) }                       
                </div>


                {   publish   ?   <Notification type='good' msg='Your profile is currently live!' />
                              :   <Notification type='wait' msg='Activate the publish toggle to put your profile online' />
                }
            </>
    )
}