







import                      './AdminTools.css'

import   React, 
       { useState, 
         useEffect }   from 'react'; 
import   Axios         from 'axios';

import   TextField     from '../FormFunctions/TextField.js';
import   TextArea      from '../FormFunctions/TextArea.js';
import   Notification  from '../Notification.js';


export default function FAQForm({   
                                    table,
                                    pkName,
                                    update, 
                                    columns, 
                                    loadData, 
                                    currentData, 
                                    setCurrentData  
                                }) {

                        
    const [ question,        setQuestion        ] = useState('');
    const [ answer,          setAnswer          ] = useState('');
    const [ cssId,           setCssId           ] = useState('');
    // cssID is the id of the <div> that wraps the question and answer.

    const [ questionError,   setQuestionError   ] = useState(false);
    const [ answerError,     setAnswerError     ] = useState(false);
    const [ cssIdError,      setCssIdError      ] = useState(false);
   

    const [ formStatus,      setFormStatus      ] = useState(false);


    useEffect(() => {
        
        
        const setters = [   
                            setQuestion,
                            setAnswer,
                            setCssId
                        ]

        if (update) {
            
            for (let i = 0; i < setters.length; i++) {
                setters[i](update[i])
            }
        }
    }, [update])



    useEffect(() => { setQuestionError( question.length === 0)         }, [question] );
                

    useEffect(() => { setAnswerError(     answer.length === 0)          }, [answer]   );
   
    useEffect(() => { setCssIdError(       cssId.length === 0 || 
                                           cssId.indexOf(' ') !== -1)   }, [cssId]);
                


    const uploadArticle = (e) => {
       
        e.preventDefault();

        if   (  cssIdError    ||
                questionError ||
                answerError   ){ return setFormStatus('inputError');  }
        else                   {        setFormStatus(false);         }


        let columnList =   columns;
        let parameters = [ question, answer, cssId ];
        

        if (!update) {

            // If this is a new article, add the rank to the end of the columnList and parameters arrays.
            columnList = columnList.concat( ['rank']               );
            parameters = parameters.concat( [currentData.length+1] );
            
            Axios.post( `${  process.env.REACT_APP_API_URL  }addData`,  
                          ['faq', columnList, parameters ],
                          { withCredentials: true }
                      )
                 .then(   res => { setFormStatus('uploaded'); loadData(table); } )
                 .catch(  err =>   setFormStatus('uploadError')                  );
                
        } else {
            // If this is an update, the primary key is the last element of the update array.
            Axios.put( `${  process.env.REACT_APP_API_URL  }updateData`,
                         [ 'faq', columnList, parameters, [ [ pkName, update.at(-1) ] ] ],
                         { withCredentials: true }
                     )
                .then(  res => { 
                                    console.log(res);
                                    loadData(table); 
                                    setFormStatus('updated')
                                }
                        )
                .catch( err => { console.log(err); setFormStatus('httpError'); } );
}

    }

    return(
            <div className='adminForm'>
                <h2 className='formTitle'>Add FAQ</h2> 


                <form className='adminFormFields'>

                    < TextField
                        name='question'
                        state={question}
                        setter={setQuestion}
                        error={questionError}
                        instructions='extra points for brevity'
                        noHelp={true}
                    />

                  
                    < TextArea
                        name='answer'
                        state={answer}
                        setter={setAnswer}
                        error={answerError}
                        instructions='share your wisdom'
                        noHelp={true}
                    />
                    
                    
                    < TextField
                        name='unique id'
                        state={cssId}
                        setter={setCssId}
                        error={cssIdError}
                        instructions='used for link urls. be unique, descriptive and space-free.'
                        noHelp={true}
                    />

                
                  

{
                            formStatus === 'inputError'  ? <Notification type='bad'  msg='Looks like something is filled out incorrectly. Make sure all the lights are shining green, then try again.' />
                        :   formStatus === 'uploadError' ? <Notification type='bad'  msg='There was a problem uploading your question. Try refreshing the page before you reattempt.' />
                        :   formStatus === 'uploaded'    ? <Notification type='good' msg='Question successfully uploaded!' />
                        :   formStatus === 'updated'     ? <Notification type='good' msg='Question successfully updated!' />
                        :   formStatus === 'dataError'   ? <Notification type='bad'  msg='A data error has occured. Try refreshing the page and reattempting.' />
                        :   formStatus === 'httpError'   ? <Notification type='bad'  msg='A network error has occured. Try refreshing the page and reattempting.' />
                        :                                  null
                    }
                    

                </form>

                <button className='formButton' type="submit" onClick={(e) => uploadArticle(e)}>{ update ? 'Update Question' : 'Post Question' }</button>

            </div>
    )
}  



