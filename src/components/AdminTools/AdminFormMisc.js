







import { useState,
         useEffect }    from 'react';

import   FileUploader   from '../FormFunctions/FileUploader';
import   Checkbox       from '../FormFunctions/Checkbox';
import   Notification   from '../Notification';

import   Axios          from 'axios';




export default function AdminFormMisc ({ table, loadData, currentData, setCurrentData }) {

    const [ newBackground,          setNewBackground      ] = useState(false);
    const [ newBackgroundError,     setNewBackgroundError ] = useState(false);

    const [ uploadStatus,           setUploadStatus       ] = useState(false); 

    const [ constructionMode,       setConstructionMode   ] = useState(false);
    const [ modeStatus,             setModeStatus         ] = useState(false);



    // checks if the new background image is a jpeg, and sets the newBackgroundError state accordingly.
    useEffect(() => {

        const jpegRegEx   =  /^(.)+\.(jpg|jpeg|JPG|JPEG)$/;
        const validImage  =  jpegRegEx.exec(newBackground.name);

        setNewBackgroundError(!validImage);
        
    }, [newBackground]);


    //  sets the constructionMode state to the value of active in the construction_mode row of the misc table.
    useEffect(() => {

        const currentMode = currentData.find(row => row.description === 'construction_mode');

        currentMode !== undefined && setConstructionMode(currentMode.active);

    }, [currentData])




    // uploads the new background image to the server,
    // then updates the background id in the misc table.
    const uploadBackground= (e) => {

        e.preventDefault();


        // if the new background image is not a jpeg, return an error.
        // otherwise, set the uploadStatus state to 'uploading'.
        if (newBackgroundError) { return setUploadStatus('error');     }
        else                    {        setUploadStatus('uploading'); }


        // create a new FormData object, and append the new background image to it.
        let fd = new FormData();
            fd.append('imageUpload', newBackground,    newBackground.name);


        // define the functions that will be used to upload the image to the server,
        // and update the background id in the misc table.
        const storeBackground = (file)   => Axios.post( `${process.env.REACT_APP_API_URL}background`, file );
                                                                                                  
        const storeId         = (id)     => Axios.put(  `${process.env.REACT_APP_API_URL}updateData`, [ table, ['value'], [id], [ ['description', 'background'] ] ]);
     


        // upload the image to the server, then update the background id in the misc table.
        storeBackground(fd).then( res => {  setUploadStatus('uploaded');
                                            return storeId(res.data);
                                         }
                                )
                           .then( res => {  setUploadStatus('success'); 
                                            loadData(table); 
                                         }
                                )
                          .catch( err =>    setUploadStatus('httpError')
                                );
    }
    

    // updates the construction_mode row in the misc table.
    const updateConstructionMode= (e) => {

        e.preventDefault();

        const changeMode = (newMode) => Axios.put( `${process.env.REACT_APP_API_URL}updateData`, [ table, ['active'], [newMode], [['description', 'construction_mode']] ]);
     
                                                        // throw up a notification to let the user know the mode is updating.
                                                        setModeStatus('updating');

                                                        // throw up a notification to let the user know the mode is updated, and reload the data.
        changeMode(constructionMode).then(  res => {    setModeStatus('updated' ); 
                                                        loadData(table); 
                                                   } 
                                          )              // if there's an error, throw up a notification to let the user know.
                                    .catch( err =>      setModeStatus('error'   ) );

    }
    



    return (<div className='adminForm'>

        <h2>Miscellaneous</h2>
    
        <form style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '80%', margin: '5vmin 0'}}>


            < FileUploader
                name='new background'
                state={newBackground}
                setter={setNewBackground}
                onClick={() => setUploadStatus(null)}
                error={newBackgroundError}
                instructions='Make it a .jpeg formatted photo, please.'
                noHelp={true}
            />
        

            {       uploadStatus === 'uploading' ? <Notification type='wait' msg='Uploading background. This might take a minute...' />
                :   uploadStatus === 'error'     ? <Notification type='bad'  msg='The background needs to be .jpeg formatted.' />
                :   uploadStatus === 'httpError' ? <Notification type='bad'  msg='Looks like there was a network error. Try refreshing the page and reattempting.' />
                :   uploadStatus === 'uploaded'  ? <Notification type='wait' msg='Image successfully uploaded. Nowe we just need to catologue it in your database...' />
                :   uploadStatus === 'success'   ? <Notification type='good' msg='New background successfully added to database!' />
                :                                  null
            }


            <button className='formButton' type='button' onClick={uploadBackground}>Upload</button>


            < Checkbox    
                    name={'Construction Mode'}
                    state={constructionMode}
                    setter={setConstructionMode}
                    onClick={() => setModeStatus(null)}
            />


            {
                    modeStatus === 'updating' ? <Notification type='wait' msg='Switching modes. This should only take a second...' />
                :   modeStatus === 'error'    ? <Notification type='bad'  msg='There was an issue connecting with the database. Refresh the page and try agin.' />
                :   modeStatus === 'updated'  ? <Notification type='good' msg={ constructionMode ? 'Construction mode engaged'
                                                                                                 : 'Construction mode disengaged'
                                                                              } />
                :                                null
            }
        
            <button className='formButton' type='button' onClick={updateConstructionMode}>Update</button>

            
        </form>

    
    </div>)



}