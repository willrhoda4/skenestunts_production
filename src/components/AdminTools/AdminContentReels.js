







import                       './AdminTools.css';


import AdminFormReels   from './AdminFormReels.js';
import AdminButtons     from './AdminButtons.js';

import { useState }     from 'react';





export default function Reel ({currentData, loadData, table, pkName, columns, url}) {



    const [  expanded,  setExpanded  ] = useState(false);


    // creates a list item for each reel
    function makeReel (title, caption, embedCode, id, rank, index) {


        // packaages data for AdminFormReels for updates.
        const reelData = [ title, caption, embedCode, id ]

        return (
            <li className='adminItem'
                      key={index}
            >       
                <div className='adminReelHeading'>

                        <p>{title}</p>
                        <AdminButtons   id={id}
                                        url={url}
                                        rank={rank}
                                        index={index}
                                        table={table}
                                        pkName={pkName}
                                        data={currentData}
                                        loadData={loadData}
                                        expanded={expanded}
                                        setExpanded={setExpanded}
                        />

                </div>

                {  expanded === id &&  <>
                                            <div style={{padding: '10%'}}>
                                                {/* injects YouTube/Vimeo code from database */}
                                                <div className='playerDiv' dangerouslySetInnerHTML={{__html: embedCode}} />
                                            </div>

                                            <p style={{padding: '5vmin'}}>{caption}</p>

                                            <AdminFormReels     loadData={loadData}
                                                                   table={table}
                                                                  pkName={pkName}
                                                                 columns={columns}
                                                                  update={reelData}
                                                                     url={url}
                                            />
                                        </>
                }
       
            </li>
        )
    }

    return (
        
        <>
        { currentData.length !==0 &&
          currentData[0].hasOwnProperty('reel_id')   &&   currentData.map((reel, index) => makeReel(     reel.title,
                                                                                                          reel.caption,
                                                                                                          reel.embed_code,
                                                                                                          reel.reel_id,
                                                                                                          reel.rank,
                                                                                                          index
                                                                                                    )
                                                        )
        }
        </>
    )
}
