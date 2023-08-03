







import                       './AdminTools.css'

import   React, 
       { useState, 
         useEffect }    from 'react'; 
import   Axios          from 'axios';

import   TextArea       from '../FormFunctions/TextArea.js';
import   TextField      from '../FormFunctions/TextField.js';
import   Toggle         from '../FormFunctions/Toggle.js';
import   FileUploader   from '../FormFunctions/FileUploader.js';
import   Notification   from '../Notification.js';
import   Checkbox       from '../FormFunctions/Checkbox';



export default function TeamForm({loadData, currentData, table, columns, update, pkName, adminStatus}) {





    // to differentiate between team and board forms
    // second condition covers profile updates
    const   board                                       = table === 'board' || (update && update.length > 14);

    // stores list of titles for dropdown menu
    const [ credits,           setCredits             ]  =  useState([]);
    

    // common state for team and baord members
    const [ name,               setName               ]  =  useState('');
    const [ title,              setTitle              ]  =  useState('');
    const [ email,              setEmail              ]  =  useState('');
    const [ imdbID,             setImdbID             ]  =  useState('');

    const [ uploadedImage,      setUploadedImage      ]  =  useState(false);
    const [ imageUpload,        setImageUpload        ]  =  useState(false);
   
    const [ imageURL,           setImageURL           ]  =  useState('');
    const [ imageAlt,           setImageAlt           ]  =  useState('');
   
    const [ noPosters,          setNoPosters          ]  =  useState(false);
    const [ newImage,           setNewImage           ]  =  useState(false);
    const [ publish,            setPublish            ]  =  useState(false);
    
    const [ poster1,            setPoster1            ]  =  useState('');
    const [ poster2,            setPoster2            ]  =  useState('');
    const [ poster3,            setPoster3            ]  =  useState('');
    const [ poster4,            setPoster4            ]  =  useState('');
    const [ poster5,            setPoster5            ]  =  useState('');
    
    // additional state for board members
    const [ poster6,            setPoster6            ]  =  useState('');
    const [ poster7,            setPoster7            ]  =  useState('');
    const [ poster8,            setPoster8            ]  =  useState('');
    const [ poster9,            setPoster9            ]  =  useState('');
    const [ poster10,           setPoster10           ]  =  useState('');

    const [ attribute1,         setAttribute1         ]  = useState('');
    const [ attribute2,         setAttribute2         ]  = useState('');
    const [ attribute3,         setAttribute3         ]  = useState('');
    
    const [ profile,            setProfile            ]  =  useState('');
    

    // error state
    const [ nameError,          setNameError          ]  =  useState('');
    const [ titleError,         setTitleError         ]  =  useState('');
    const [ imdbIDError,        setImdbIDError        ]  =  useState('');
    const [ emailError,         setEmailError         ]  =  useState('');
    const [ imageUploadError,   setImageUploadError   ]  =  useState(false);
    const [ imageURLError,      setImageURLError      ]  =  useState('');
    const [ imageAltError,      setImageAltError      ]  =  useState('');
    const [ profileError,       setProfileError       ]  =  useState('');
    
    const [ attribute1Error,    setAttribute1Error    ]  = useState('');
    const [ attribute2Error,    setAttribute2Error    ]  = useState('');
    const [ attribute3Error,    setAttribute3Error    ]  = useState('');
    
    const [ poster1Error,       setPoster1Error       ]  =  useState(false);
    const [ poster2Error,       setPoster2Error       ]  =  useState(false);
    const [ poster3Error,       setPoster3Error       ]  =  useState(false);
    const [ poster4Error,       setPoster4Error       ]  =  useState(false);
    const [ poster5Error,       setPoster5Error       ]  =  useState(false);
    const [ poster6Error,       setPoster6Error       ]  =  useState(false);
    const [ poster7Error,       setPoster7Error       ]  =  useState(false);
    const [ poster8Error,       setPoster8Error       ]  =  useState(false);
    const [ poster9Error,       setPoster9Error       ]  =  useState(false);
    const [ poster10Error,      setPoster10Error      ]  =  useState(false);
    
    const [ duplicateError,     setDuplicateError     ]  =  useState(false);

    // notification state
    const [ uploadStatus,       setUploadStatus       ] = useState(false);






    // retrieves list of all posters from database and stores in state on initial page load
    useEffect(() => {


        Axios.get(`${process.env.REACT_APP_API_URL}getPosterList`                  )
            .then(  res => { setCredits(res.data); }     )
            .catch( err => { console.log(err);     }     );
    }, [])

    

    
    // updates state with values from database if update prop is passed                   
    useEffect(() => {
        
        const commonSetters = [   
                                    setName,
                                    setTitle,
                                    setImdbID,    
                                    setEmail,
                                    setUploadedImage,
                                    setImageAlt,
                                    setNoPosters,
                                    setPoster1,
                                    setPoster2,
                                    setPoster3,
                                    setPoster4,
                                    setPoster5,
                                    setPublish,
                             ];

        const extraSetters = [   
                                    setProfile,
                                    setAttribute1,
                                    setAttribute2,
                                    setAttribute3,
                                    setPoster6,
                                    setPoster7,
                                    setPoster8,
                                    setPoster9,
                                    setPoster10,
                             ];

        
        const setters = !board ? commonSetters : commonSetters.concat(extraSetters);

        if (update) {  

            
            for (let i = 0; i < setters.length; i++) {
                setters[i](update[i])
            }
        }

    }, [board, table, update])




    // error-checking effect hooks 
    useEffect(() => {   setNameError( name.length === 0 ); },                                            [name]);
    
    
    useEffect(() => {   setImdbIDError( !( imdbID.startsWith('nm') &&  imdbID.length ===  9 )); },       [imdbID]);
    
    
    useEffect(() => {   setTitleError( title.length === 0 ); },                                          [title]);


    useEffect(() => {   setEmailError( email.indexOf('@') === -1 || email.indexOf('.')  ===  -1 )},      [email]);    

    // use a regular expression to check that the image file is a jpeg,
    // as long as uploadedImage is true.
    useEffect(() => {

        const jpegRegEx   =  /^(.)+\.(jpg|jpeg|JPG|JPEG)$/;
        const validImage  =  jpegRegEx.exec(imageUpload.name);

        if (imageUpload)    {       !validImage  ?  setImageUploadError(true)
                                                 :  setImageUploadError(false);
                            }                        
        if (!uploadedImage) {                       setImageUploadError(false);
                            }

    }, [imageUpload, uploadedImage]);
    

    // check that the image URL is valid, 
    // as long as uploadedImage is false.
    useEffect(() => {
        
        if (imageURL)      { let   URL                 = document.createElement('input')
                                   URL.type            = 'url';
                                   URL.value           = imageURL;
                                  !URL.checkValidity() ? setImageURLError(true)
                                                       : setImageURLError(false);
                           }
        if (uploadedImage) {                             setImageURLError(false);
                           }

    }, [imageURL, uploadedImage]);


    useEffect(() => {   setImageAltError( imageAlt.length === 0 )  },                                       [imageAlt]);
    

    useEffect(() => {   setProfileError( profile.length === 0 || profile.length >=  2400 ) },               [profile]);
    
    
    useEffect(() => {   setAttribute1Error( attribute1.length === 0 || attribute1.length >= 120 ) },        [attribute1]);
    
    
    useEffect(() => {   setAttribute2Error( attribute2.length === 0 || attribute2.length >= 120 ) },        [attribute2]);
    
    
    useEffect(() => {   setAttribute3Error( attribute3.length === 0 || attribute3.length >= 120 ) },         [attribute3]);


    useEffect( () => {  setPoster1Error(  typeof(parseInt(poster1))  !== 'number')    },                     [poster1]);
    useEffect( () => {  setPoster2Error(  typeof(parseInt(poster2))  !== 'number')    },                     [poster2]);
    useEffect( () => {  setPoster3Error(  typeof(parseInt(poster3))  !== 'number')    },                     [poster3]);
    useEffect( () => {  setPoster4Error(  typeof(parseInt(poster4))  !== 'number')    },                     [poster4]);
    useEffect( () => {  setPoster5Error(  typeof(parseInt(poster5))  !== 'number')    },                     [poster5]);
    useEffect( () => {  setPoster6Error(  typeof(parseInt(poster6))  !== 'number')    },                     [poster6]);
    useEffect( () => {  setPoster7Error(  typeof(parseInt(poster7))  !== 'number')    },                     [poster7]);
    useEffect( () => {  setPoster8Error(  typeof(parseInt(poster8))  !== 'number')    },                     [poster8]);
    useEffect( () => {  setPoster9Error(  typeof(parseInt(poster9))  !== 'number')    },                     [poster9]);
    useEffect( () => {  setPoster10Error( typeof(parseInt(poster10)) !== 'number')    },                     [poster10]);



    //checks for duplicate posters
    const teamPosters   = [ poster1, poster2, poster3, poster4, poster5  ];
    const extraPosters  = [ poster6, poster7, poster8, poster9, poster10 ];
    const boardPosters  =   teamPosters.concat(extraPosters);

    const posters       =   board ? boardPosters : teamPosters;
    const uniquePosters =   new Set(posters);

    useEffect(() => {

        uniquePosters.size !== posters.length  ? setDuplicateError(true)
                                               : setDuplicateError(false);

        noPosters                             && setDuplicateError(false);

    }, [noPosters, posters, uniquePosters.size])


    // lines everything up for poster dropdowns
    const posterGear = [

        [ 'poster1Dropdown',  poster1,  setPoster1,  credits ],
        [ 'poster2Dropdown',  poster2,  setPoster2,  credits ],
        [ 'poster3Dropdown',  poster3,  setPoster3,  credits ],
        [ 'poster4Dropdown',  poster4,  setPoster4,  credits ],
        [ 'poster5Dropdown',  poster5,  setPoster5,  credits ],         
        [ 'poster6Dropdown',  poster6,  setPoster6,  credits ],
        [ 'poster7Dropdown',  poster7,  setPoster7,  credits ],
        [ 'poster8Dropdown',  poster8,  setPoster8,  credits ],
        [ 'poster9Dropdown',  poster9,  setPoster9,  credits ],
        [ 'poster10Dropdown', poster10, setPoster10, credits ]
    ];   
    



    // creates poster dropdowns
    function posterDropdown (name, state, setter, credits, index) {

        return (
            <div key={index} className='dropdown'>
                <select      name={name}
                            value={state}
                         onChange={(e) => setter(e.target.value)}
                >
                    <option key={0} value='null' defaultValue hidden>--select an option--</option>
                    { credits.length > 0 && credits.map( credit => <option   key={credit.poster_id} 
                                                                           value={credit.poster_id} 
                                                                                >{credit.title.replaceAll('&apos;', `'`)
                                                                                              .replaceAll('&amps;','&' )}</option> 
                                                       )
                    }
                </select>
            </div>
        )
    }
    


    const uploadProfile = (e) => {

        e.preventDefault();


        // clears upload status
        setUploadStatus(false);


        // if/else train checks for errors and sets upload status accordingly

        // team members who want their profile online must meet these criteria.
        if      (  (!board && publish)    &&
                    (   nameError         ||
                        emailError        ||
                        imdbIDError       ||
                        titleError        ||
                        // unless noPosters is enabled by admin, no blank posters are allowed.
                        (   !noPosters          &&
                            (   poster1Error    ||    
                                poster2Error    ||    
                                poster3Error    ||    
                                poster4Error    ||    
                                poster5Error
                            )
                        )))                      { return setUploadStatus('error');    }


        // board members who want their profile online must meet these criteria.
        else if (   ( board && publish )              &&
                    (   nameError                     ||
                        emailError                    ||
                        imdbIDError                   ||
                        titleError                    ||
                        profileError                  ||
                        attribute1Error               || 
                        attribute2Error               || 
                        attribute3Error               || 
                        // unless noPosters is enabled by admin, no blank posters are allowed.
                        (   !noPosters          &&
                            (   poster1Error    ||    
                                poster2Error    ||    
                                poster3Error    ||    
                                poster4Error    ||    
                                poster5Error    ||    
                                poster6Error    ||    
                                poster7Error    ||    
                                poster8Error    ||    
                                poster9Error    ||    
                                poster10Error 
                            )
                        )))                      { return setUploadStatus('error');      }

        // duplicate posters aren't allowed, and will cause display issues.
        else if ( duplicateError )               { return setUploadStatus('duplicate');  }


        // for new profiles and updates with new images, 
        // a new image must be uploaded, or a URL needs to be provided.
        // which one depends on uploadedImage.
        else if ( (!update || (update && newImage) )   &&
                                                        (
                                                            (!uploadedImage     &&  imageURLError       ) ||
                                                            ( uploadedImage     &&  imageUploadError    )
                                                        )
                )                      { return setUploadStatus('imageError');      }

        // even if a profile isn't set to publish, it still requires a name, email and IMDB ID.
        else if (   nameError         ||
                    emailError        ||
                    imdbIDError       ){ return setUploadStatus('submin');     }


        // if you made it this far, put up an uploading notification.            
        else                           {        setUploadStatus('uploading');  }


        
        // then gather state for upload to database
        const commonState   = [  
                                name,
                                title,
                                imdbID,
                                email,
                                uploadedImage,
                                imageAlt, 
                                noPosters,
                                poster1,
                                poster2,
                                poster3,
                                poster4,
                                poster5,
                                publish,
                              ] 

        const extraState    = [  
                                profile,
                                attribute1,
                                attribute2,
                                attribute3,
                                poster6,
                                poster7,
                                poster8,
                                poster9,
                                poster10,
                             ] 
        

        // board members require extra state for attributes, additional posters and their profile.
        let parameters = board ? commonState.concat(extraState) : commonState;




        // HTTP requests
        const reqTable       = board ? 'board' : 'team';

        const uploadPhotoReq = (data)         => Axios.post(`${process.env.REACT_APP_API_URL}teamPhoto`,        data                                                     )
        
        const uploadDataReq  = (cols, params) => Axios.post(`${process.env.REACT_APP_API_URL}addData`,     [ reqTable, cols, params, ]                                   )
                                                                                                         //   'team_id' and  team_id
        const updateDataReq  = (cols, params) => Axios.put( `${process.env.REACT_APP_API_URL}updateData`,  [ reqTable, cols, params, [   [ pkName, update.at(-1) ]  ]  ] )

        const sendData       = update ? updateDataReq
                                      : uploadDataReq;
        

        // HTTP request helper functions
        const cleanUp        = ()    => { 
                                            loadData(table === 'profile' ? table : reqTable); 
                                            setUploadStatus('updated');
                                        }
        const failure        = (err) => {
                                            console.log(err); 
                                            setUploadStatus('httpError');
                                        }

        let   fd             = new FormData();


        // adds rank for new team/board members
        if (!update) { 
                            columns        = columns.concat(   [ 'rank']               );
                            parameters     = parameters.concat([ currentData.length+1 ]);  
                    }


        // adds image url to parameters if necessary
        if ( !uploadedImage && 
            !(update && !newImage) ) {  
                                        columns    = columns.concat(   ['image_url'] );
                                        parameters = parameters.concat([ imageURL  ] ); 
                                    }             


        // prepares form data for image upload if necessary             
        if (  uploadedImage &&
            !(update && !newImage) )    {
                                            fd.append('name',                                    name);
                                            fd.append('imageUpload', imageUpload,    imageUpload.name);
                                        }




        // sends data to database, starting with uploading image if necessary
        if (  uploadedImage &&
            !(update && !newImage) ){ 
                                        uploadPhotoReq(fd).then( res =>    {
                                                                                columns = columns.concat(['image_id']);
                                                                                parameters = parameters.concat([res.data]);

                                                                                return sendData(columns, parameters);
                                                                            })
                                                          .then(  ()  =>    {  cleanUp();    })
                                                         .catch( err =>     {  failure(err); });
                                    }
                                                
        else                        {
                                        sendData(columns, parameters).then( res => cleanUp()    )
                                                                    .catch( err => failure(err) ); 
                                    }
                                                        
        
    }




    return(
            <div className='adminForm'>

                <h2 className='formTitle'
                    style={{margin: '1em 0'}}
                >{      !adminStatus        ? 'Edit Profile'
                    :    board &&   update  ? 'Edit Board Member'
                    :    board              ? 'Add Board Member'
                    :               update  ? 'Edit Team Member' 
                    :                         'Add Team Member'
                 }
                </h2> 


                <form className='adminFormFields'>

                    {/* Displays current name, title and IMDB ID for team members, and provides inputs for admin to edit them. */}
                    {   adminStatus ?   <>  < Checkbox    
                                                        name={'No Posters'}
                                                        state={noPosters}
                                                        setter={setNoPosters}
                                            />
                        

                                            < TextField
                                                name='name'
                                                state={name}
                                                setter={setName}
                                                error={nameError}
                                                instructions='As you want it to appear on the profile'
                                                noHelp={true}
                                            />
                                    
                                    
                                            < TextField
                                                name='title'
                                                state={title}
                                                setter={setTitle}
                                                error={titleError}
                                                instructions='As you want it to appear on the profile'
                                                noHelp={true}
                                            />
                        

                                            < TextField
                                                name='imdbID'
                                                state={imdbID}
                                                setter={setImdbID}
                                                error={imdbIDError}
                                                instructions='In this format: nm*******'
                                                noHelp={true}
                                            />
                                        </>

                                    :   <div className='flexColumn' style={{marginBottom: '2em'}} >
                                            <h3>{name}</h3>
                                            <h5>{title}</h5>
                                            <h5>{imdbID}</h5>
                                        </div>
                    }
                    
                    {/* Email can be updated by admin or team member */}
                    < TextField
                        name='email'
                        state={email}
                        setter={setEmail}
                        error={emailError}
                        instructions='Enter a vail email address.'
                        noHelp={true}
                    />



                    {/* Next three conditional blocks all handle the image upload process. */}
                    {   update && !newImage     &&     <div style={{marginBottom: '2em'}}>
                                                            < Checkbox    
                                                                        name={'update profile photo'}
                                                                        state={newImage}
                                                                    setter={setNewImage}
                                                            />
                                                        </div>
                    }               
                    {   (!update ||
                        ( update && newImage))  &&  <> 
                                                        <Toggle    
                                                                    name='imageUploadToggle'
                                                                   state={uploadedImage}
                                                                  setter={setUploadedImage}
                                                              disengaged='image URL'
                                                                 engaged='image upload'
                                                            />


                                                        {   uploadedImage  ?   < FileUploader
                                                                                    name='image Upload'
                                                                                    state={imageUpload}
                                                                                    setter={setImageUpload}
                                                                                    error={imageUploadError}
                                                                                    instructions='Make it a .jpeg formatted photo, please.'
                                                                                    noHelp={true}
                                                                                />

                                                                            :   < TextField
                                                                                    name='image URL'
                                                                                    state={imageURL}
                                                                                    setter={setImageURL}
                                                                                    error={imageURLError}
                                                                                    instructions='If left blank, the company logo will be substituted.'
                                                                                    noHelp={true}
                                                                                />
                                                        }
                                                    </>              
                    }
                    {   update && newImage      &&  <p id='oldImageGraf' onClick={() => setNewImage(false)}>stick with old image</p>    }
                   


                    {/* Input for image description */}
                    < TextField
                        className='imageAltField'
                        name='image description'
                        state={imageAlt}
                        setter={setImageAlt}
                        error={imageAltError}
                        instructions='be brief and specific.'
                        noHelp={true}
                    />   


                    {/* board members require three attribute inputs and a profile textarea */}
                    {        board                  &&  <>
                                                            < TextField
                                                                name='attribute 1'
                                                                state={attribute1}
                                                                setter={setAttribute1}
                                                                error={attribute1Error}
                                                                instructions={`Sell yourself in 120 characters or less. You're at ${attribute1.length} right now.`}
                                                                noHelp={true}
                                                            />


                                                           < TextField
                                                                name='attribute 2'
                                                                state={attribute2}
                                                                setter={setAttribute2}
                                                                error={attribute2Error}
                                                                instructions={`Sell yourself in 120 characters or less. You're at ${attribute2.length} right now.`}
                                                                noHelp={true}
                                                            />


                                                           < TextField
                                                                name='attribute 3'
                                                                state={attribute3}
                                                                setter={setAttribute3}
                                                                error={attribute3Error}
                                                                instructions={`Sell yourself in 120 characters or less. You're at ${attribute3.length} right now.`}
                                                                noHelp={true}
                                                            />



                                                            < TextArea
                                                                name='profile'
                                                                state={profile}
                                                                setter={setProfile}
                                                                error={profileError}
                                                                instructions={`Keep it under 2,400 characters. Right now you're at ${profile.length}.`}
                                                                noHelp={true}
                                                            /> 
                                                            
                                                        </>
                    }
 

                    {/* Serves up five dropdowns for team members, and 10 for board members plus three attribute inputs and a textarea for bios. */}
                    {        !board                 && 
                             !noPosters             &&
                              credits               ?   <>
                                                            <h3 style={{margin: '2em 0 1em'}}>Profile Posters</h3>
                        
                                                           { posterGear.slice(0,5).map(  (dropdown, index) => posterDropdown(...[...posterGear[index],   index  ]))}
                                                        </>

                         :   board                 && 
                            !noPosters             &&
                             credits               ?   <>
                                                            {   !noPosters &&   <>
                                                                                    <h3 style={{margin: '2em 0 1em'}}>Profile Posters</h3>


                                                                                    <div className='flexColumn'>
                                                                                        <h5>Top/Left of Profile</h5>
                                                                                        { credits && posterGear.slice(0,5).map(  (dropdown, index) => posterDropdown(...[...posterGear[index],   index  ])) }
                                                                                        <h5>Bottom/Right of Profile</h5>
                                                                                        { credits && posterGear.slice(5,10).map( (dropdown, index) => posterDropdown(...[...posterGear[index+5], index+5])) }
                                                                                    </div>
                                                                                </>
                                                            }
                                                       </>
                         
                         :                              null
                    }

                    {/* Toggles between published and draft mode */}
                    <Toggle    
                              name='publishedToggle'
                             state={publish}
                            setter={setPublish}
                        disengaged='draft mode'
                           engaged='published'
                    />
                    

                </form>


                <button className='formButton' 
                             type="submit" 
                            style={{marginBottom: '2.5em'}}
                          onClick={(e) => uploadProfile(e)}>{ publish ? 'Post Profile' 
                                                            : update  ? 'Update Data'
                                                            :           'Save Data'                         
                                                            }
                </button>

                {/* Notifications are displayed based on the uploadStatus state. */}
                {       uploadStatus === 'uploading'         ? <Notification type='wait' msg='Uploading profile. This might take a minute...' />
                    :   uploadStatus === 'duplicate'         ? <Notification type='bad'  msg='Duplicate posters are a no go. No matter how much you loved that movie.' />
                    :   uploadStatus === 'error'             ? <Notification type='bad'  msg='Seems like something is filled out wrong. Make sure all lights are shining green before you try again.' />
                    :   uploadStatus === 'submin'            ? <Notification type='bad'  msg='Name, email and IMDB ID are mandatory fields (even for drafts).' />
                    :   uploadStatus === 'imageError'        ? <Notification type='bad'  msg='Looks like you still need to select a headshot.' />
                    :   uploadStatus === 'dataError'         ? <Notification type='bad'  msg='A data error has occured. Try refreshing the page and reattempting.' />
                    :   uploadStatus === 'httpError'         ? <Notification type='bad'  msg='A network error has occured. Try refreshing the page and reattempting.' />
                    :   uploadStatus === 'added'             ? <Notification type='good' msg='New profile successfully added to database!' />
                    :   uploadStatus === 'updated'           ? <Notification type='good' msg='Profile successfully updated!' />
                    :                                           null
                }
            </div>
    )
}  







