







import                      './AdminTools.css';
import   FAQForm       from './AdminFormFAQ.js';
import   QuoteForm     from './AdminFormQuote.js';


// since there's a lot happening on the info page,
// this simple scripts only real job is to render the FAQ and Quote forms.
export default function InfoForm({  url,
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
            <FAQForm
                url={url}
                table={table}
                pkName={pkName}
                update={update} 
                columns={columns} 
                loadData={loadData} 
                currentData={currentData} 
                setCurrentData={setCurrentData}
            />
            
            <QuoteForm
                url={url}
                table={table}
                loadData={loadData} 
                currentData={currentData} 
                setCurrentData={setCurrentData}
            />
        </>
    )   
}  



