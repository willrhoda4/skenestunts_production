







import                          './AdminTools.css';
import   FAQForm           from './AdminFormFAQ.js';
import   QuoteForm         from './AdminFormQuote.js';
import   AdminImageUpdater from './AdminImageUpdater.js';

// since there's a lot happening on the info page,
// this simple scripts only real job is to render the FAQ and Quote forms.
export default function InfoForm({  
                                    table,
                                    pkName,
                                    update, 
                                    columns, 
                                    loadData, 
                                    currentData, 
                                    setCurrentData  
                                }) {



    return(

        <>

<div id='teamshotUpdater' className='adminForm'>
            <AdminImageUpdater
                   title={'New Team Photo'   }
                  folder={'teamshot'         }
                 imageId={'current_teamshot' }
                loadData={ loadData          }
            />
</div>


            <FAQForm
                table={table}
                pkName={pkName}
                update={update} 
                columns={columns} 
                loadData={loadData} 
                currentData={currentData} 
                setCurrentData={setCurrentData}
            />
            
            <QuoteForm
                table={table}
                loadData={loadData} 
                currentData={currentData} 
                setCurrentData={setCurrentData}
            />
        </>
    )   
}  



