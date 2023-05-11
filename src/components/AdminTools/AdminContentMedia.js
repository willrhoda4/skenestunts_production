




import AdminFormMedia from './AdminFormMedia.js';
import AdminButtons from './AdminButtons';

import { useState } from 'react';

import logo         from '../../images/logo.png'





export default function Media ({currentData, loadData, table, pkName, columns, url}) {




    const [  expanded,  setExpanded  ] = useState(false);



    // generates a list item for each media item using data from the database.
    function makeStory (headline, date, outlet, url, image, alt, id, rank, index) {


        // packages data for the AdminFormMedia component
        const mediaData = [ headline, date.slice(0,10), outlet, url, image, alt, id ]

        // formats the date for display
        const options   = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const storyDate = new Date(date).toLocaleDateString('en-EN', options);



        return (

            <li className='adminItem'
                      key={index}
            >                    
                <div className='adminMediaItem'>

                    {/* defaults to Skene Stunts logo if no image url is available */}
                    { image !== 'logo' ? <img className='adminMediaImage' alt={alt} src={image} />
                                       : <img className='adminMediaImage logo' alt='Skene Stunts logo' src={logo} />
                    }

                    <div className='adminMediaFacts'>

                        <div>
                            {/* headlines are capitalized for consistency */}
                            <p  style={{maxWidth: '100%'}}>{headline.toUpperCase()}</p>
                            <p><b>{storyDate}</b></p>
                            <p>{outlet}</p>
                        </div>

                        <AdminButtons           
                            id={id}
                            url={url}
                            data={currentData}
                            rank={rank}
                            index={index}
                            table={table}
                            pkName={pkName}
                            loadData={loadData}
                            expanded={expanded}
                            setExpanded={setExpanded}
                        />

                    </div>

                </div>

                {  expanded === id &&  <>
                                            

                                            <AdminFormMedia     
                                                table={table}
                                                pkName={pkName}
                                                update={mediaData}
                                                columns={columns}
                                                loadData={loadData}
                                            />
                                        </>
                }
                                
            </li>
        )
    }

    return (

        <>
        { currentData.length !== 0 && 
          currentData[0].hasOwnProperty('article_id') &&  currentData.map((story, index) => makeStory(   story.headline, 
                                                                                                         story.date, 
                                                                                                         story.outlet,
                                                                                                         story.article_url,
                                                                                                         story.image_url,
                                                                                                         story.image_description,
                                                                                                         story.article_id,
                                                                                                         story.rank,
                                                                                                         index
                                                                                                     )
                                                    ) 
        }
        </>
    )
}