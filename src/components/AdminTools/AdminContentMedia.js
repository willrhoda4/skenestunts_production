




import   AdminFormMedia  from './AdminFormMedia.js';
import   AdminButtons    from './AdminButtons';

import { useState }      from 'react';

import   logo            from '../../images/logo_header.webp';
import   logoPNG         from '../../images/logo_header.png';
import   Picture         from '../../components/Picture.js'
import   CloudImage      from '../CloudImage.js';




export default function Media ( {currentData, loadData, table, pkName, columns} ) {




    const [  expanded,  setExpanded  ] = useState(false);



    // generates a list item for each media item using data from the database.
    function makeStory (headline, date, outlet, url, image, alt, id, rank, index) {


        // packages data for the AdminFormMedia component
        const mediaData = [ headline, date.slice(0,10), outlet, url, null, alt, id ]
                                                                    // pass null for image to prevent the form loading a cloudinary id
                                                                    // in lieu of the image url it originated from 
                                                                    // (which is no longer relevant and therfore no longer stored).

        // formats the date for display
        const options   = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const storyDate = new Date(date).toLocaleDateString('en-EN', options);



        return (

            <li className='adminItem'
                      key={index}
            >                    
                <div className='adminMediaItem'>

                    {/* defaults to Skene Stunts logo if no image url is available */}
                    { image !== 'logo' ? <div className='adminMediaImage'>
                                            <CloudImage id={image} alt={alt} />
                                         </div>
                                       : <div className='adminMediaImage' style={{ background: 'black' }}>
                                            <Picture
                                                      src={logo}
                                                 fallback={logoPNG}
                                                className={'storyImage logo'}
                                                     type='image/webp'
                                                      alt='Skene Stunts company logo'
                                                       id='footerLogo'
                                            />
                                         </div>
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
                                                                                                         story.image_id,
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