







import                     './AdminTools.css'
import { useEffect,
         useState   } from 'react';


// this is the mold that all admin pages are poured into.
export default function AdminView({ url,
                                    data,
                                    table, 
                                    pkName,
                                    update,
                                    gopher,
                                    getData,
                                    columns, 
                                    posters, 
                                    loadData, 
                                    AdminForm, 
                                    Generator,
                                    adminStatus, 
                                    boardMember,
                                    currentData, 
                                    setCurrentData, 
                                    performerOptions    }) {

                                        
    const [  sorted,       setSorted       ] = useState(false);
    
   // adds and removes page top/bottom header/footer to the admin data viewer.
   // stores sorted state in the sorted variable.
    useEffect(() => {

        ( table === 'posters' ||
          table === 'profile' ||
          table === 'misc'    ||
          table === 'performers' ) ? setSorted(false)
                                   : setSorted(true);

    }, [table])



    return(
            <div id='adminContent'>

                {/* Left/Top half of page, presents a form to add data to database,
                    or manipulate what's diosplayed on the other half of the page. */}
                <div id='adminFormWrapper'>
                    <AdminForm             loadData={loadData} 
                                        currentData={currentData}
                                     setCurrentData={setCurrentData}
                                              table={table}
                                             update={update}
                                             pkName={pkName}
                                            columns={columns}
                                            getData={getData}
                                   performerOptions={performerOptions}
                                        adminStatus={adminStatus}
                                             gopher={gopher}
                                            posters={posters}
                                                url={url}
                    />
                </div>


                {/* Right/Bottom half of page, the questionably named generator
                    component displays data from database for admin consideration. */}
                <ul id='adminDataViewer'>
                    { sorted && <li className='pageEndH3'><h3>Page Top</h3></li>    }
                    <Generator     loadData={loadData}
                                currentData={currentData} 
                                      table={table}
                                       data={data}
                                    columns={columns}
                                     pkName={pkName}
                                adminStatus={adminStatus}
                                boardMember={boardMember}
                                    posters={posters} 
                                     gopher={gopher}
                                        url={url}                      
                    />
                    { sorted &&  <li className='pageEndH3'><h3>Page Bottom</h3></li> }
                </ul>
            </div>
    )
}  



