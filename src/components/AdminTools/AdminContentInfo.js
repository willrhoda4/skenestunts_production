




import AdminFormFAQ    from './AdminFormFAQ.js';
import AdminButtons     from './AdminButtons';

import { useState }     from 'react';






export default function Info  ({    url,
                                    table,
                                    pkName, 
                                    columns,
                                    loadData, 
                                    currentData 
                              }) {


                                

    const [  expanded,  setExpanded  ] = useState(false);



    // generates a list item for each FAQ using data from the database.
    function makeFAQ (question, answer, id, rank, cssId, key) {
        

        // adds a question mark to the end of the question if it doesn't already have one.
        if (question.at(-1) !== '?') { question = question.concat('?'); }

        return (

            <li className='adminItem'
                      key={key}
            >                    
                    <div className='adminFAQ, flexColumn' style={{maxWidth: '100%', marginLeft: '2vw', overflow: 'hidden'}}>
             
                        <p className='headline' >{question}</p>

                        <AdminButtons           
                            id={id}
                            url={url}
                            cssId={cssId}
                            data={currentData}
                            rank={rank}
                            index={key}
                            table={table}
                            pkName={pkName}
                            loadData={loadData}
                            expanded={expanded}
                            setExpanded={setExpanded}
                        />

                    </div>


                {  expanded === id &&  <> 

                                            <AdminFormFAQ     
                                                table={table}
                                                pkName={pkName}
                                                update={[question, answer, cssId, id]}
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
          currentData[0].hasOwnProperty('faq_id') &&  currentData.slice(0,-2).map((faq, index) => makeFAQ ( faq.question,
                                                                                                            faq.answer,
                                                                                                            faq.faq_id,
                                                                                                            faq.rank,
                                                                                                            faq.css_id,
                                                                                                            index
                                                                                                          )
                                                                                 ) 
        }
        {   currentData.length !== 0 && 
            currentData.at(-1).hasOwnProperty('value') && <div id='quoteWrapper'>
                                                                <p>{currentData.at(-2).value}</p>
                                                                <p>{currentData.at(-1).value}</p>
                                                           </div>
        }
        </>
    )
}