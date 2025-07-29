







import                      './AdminTools.css'

import   React, 
       { useState, 
         useEffect }   from 'react'; 
import   Axios         from 'axios';

import   TextField     from '../FormFunctions/TextField.js';
import   TextArea      from '../FormFunctions/TextArea.js';
import   Notification  from '../Notification.js';


export default function QuoteForm({  
                                     table,
                                     pkName,
                                     update, 
                                     columns, 
                                     loadData, 
                                     currentData, 
                                     setCurrentData  
                                 }) {


   
   
    const [ quote,           setQuote           ] = useState('');
    const [ quoteBy,         setQuoteBy         ] = useState('');

    const [ quoteError,      setQuoteError      ] = useState(false);
    const [ quoteByError,    setQuoteByError    ] = useState(false);
   
    const [ formStatus,      setFormStatus      ] = useState(false);


   

    useEffect(() => { setQuoteError(quote.length  ===   0); }, [quote]);
                

    useEffect(() => { setQuoteByError(quoteBy.length  ===   0); }, [quoteBy]);

    


    const uploadArticle = (e) => {
       

        e.preventDefault();

        // if any of the fields are empty, throw up an error
        // and return early. Otherwise, clear current notification and continue.
        if   (  quoteError     ||
                quoteByError   ){ return setFormStatus('inputError');  }
        else                    {        setFormStatus(false);         }


        // this is the function that will be called to update both parts of the quote.
        const updateMisc = (desc, value) => Axios.put(`${ process.env.REACT_APP_API_URL }updateData`, 
                                                        [ 'misc', [ 'value' ], [ value ], [ [ 'description', desc ]] ],
                                                        { withCredentials: true }
                                                     );


        // this is the function that will be called if the update is successful.
        const success    =         (res) => {
                                                loadData(table); 
                                                setFormStatus('updated');
                                            }

        // this is the function that will be called if the update fails.
        const failure    =         (err) => {
                                                console.log(err); 
                                                setFormStatus('httpError');
                                            }


        // try adding both parts of the quote to the database, 
        // then call the success or failure function.
        Axios.all([ updateMisc('info_quote',    quote  ),
                    updateMisc('info_quote_by', quoteBy) ]   )
             .then(   res => success(res)                    )
             .catch(  err => failure(err)                    );     

    }



    return(
            <div className='adminForm'>
                <h2 className='formTitle'>Update Quote</h2> 


                <form className='adminFormFields'>



                < TextArea
                        name='Quote'
                        state={quote}
                        setter={setQuote}
                        error={quoteError}
                        instructions='This better be profound.'
                        noHelp={true}
                    />

                    < TextField
                        name='Said By'
                        state={quoteBy}
                        setter={setQuoteBy}
                        error={quoteByError}
                        instructions='Capitalize as appropriate'
                        noHelp={true}
                    />

    
{
                            formStatus === 'inputError'  ? <Notification type='bad'  msg='Looks like something is filled out incorrectly. Make sure all the lights are shining green, then try again.' />
                        :   formStatus === 'uploadError' ? <Notification type='bad'  msg='There was a problem uploading your quote. Try refreshing the page before you reattempt.' />
                        :   formStatus === 'uploaded'    ? <Notification type='good' msg='Quote successfully uploaded!' />
                        :   formStatus === 'updated'     ? <Notification type='good' msg='Quote successfully updated!' />
                        :   formStatus === 'dataError'   ? <Notification type='bad'  msg='A data error has occured. Try refreshing the page and reattempting.' />
                        :   formStatus === 'httpError'   ? <Notification type='bad'  msg='A network error has occured. Try refreshing the page and reattempting.' />
                        :                                  null
                    }
                    

                </form>

                <button className='formButton' type="submit" onClick={(e) => uploadArticle(e)}>Update Quote</button>

            </div>
    )
}  



