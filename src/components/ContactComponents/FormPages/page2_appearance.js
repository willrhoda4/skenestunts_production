







import   CloudImage         from '../../CloudImage';

import { useState, 
         useEffect,
         useMemo    }       from 'react';
import   StringDropdown     from '../../FormFunctions/StringDropdown';
import   TextField          from '../../FormFunctions/TextField';
import   NumericalDropdown  from '../../FormFunctions/NumericalDropdown';
import   FileUploader       from '../../FormFunctions/FileUploader';
import   Checkbox           from '../../FormFunctions/Checkbox';



// Page 2 of the contact form is responsible for collecting appearance information.
export default function Page2 ({    rookie,
                                    update, 
                                    newPhotos, 
                                    pageState, 
                                    setNewPhotos,
                                    setPageState, 
                                    setPageError,
                                    setSamePhotos,
                                    performerClass, 
                                    performerOptions, 
                                    setPerformerClass   }) {



    const [  imdbId,              setImdbId             ] = useState('');
    const [  birthYear,           setBirthYear          ] = useState(0);
    const [  headshot,            setHeadshot           ] = useState(false)
    const [  bodyshot,            setBodyshot           ] = useState(false)
    const [  reel,                setReel               ] = useState('');
    const [  union,               setUnion              ] = useState('');
    const [  weight,              setWeight             ] = useState(0);
    const [  height,              setHeight             ] = useState(0);
    const [  gender,              setGender             ] = useState('');
    const [  eyes,                setEyes               ] = useState('');
    const [  hair,                setHair               ] = useState('');

    const [  imdbIdError,         setImdbIdError        ] = useState(false);
    const [  birthYearError,      setBirthYearError     ] = useState(false);
    const [  headshotError,       setHeadshotError      ] = useState(false);
    const [  bodyshotError,       setBodyshotError      ] = useState(false);
    const [  reelError,           setReelError          ] = useState(false);
    const [  weightError,         setWeightError        ] = useState(true);
    const [  heightError,         setHeightError        ] = useState(true);
    const [  genderError,         setGenderError        ] = useState(true);
    const [  unionError,          setUnionError         ] = useState(true);
    const [  eyesError,           setEyesError          ] = useState(true);
    const [  hairError,           setHairError          ] = useState(true);
   
    const [  black,               setBlack              ] = useState(false);
    const [  white,               setWhite              ] = useState(false);
    const [  eastAsian,           setEastAsian          ] = useState(false);
    const [  indigenous,          setIndigenous         ] = useState(false);
    const [  hispanic,            setHispanic           ] = useState(false);
    const [  mena,                setMena               ] = useState(false);
    const [  southAsian,          setSouthAsian         ] = useState(false);

    const [  noReel,              setNoReel             ] = useState(false);
    const [  noImdb,              setNoImdb             ] = useState(false);
    const [  existingShots,       setExistingShots      ] = useState([]);
    const [  valuesLoaded,        setValuesLoaded       ] = useState(false);



    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const facts = useMemo(() => {
    
        return [
            [  imdbId,              setImdbId      ],
            [  birthYear,           setBirthYear   ],
            [  headshot,            setHeadshot    ],
            [  bodyshot,            setBodyshot    ],
            [  reel,                setReel        ],
            [  union,               setUnion       ],
            [  weight,              setWeight      ],
            [  height,              setHeight      ],
            [  gender,              setGender      ],
            [  eyes,                setEyes        ],
            [  hair,                setHair        ],   
            [  black,               setBlack       ],
            [  white,               setWhite       ],
            [  eastAsian,           setEastAsian   ],
            [  indigenous,          setIndigenous  ],
            [  hispanic,            setHispanic    ],
            [  mena,                setMena        ],
            [  southAsian,          setSouthAsian  ],
        ];

    }, [imdbId, birthYear, headshot, bodyshot, reel, union, weight, height, gender, eyes, hair, black, white, eastAsian, indigenous, hispanic, mena, southAsian])

    
    // if returning to or updating page 2, load the values from the pageState array into the local state variables
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === facts.length) {

            setValuesLoaded(true);

            for (let i = 0; i < facts.length; i++) {
                facts[i][1](pageState[i]);
            }
        }
        
    }, [facts, pageState, valuesLoaded])


    // keep the pageState array  populated with the local state  variables 
    useEffect(() => {
        
        setPageState(facts.map(fact => fact[0]))

    }, [facts, setPageState])
    

    // during an update, populate the existingShots array with the former headshot and bodyshot
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setExistingShots([pageState[2],pageState[3]])}, [update])


    useEffect(() => {


        // any error menas the page is in error.
        if ( birthYearError  ||
             headshotError   ||
             bodyshotError   ||
             reelError       ||    
             weightError     || 
             heightError     || 
             genderError     || 
             hairError       ||
             eyesError       ||
             unionError      ){ setPageError(true);  }
        else                  { setPageError(false); }

    }, [birthYearError,headshotError,bodyshotError,reelError,weightError,heightError,genderError,hairError,eyesError,unionError,setPageError])



    // sets the samePhotos state variable to true if the headshot and bodyshot are the same.
    // but disregard this hook during an update when newPhotos hasn't been selected.
    useEffect(() => {

        const photosLoaded = headshot     &&  bodyshot;
        const photosMatch  = photosLoaded &&  headshot.name === bodyshot.name; 
        const notUpdating  = (update      && !newPhotos);

        photosMatch ?  setSamePhotos(true) : setSamePhotos(false);

        notUpdating && setSamePhotos(false);

    }, [ headshot, bodyshot, setSamePhotos, update, newPhotos ] )   

    

    // check for valid imdbId and sets default 'none' value if user opts out.
    useEffect(() => {

        !(  imdbId.toLowerCase().startsWith('nm')   &&
            imdbId.length ===  9       )             ? setImdbIdError(true)
                                                     : setImdbIdError(false);

            if (noImdb)  {  setImdbIdError(false);
                            setImdbId('none');
                         }
   
       }, [imdbId, noImdb]);


    // ensures performer isn't a child or a geriatric
    useEffect(() => { setBirthYearError( birthYear < 1940  ||
                                         birthYear > 2010   );  }, [birthYear]);


    // checks for valid headshot and bodyshot files.
    // in the event of an update or !newPhotos, the error is cleared.
    // useEffect(() => {

    //     const jpegRegEx  =  /^(.)+\.(jpg|jpeg|JPG|JPEG)$/;
    //     const validHead  =  jpegRegEx.exec(headshot.name);
    //     const validBody  =  jpegRegEx.exec(bodyshot.name);

    //     if (headshot) {       !validHead  ?  setHeadshotError(true)
    //                                       :  setHeadshotError(false);
    //                   }
    //     if (bodyshot) {       !validBody  ?  setBodyshotError(true)
    //                                       :  setBodyshotError(false);
    //                   }  
                      
    //     if (update && !newPhotos) {          setHeadshotError(false);
    //                                          setBodyshotError(false);
    //                               }
    // }, [headshot, bodyshot, update, newPhotos]);


    useEffect(() => {

        const validExtensions = [ "jpg", "jpeg" ];
        
        const checkValidFile  = ( file ) => {
            
            if (!file) return false;
            
            const ext = file.name.split('.').pop().toLowerCase();
            
            return validExtensions.includes(ext);
        };
    
        setHeadshotError( headshot ? !checkValidFile(headshot) : false );
        setBodyshotError( bodyshot ? !checkValidFile(bodyshot) : false );
    
        if ( update && !newPhotos ) {
            
            setHeadshotError(false);
            setBodyshotError(false);
        }
    }, [headshot, bodyshot, update, newPhotos]);
    

    // checks for valid reel url and sets default 'none' value if user opts out.
    useEffect(() => {
        
        if (reel)    { let dummy                 = document.createElement('input')
                           dummy.type            = 'url';
                           dummy.value           = reel;
                          !dummy.checkValidity() ? setReelError(true)
                                                 : setReelError(false);
                     }
        if (noReel)  {  setReelError(false);
                        setReel('none');
                     }
   
    }, [noReel, reel]);
    

    useEffect(() =>   { union   &&  setUnionError(false);   }, [union]  );

    useEffect(() =>   { weight  &&  setWeightError(false);  }, [weight] );

    useEffect(() =>   { height  &&  setHeightError(false);  }, [height] );

    useEffect(() =>   { gender  &&  setGenderError(false);  }, [gender] );

    useEffect(() =>   { eyes    &&  setEyesError(false);    }, [eyes]   );

    useEffect(() =>   { hair    &&  setHairError(false);    }, [hair]   );


    /*
        sets the performerClass based on the performer's credentials.
        Non-IMDB members without reels are 'E' class.
        IMDB members without reels are 'D' class.
        Non-IMDB members with reels are 'R' class.
        IMDB members with reels are 'C' class.
    */
    useEffect(() => {       
        
        
        
                   // performers already marked as goodbooks/badbooks
                   // by the team will not be reassigned.
             if (  performerClass === 'A' ||
                   performerClass === 'B' ||
                   performerClass === 'F'          ){ return;                 }


             if (  noImdb &&  noReel                                            ) { setPerformerClass('E'); }
        else if ( !noImdb && !imdbIdError &&  imdbId !== 'none' &&  noReel      ) { setPerformerClass('D'); }        
        else if (  noImdb && !noReel      &&  reel   !== 'none' && !reelError   ) { setPerformerClass('R'); }        
        else if ( !noImdb && !imdbIdError &&  imdbId !== 'none' &&
                  !noReel && !reelError   &&  reel   !== 'none'                 ) { setPerformerClass('C'); }        
            
        
        //      if (  noImdb      &&  noReel         ) { setPerformerClass('E'); }
        // else if ( !imdbIdError &&  noReel         ) { setPerformerClass('D'); }
        // else if ( !imdbIdError && !reelError      ) { setPerformerClass('C'); }
        // else                                        { setPerformerClass('R'); }          

    }, [imdbId, imdbIdError, noImdb, noReel, performerClass, reel, reelError, setPerformerClass])

    
    // lines everything up for checkboxes
    const ethnicities  = [
        ['Black',                          black,            setBlack           ],
        ['White',                          white,            setWhite           ],
        ['East Asian',                     eastAsian,        setEastAsian       ],
        ['Indigenous',                     indigenous,       setIndigenous      ],
        ['Hispanic/Latin American',        hispanic,         setHispanic        ],
        ['Middle Eastern/North African',   mena,             setMena            ],
        ['South Asian',                    southAsian,       setSouthAsian      ],
    ];


    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Appearance / Experience</h2>
                </div>
                {    <div id='noReelBox' style={{paddingBottom: '2em'}} >
                        < Checkbox  
                            name={`I'm not registered with IMDB`}
                            state={noImdb}
                            setter={setNoImdb}
                        />
                    </div>
                }   
                {   !noImdb &&
                    < TextField
                        name='IMDB ID'
                        state={imdbId}
                        setter={setImdbId}
                        error={imdbIdError}
                        instructions='use this format: nm*******'
                        noHelp={true}
                    />
                }


                < NumericalDropdown
                        name='birth year'
                        state={birthYear}
                        setter={setBirthYear}
                        error={birthYearError}
                        min={1940}
                        max={2010}
                        noHelp={true}
                />

                        
        
                {/* during an update when newPhotos hasn't been selected,
                    display existing performer photos and offer a button to
                    engage newPhotos and update old choices. */}
                {   update  && 
                   !newPhotos  ?    <>
                                        <div className='flexRow' style={{alignItems: 'center', justifyContent: 'space-between', width: '80%'}}>
                                            <div className='flexColumn'>
                                                <h5>Headshot</h5>
                                                    <CloudImage id={existingShots[0]} wrapClass='adminPerformerPhoto' />
                                            </div>
                                            <div className='flexColumn' style={{ margin: '1em'}}>
                                                <h5>Bodyshot</h5>
                                                    <CloudImage id={existingShots[1]} wrapClass='adminPerformerPhoto' />
                                            </div>  
                                            <button className='formButton'
                                                        type='button' 
                                                        style={{height: 'fit-content'}}
                                                    onClick={() => setNewPhotos(true)} 
                                            >update shots</button>
                                        </div>
                                    </>
                                :   <>
                                        < FileUploader
                                            name='headshot'
                                            state={headshot}
                                            setter={setHeadshot}
                                            error={headshotError}
                                            instructions='Make it a .jpeg formatted photo, please.'
                                            noHelp={true}
                                        />
                    
                                    
                                        < FileUploader
                                            name='bodyshot'
                                            state={bodyshot}
                                            setter={setBodyshot}
                                            error={bodyshotError}
                                            instructions='Make it a .jpeg formatted photo, please...'
                                            noHelp={true}
                                        />
                                    </>
                }
                {   update && newPhotos && <button className='formButton'
                                                        type='button' 
                                                       style={{margin: '5vmin 0'}}
                                                     onClick={() => setNewPhotos(false)} 
                                            >stick with old shots</button>
                }
                    
               {    <div id='noReelBox' style={{paddingBottom: '2em'}} >
                        < Checkbox  
                            name={'I do not have a reel posted online.'}
                            state={noReel}
                            setter={setNoReel}
                        />
                    </div>
                }   

                {   !noReel &&
                        < TextField
                            name='URL to latest reel'
                            state={reel}
                            setter={setReel}
                            error={reelError}
                            instructions='Enter a valid web address'
                            noHelp={true}
                        />
                }


                <div id='dropdownGrid'>
                   
                    < StringDropdown
                        name='union'
                        state={union}
                        setter={setUnion}
                        error={unionError}
                        options={performerOptions.union}
                        noHelp={true}
                    />

                
                    < NumericalDropdown
                        name='weight'
                        weight={true}
                        state={weight}
                        setter={setWeight}
                        error={weightError}
                        min={100}
                        max={300}
                        noHelp={true}
                    />
                

                    < NumericalDropdown
                        name='height'
                        height={true}
                        state={height}
                        setter={setHeight}
                        error={heightError}
                        min={48}
                        max={96}
                        noHelp={true}
                    />

            
                    < StringDropdown
                        name='gender'
                        state={gender}
                        setter={setGender}
                        error={genderError}
                        options={performerOptions.gender}
                        noHelp={true}
                    />

                    < StringDropdown
                        name='eyes'
                        state={eyes}
                        setter={setEyes}
                        error={eyesError}
                        options={performerOptions.eyes}
                        noHelp={true}
                    />

                    < StringDropdown
                        name='hair'
                        state={hair}
                        setter={setHair}
                        error={hairError}
                        options={performerOptions.hair}
                        noHelp={true}
                    />

                     
                </div>

                <h3>Ethnicity</h3>
                    <h5 style={{margin:'0 0 1em'}}>Check as many as applicable</h5>
                    <div id='ethnicityGrid'>
                        {  ethnicities.map( (ethnicity, index) => < Checkbox    key={index}
                                                                                sort='ethnicities'
                                                                                name={ethnicity[0]}
                                                                                state={pageState[index + 11]}
                                                                                setter={ethnicity[2]}
                                                                />
                                        ) 
                        }
                </div>

   
    </>)
}