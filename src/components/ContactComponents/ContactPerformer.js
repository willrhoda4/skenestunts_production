







import             '../../pages/Contact.css'

import Page1  from './FormPages/page1_contact';
import Page2  from './FormPages/page2_appearance';
import Page3  from './FormPages/page3_skills1';
import Page4  from './FormPages/page4_skills2';
import Page5  from './FormPages/page5_skills3';
import Page6  from './FormPages/page6_skills4';
import Page7  from './FormPages/page7_skills5';
import Page8  from './FormPages/page8_skills6';
import Page9  from './FormPages/page9_driving';
import Page10 from './FormPages/page10_wrappingUp';


import { useState, 
         useEffect }   from 'react'; 
import { Link      }   from 'react-router-dom'; 

import   Notification  from '../Notification.js';

import   iconRewind    from '../../images/icon_rewind.svg';




// this is the mold that all FormPages are poured into.
export default function PerformerForm ({performerOptions, performerData, performerClass, setPerformerClass, getData}) {



    const [  pageState1,       setPageState1       ] = useState([]);
    const [  pageState2,       setPageState2       ] = useState([]);
    const [  pageState3,       setPageState3       ] = useState([]);
    const [  pageState4,       setPageState4       ] = useState([]);
    const [  pageState5,       setPageState5       ] = useState([]);
    const [  pageState6,       setPageState6       ] = useState([]);
    const [  pageState7,       setPageState7       ] = useState([]);
    const [  pageState8,       setPageState8       ] = useState([]);
    const [  pageState9,       setPageState9       ] = useState([]);
    const [  pageState10,      setPageState10      ] = useState([]);
 

    // since page 1 and 2 are the only pages with mandatory, 
    // non-boolean fields, they are the only pages with error states.
    const [  pageError1,       setPageError1       ] = useState(false);
    const [  pageError2,       setPageError2       ] = useState(false);
    const [  showErrorMsg,     setShowErrorMsg     ] = useState(false);


    // currentPage is the page that is currently being displayed.
    // update stores the performer_id of the performer being updated.
    // newPhotos is a boolean that is true if the user wants to upload new photos during an update.
    const [  currentPage,      setCurrentPage      ] = useState(1);
    const [  update,           setUpdate           ] = useState(false);
    const [  newPhotos,        setNewPhotos        ] = useState(false);
    const [  samePhotos,       setSamePhotos       ] = useState(false);

   
    // formState and formSetters are used to set and retrieve form data.
    const formState    =  [ pageState1,    pageState2,    pageState3,    pageState4,    pageState5,    pageState6,    pageState7,    pageState8,    pageState9,    pageState10    ];
    const formSetters  =  [ setPageState1, setPageState2, setPageState3, setPageState4, setPageState5, setPageState6, setPageState7, setPageState8, setPageState9, setPageState10 ];


    // extracts columns array of arrays from performerOptions object.
    const columns      =  performerOptions.columns


    // initiates update state if performerData is passed in
    useEffect(() => { 
        
        performerData  ?  setUpdate(performerData.performer_id)  :  setUpdate(false); 
    
    }, [performerData, setPerformerClass])

    
    //prepares form state for returning performers updating profile
    useEffect(() => {
        
        if (performerOptions && performerData) {
            
            // every array in columns represents a page of the form.
            // this loop iterates through each page and sets the form state.
            for (let i = 0; i < columns.length; i++) {
                
                let pageState = [];
                
                for (let j = 0; j < columns[i].length; j++) {
                    // eslint-disable-next-line no-eval
                    pageState.push(performerData[columns[i][j]])
                }
                formSetters[i](pageState);
            }  
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // scrolls to top of form when page changes
    useEffect(() => {  document.querySelector( '#fullForm' ).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});  }, [currentPage])

    
    // navigates to next page if no errors are present
    function nextPage () {  


        // if page 1 or 2 has an error, show error message.
        if (    ( currentPage === 1 && pageError1) ||
                ( currentPage === 2 && pageError2)  ) { return setShowErrorMsg('entryError'); }

        // if page 2 is error free, check if headshot and bodyshot are the same.
        else if ( currentPage === 2 && samePhotos   ) { return setShowErrorMsg('samePhotos'); }

        // if page 1 is error free, check if email is available.
        else if ( currentPage === 1                 ) {    
                                                            setShowErrorMsg('emailChecking');
                                                            getData([ 'performers', [['email', pageState1[2]]] ])
                                                              .then( res => {   
                                                                                                                                // if an existing email is used during a new registration,
                                                                                                                                // prompt user to update their profile instead.
                                                                                  if (!update &&  res.data.length > 0      ) {  return setShowErrorMsg('newEmailError'); }  

                                                                                                                                // if an existing email is used during an email address update, 
                                                                                                                                // prompt user to use a different email.                  
                                                                             else if ( update &&  res.data.length > 0 &&  
                                                                                       update !== res.data[0].performer_id ) {  return setShowErrorMsg('oldEmailError') }

                                                                                                                                // if email is available, move to next page.
                                                                             else                                            {         setShowErrorMsg(false);
                                                                                                                                return setCurrentPage(2);
                                                                                                                             }
                                                                            
                                                                            }
                                                                   )
                                                             .catch( err => console.log(err))
                                                      }
        else                                          { setShowErrorMsg(false);
                                                        setCurrentPage(currentPage+1);
                                                      }
    }  
    

    // clears error message and navigates to previous page
    function lastPage () {

        setShowErrorMsg(false);
        setCurrentPage(currentPage-1);
    }


    // displays error message if needed
    function errorMsg () {

             if  (showErrorMsg === 'entryError'   ) { return <Notification type='bad'  msg='All lights need to shine green before you continue.'                                                                                                                           /> }
        else if  (showErrorMsg === 'emailChecking') { return <Notification type='wait' msg='Checking email availability...'                                                                                                                                                /> }
        else if  (showErrorMsg === 'newEmailError') { return <Notification type='bad'  msg={<>This email already exists in our database. Do you want to use our <Link style={{color:'red'}} to="/updatePerformer">performer update</Link> form to update your profile?</>} /> } 
        else if  (showErrorMsg === 'oldEmailError') { return <Notification type='bad'  msg={`The new email already exists in our database. Stick with the address you used last time, or provide one that isn't spoken for.`}                                              /> }
        else if  (showErrorMsg === 'samePhotos'   ) { return <Notification type='bad'  msg={`Looks like you submitted the same photo for your headshot and bodyshot.`}                                                                                                /> }
        else                                        { return  null                                                                                                                                                                                                            }
    }



    return (  

        <div id='fullForm'>  

            {/* gap_up_top div is hack to leave a little space when window auto scrolls. */}
            <div id='gap_up_top' style={{height: '5vmin'}} />

            <form id='performerForm' className='contactForm'>
                    {   currentPage === 1  ? <Page1  pageState={pageState1}  setPageState={setPageState1} 
                                                                             setPageError={setPageError1} 
                                                                         performerOptions={performerOptions} 
                                                                                   update={update}          
                                                                                                                />
                    :   currentPage === 2  ? <Page2  pageState={pageState2}  setPageState={setPageState2} 
                                                                             setPageError={setPageError2} 
                                                                         performerOptions={performerOptions} 
                                                                                   update={update} 
                                                                                newPhotos={newPhotos} 
                                                                             setNewPhotos={setNewPhotos}
                                                                           performerClass={performerClass} 
                                                                        setPerformerClass={setPerformerClass} 
                                                                            setSamePhotos={setSamePhotos}
                                                                                                                />
                    :   currentPage === 3  ? <Page3  pageState={pageState3}  setPageState={setPageState3}       />
                    :   currentPage === 4  ? <Page4  pageState={pageState4}  setPageState={setPageState4}       />
                    :   currentPage === 5  ? <Page5  pageState={pageState5}  setPageState={setPageState5}       />
                    :   currentPage === 6  ? <Page6  pageState={pageState6}  setPageState={setPageState6}       />
                    :   currentPage === 7  ? <Page7  pageState={pageState7}  setPageState={setPageState7}       />
                    :   currentPage === 8  ? <Page8  pageState={pageState8}  setPageState={setPageState8}       />
                    :   currentPage === 9  ? <Page9  pageState={pageState9}  setPageState={setPageState9}       />
                    :   currentPage === 10 ? <Page10 pageState={pageState10} setPageState={setPageState10} 
                                                                                  columns={columns} 
                                                                                formState={formState} 
                                                                                   update={update} 
                                                                                newPhotos={newPhotos} 
                                                                           setCurrentPage={setCurrentPage} 
                                                                           performerClass={performerClass}      />

                    :   <Notification type='bad' msg='Oops... Looks like there was a problem. Try refreshing your browser and starting over.' />

                    }
                    <div id='performerFormNav'>

                        <div className='pageButtons' style={{margin: '2.5vmin 0'}}>
                            
                            {/* navigation buttons
                                - if on page 1, only show next button
                                - if on page 10 don't display any buttons
                                    (a reverse button is displayed with the submit button on page 10)
                            */}
                            { currentPage !== 1  && currentPage !== 10 && <button id='lastPageButton' className='formButton' type="button" onClick={() => lastPage() }>{ <img alt='rewind icon' 
                                                                                                                                                                              className='buttonIcon'
                                                                                                                                                                              src={iconRewind}/>
                                                                                                                                                                       }back</button>}
                            { currentPage !== 10 &&                       <button id='nextPageButton' className='formButton' type="button" onClick={() => nextPage() }>{ <img alt='rewind icon' 
                                                                                                                                                                              className='buttonIcon flipped'
                                                                                                                                                                              src={iconRewind}/>
                                                                                                                                                                       }next</button>}
                        </div>

                        {/* displays current page number */}
                        <p>{currentPage+'/10'}</p>

                    </div>

                    {/* displays error message if needed */}
                    {  errorMsg()  }

            </form>

        </div>)
}