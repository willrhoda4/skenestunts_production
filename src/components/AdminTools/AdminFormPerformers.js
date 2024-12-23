







import './AdminTools.css'

import { useState, useEffect } from 'react';


import Toggle             from '../FormFunctions/Toggle';
import Slider             from '../FormFunctions/Slider';   
import Checkbox           from '../FormFunctions/Checkbox.js';
import NumericalDropdown  from '../FormFunctions/NumericalDropdown.js';
import StringDropdown     from '../FormFunctions/StringDropdown.js';
import TextField          from '../FormFunctions/TextField.js';
import Notification       from '../Notification.js';

import dropdownIcon       from '../../images/icon_dropdown.svg'
import popUpIcon          from '../../images/icon_popup.svg'






export default function PerformerForm ({loadData, currentData, setCurrentData, table, performerOptions}) {


    
    // togles between some filters and all filter on form
    const [  moreFilters,         setMoreFilters          ] = useState(false);


    // state for potential filter values
    const [  firstName,           setFirstName            ] = useState('');
    const [  lastName,            setLastName             ] = useState('');
    const [  email,               setEmail                ] = useState('');
    const [  phone,               setPhone                ] = useState('');
    const [  imdbId,              setImdbId               ] = useState('');
    const [  age,                 setAge                  ] = useState('');
    const [  ageWithin,           setAgeWithin            ] = useState('');

    const [  province,            setProvince             ] = useState('');
    const [  union,               setUnion                ] = useState('');
    const [  weightMin,           setWeightMin            ] = useState('');
    const [  weightMax,           setWeightMax            ] = useState('');
    const [  heightMin,           setHeightMin            ] = useState('');
    const [  heightMax,           setHeightMax            ] = useState('');
    const [  gender,              setGender               ] = useState('');
    const [  eyes,                setEyes                 ] = useState('');
    const [  hair,                setHair                 ] = useState('');
    const [  ethnicity,           setEthnicity            ] = useState('');
    const [  performerClass,      setPerformerClass       ] = useState('');
    const [  skill1,              setSkill1               ] = useState('');
    const [  skill2,              setSkill2               ] = useState('');
    const [  skill3,              setSkill3               ] = useState('');
   
    // false indicates aspiring, true indicates experienced
    const [  formUsed,            setFormUsed             ] = useState(false);

    // state to activate/deactivate filters
    const [  firstNameSwitch,      setFirstNameSwitch       ] = useState(false);
    const [  lastNameSwitch,       setLastNameSwitch        ] = useState(false);
    const [  emailSwitch,          setEmailSwitch           ] = useState(false);
    const [  phoneSwitch,          setPhoneSwitch           ] = useState(false);
    const [  imdbIdSwitch,         setImdbIdSwitch          ] = useState(false);
    const [  ageSwitch,            setAgeSwitch             ] = useState(false);
    const [  provinceSwitch,       setProvinceSwitch        ] = useState('');
    const [  unionSwitch,          setUnionSwitch           ] = useState(false);
    const [  weightSwitch,         setWeightSwitch          ] = useState(false);
    const [  heightSwitch,         setHeightSwitch          ] = useState(false);
    const [  genderSwitch,         setGenderSwitch          ] = useState(false);
    const [  eyesSwitch,           setEyesSwitch            ] = useState(false);
    const [  hairSwitch,           setHairSwitch            ] = useState(false);
    const [  ethnicitySwitch,      setEthnicitySwitch       ] = useState(false);
    const [  skill1Switch,         setSkill1Switch          ] = useState(false);
    const [  skill2Switch,         setSkill2Switch          ] = useState(false);
    const [  skill3Switch,         setSkill3Switch          ] = useState(false);
    const [  classSwitch,          setClassSwitch           ] = useState(false);
    const [  formUsedSwitch,       setFormUsedSwitch        ] = useState(false);


    // state to activate/deactivate error messages
    const [  firstNameError,      setFirstNameError       ] = useState(false);
    const [  lastNameError,       setLastNameError        ] = useState(false);
    const [  emailError,          setEmailError           ] = useState(false);
    const [  phoneError,          setPhoneError           ] = useState(false);
    const [  imdbIdError,         setImdbIdError          ] = useState(false);
    const [  ageError,            setAgeError             ] = useState(false);
    const [  weightError,         setWeightError          ] = useState(true);
    const [  heightError,         setHeightError          ] = useState(true);
    const [  genderError,         setGenderError          ] = useState(true);
    const [  provinceError,       setProvinceError        ] = useState(true);
    const [  unionError,          setUnionError           ] = useState(true);
    const [  eyesError,           setEyesError            ] = useState(true);
    const [  hairError,           setHairError            ] = useState(true);
    const [  ethnicityError,      setEthnicityError       ] = useState(true);
    const [  classError,          setClassError           ] = useState(true);
    const [  skill1Error,         setSkill1Error          ] = useState('');
    const [  skill2Error,         setSkill2Error          ] = useState('');
    const [  skill3Error,         setSkill3Error          ] = useState('');


    // state to activate/deactivate error messages
    const [  errorMsg,            setErrorMsg             ] = useState(false);

    // state associated with ordeBy query option
    const [  orderBy,             setOrderBy              ] = useState(false);
    const [  orderBySwitch,       setOrderBySwitch        ] = useState(false);
    const [  orderByError,        setOrderByError         ] = useState(true);
    const [  ascending,           setAscending            ] = useState(false)
    
    // state associated with limit query option
    const [  limit,               setLimit                ] = useState(50);
    const [  limitSwitch,         setLimitSwitch          ] = useState(true);


    // column lists for dropdown imported from performerOptions
    const eyeOptions       = performerOptions.eyes;
    const hairOptions      = performerOptions.hair.sort();
    const skillOptions     = performerOptions.columns.flat().slice(24).sort();
    const provinceOptions  = performerOptions.province;
    const unionOptions     = performerOptions.union;
    const genderOptions    = performerOptions.gender;
    const ethnicityOptions = performerOptions.columns.flat().slice(16,24).sort();

    // all orderable optins
    const orderByOptions   = [ 'performer_class', 'province', 'first_name', 'last_name', 'weight', 'height', 'age' ];

    // class options for internal talent categorization
    const classOptions     = 'ABCDEF'.split('');


    // gear arays called by filter function to spin up filter components. 
    
                             //Each array contains the following:
                            //    0 - name              1 -  state                    2 - setter                        3 - switch         4 -  switch setter    5 -  error         6 -  type       7 - range/options   8 - case-insensitive

    const firstNameGear    = [   'first_name',          firstName,                    setFirstName,                     firstNameSwitch,   setFirstNameSwitch,   firstNameError,   'text_field',    null,               true        ];
    const lastNameGear     = [   'last_name',           lastName,                     setLastName,                      lastNameSwitch,    setLastNameSwitch,    lastNameError,    'text_field',    null,               true        ];
    const emailGear        = [   'email',               email,                        setEmail,                         emailSwitch,       setEmailSwitch,       emailError,       'text_field',    null,               true        ];
    const phoneGear        = [   'phone',               phone,                        setPhone,                         phoneSwitch,       setPhoneSwitch,       phoneError,       'text_field'                                     ];
    const imdbIdGear       = [   'imdb_id',             imdbId,                       setImdbId,                        imdbIdSwitch,      setImdbIdSwitch,      imdbIdError,      'text_field',    null,               true        ];
    const weightGear       = [   'weight',            [ weightMin,weightMax ],      [ setWeightMin,setWeightMax ],      weightSwitch,      setWeightSwitch,      weightError,      'int_select',  [ 120,300 ]                       ];
    const ageGear          = [   'age',               [ age,ageWithin ],            [ setAge,setAgeWithin       ],      ageSwitch,         setAgeSwitch,         ageError,         'int_select'                                     ];
    const heightGear       = [   'height',            [ heightMin,heightMax ],      [ setHeightMin,setHeightMax ],      heightSwitch,      setHeightSwitch,      heightError,      'int_select',  [ 36,96 ]                         ];
    const provinceGear     = [   'province',            province,                     setProvince,                      provinceSwitch,    setProvinceSwitch,    provinceError,    'str_select',    provinceOptions                 ];
    const unionsGear       = [   'workers_union',       union,                        setUnion,                         unionSwitch,       setUnionSwitch,       unionError,       'str_select',    unionOptions                    ];
    const genderGear       = [   'gender',              gender,                       setGender,                        genderSwitch,      setGenderSwitch,      genderError,      'str_select',    genderOptions                   ];
    const eyesGear         = [   'eyes',                eyes,                         setEyes,                          eyesSwitch,        setEyesSwitch,        eyesError,        'str_select',    eyeOptions                      ];
    const hairGear         = [   'hair',                hair,                         setHair,                          hairSwitch,        setHairSwitch,        hairError,        'str_select',    hairOptions                     ];
    const ethnicityGear    = [   'ethnicity',           ethnicity,                    setEthnicity,                     ethnicitySwitch,   setEthnicitySwitch,   ethnicityError,   'str_select',    ethnicityOptions                ];
    const skill1Gear       = [   'skill1',              skill1,                       setSkill1,                        skill1Switch,      setSkill1Switch,      skill1Error,      'str_select',    skillOptions                    ];
    const skill2Gear       = [   'skill2',              skill2,                       setSkill2,                        skill2Switch,      setSkill2Switch,      skill2Error,      'str_select',    skillOptions                    ];
    const skill3Gear       = [   'skill3',              skill3,                       setSkill3,                        skill3Switch,      setSkill3Switch,      skill3Error,      'str_select',    skillOptions                    ];
    const classGear        = [   'performer_class',     performerClass,               setPerformerClass,                classSwitch,       setClassSwitch,       classError,       'str_select',    classOptions                    ];
    const formUsedGear     = [   'form_used',           formUsed,                     setFormUsed,                      formUsedSwitch,    setFormUsedSwitch,    null,             'toggle',     [ 'aspiring', 'experienced' ]      ];

    // the order by gear is excluded from the allFilters array.
    // this is because the orderBy gear is not a true filter, but a query option.
    const orderByGear      = [   'order_by',            orderBy,                      setOrderBy,                       orderBySwitch,     setOrderBySwitch,     orderByError,     'str_select',    orderByOptions                  ]; 


    // bundled for iterative traversal
    const allFilters       = [  
                                firstNameGear,
                                ethnicityGear,
                                lastNameGear,
                                formUsedGear,
                                provinceGear,
                                imdbIdGear,
                                unionsGear,
                                genderGear,
                                weightGear,
                                heightGear,
                                skill1Gear,
                                skill2Gear,
                                skill3Gear,
                                classGear,
                                emailGear,
                                phoneGear,
                                eyesGear,
                                hairGear,
                                ageGear,
                            ];

       


    // error handlers galore
    useEffect(() => { setFirstNameError(firstName.length  ===   0);        }, [firstName]   );



    useEffect(() => { setLastNameError( lastName.length  ===   0);         }, [lastName]    );

     

    useEffect(() => { setEmailError(     email.indexOf('@')  ===  -1   ||
                                         email.indexOf('.')  ===  -1    )  }, [email]       );


    useEffect(() => { setImdbIdError(!(  imdbId.startsWith('nm')   &&
                                         imdbId.length ===  9       )   )  }, [imdbId]      );


    useEffect(() => {

        const phoneRegEx   = /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/;
        const validPhone   = phoneRegEx.exec(phone);

        setPhoneError(!validPhone);

    }, [phone]);

    

    useEffect(() => {   setAgeError(!(age && ageWithin)); }, [age, ageWithin])



    useEffect(() => {   setWeightError(weightMin<weightGear[7][0] || weightMax>weightGear[7][1]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weightMin, weightMax])


    useEffect(() => {   setHeightError(heightMin<heightGear[7][0] || heightMax>heightGear[7][1]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [heightMin, heightMax])




    useEffect(() =>   { province          && setProvinceError(false);       }, [province]       )

    useEffect(() =>   { union             && setUnionError(false);          }, [union]          )

    useEffect(() =>   { gender            && setGenderError(false);         }, [gender]         )

    useEffect(() =>   { eyes              && setEyesError(false);           }, [eyes]           )

    useEffect(() =>   { hair              && setHairError(false);           }, [hair]           )

    useEffect(() =>   { ethnicity         && setEthnicityError(false);      }, [ethnicity]      )

    useEffect(() =>   { skill1            && setSkill1Error(false);         }, [skill1]         )

    useEffect(() =>   { skill2            && setSkill2Error(false);         }, [skill2]         )

    useEffect(() =>   { skill3            && setSkill3Error(false);         }, [skill3]         )

    useEffect(() =>   { orderBy           && setOrderByError(false);        }, [orderBy]        )
    
    useEffect(() =>   { performerClass    && setClassError(false);          }, [performerClass] )




    // you guessed it, this is the filter function.
    function filter (name, filterState, setFilterState, filterSwitch, setFilterSwitch, filterError, inputType, inputOptions) {

        return (<>
        
            <div className='performerFilter'>

                {/* this is the checkbox that activates or deactivates the filter
                    using its specified switch state. */}
                < Checkbox  state={filterSwitch} setter={setFilterSwitch} />


                {/* the function uses the name argument (derived from the front of the filter's gear array)
                    to determine what kind of filter it needs to conjure. */}
                {
                     
                    // this edge case works similarly to the int_select case,
                    // but we hardcode min/max values and manipulate the name prop differently.
                    // the idea is that the team can pick an ideal age +/- n years,
                    // instead of setting an upper and lower limit.
                     name === 'age'                ?   <div className='flexColumn'>

                                                            < NumericalDropdown
                                                                noHelp={true}
                                                                name={name}
                                                                state={filterState[0]}
                                                                setter={setFilterState[0]}
                                                                error={filterError}
                                                                min={12}
                                                                max={121}
                                                            />

                                                            < NumericalDropdown
                                                                noHelp={true}
                                                                name={'within'}
                                                                state={filterState[1]}
                                                                setter={setFilterState[1]}
                                                                error={filterError}
                                                                min={1}
                                                                max={51}
                                                            />

                                                        </div>


                    // this is the more common case for numerical ranges. 
                    // min/max values are declared in the gear array.
                    // the name prop is altered to include min/max for display purposes.
                    : inputType === 'int_select'      ? <div className='flexColumn'>

                                                                < NumericalDropdown
                                                                    height={ name === 'height' }
                                                                    weight={ name === 'weight' }
                                                                    noHelp={true}
                                                                    name={name.replaceAll('_', ' ')+' min'}
                                                                    state={filterState[0]}
                                                                    setter={setFilterState[0]}
                                                                    error={filterError}
                                                                    min={inputOptions[0]}
                                                                    max={inputOptions[1]}
                                                                />
                                                                    
                                                                < NumericalDropdown
                                                                    height={ name === 'height' }
                                                                    weight={ name === 'weight' }
                                                                    noHelp={true}
                                                                    name={name.replaceAll('_', ' ')+' max'}
                                                                    state={filterState[1]}
                                                                    setter={setFilterState[1]}
                                                                    error={filterError}
                                                                    min={inputOptions[0]}
                                                                    max={inputOptions[1]}
                                                                />

                                                        </div>

                    // this option covers dropdowns populated by a list of strings.
                    // think skills, provinces, pronouns, eye color, etc.
                    // it also covers the order_by dropdown, which is a sort of second-lay[r filter.
                    :   inputType === 'str_select'  ?  < StringDropdown
                                                            noHelp={true}
                                                            name={name.replaceAll('_', ' ')}
                                                            state={filterState}
                                                            setter={setFilterState}
                                                            error={filterError}
                                                            options={inputOptions}
                                                        />
                    

                    // the toggle filter was added last minute to accommodate the form_used filter,
                    // which tracks whether the user signed up as an aspiring or experienced performer.
                    :   inputType === 'toggle'       ?  <Toggle    
                                                            name={name.replaceAll('_', ' ')}
                                                            state={filterState}
                                                            setter={setFilterState}
                                                            disengaged={inputOptions[0]}
                                                            engaged={inputOptions[1]}
                                                        />


                    // anything that doesn't fit the above criteria should be a text field.
                    // this includes, names, phone numbers, email addresses and IMDB IDs.
                    :   inputType === 'text_field'  ?  < TextField
                                                            noHelp={true}
                                                            name={name.replaceAll('_', ' ')}
                                                            state={filterState}
                                                            setter={setFilterState}
                                                            error={filterError}
                                                        />
                    :   null
                }

            </div>
        </>)


    }


    // this is the function that actually performs the search.
    function queryPerformers () {


            // decalare an array to be loaded with filters.
            let queryFilters = [];


            // iterate through all the filters.
            for (let i = 0; i < allFilters.length; i++) {


                // if the filter switch is engaged...
                if ( allFilters[i][3]) {


                    // check for errors, and if there are any, return an error message.
                         if ( allFilters[i][5]                     ) { return setErrorMsg('error'); }
                        
                    // check if it's the age filter, and if so, calculate the birthyear range.
                    else if ( allFilters[i][0] === 'age'           ) { queryFilters.push([  'birthyear', 
                                                                                            // min  birthyear
                                                                                            new Date().getFullYear() - allFilters[i][1][0] - allFilters[i][1][1] - 1, 
                                                                                            // max birthyear
                                                                                            new Date().getFullYear() - allFilters[i][1][0] + allFilters[i][1][1] + 1 
                                                                                        ]);}

                    // for int_select filters, we need the name and two state variables.                                                                    
                    else if ( allFilters[i][6] === 'int_select'    ) { queryFilters.push([ allFilters[i][0], 
                                                                                           allFilters[i][1][0], 
                                                                                           allFilters[i][1][1]  
                                                                                         ]);}

                    // for skill and ethnicity filters, we only need the state variable,
                    // since we're dealing with booleans.                                                                     
                    else if ( allFilters[i][0].includes('skill')  ||
                              allFilters[i][0] === 'ethnicity'     ) { queryFilters.push([ allFilters[i][1], 
                                                                                           true
                                                                                         ]);}

                    // for the form_used filter we'll check the experienced column in the db                                                                     
                    else if ( allFilters[i][0] === 'form_used'     ) { queryFilters.push([ 'experienced', 
                                                                                            allFilters[i][1]
                    ]);}


                    // if a filter has been labelled as case-insensitive, 
                    // we need to add ILIKE to index 2, to let the server know.                                                                     
                    else if ( allFilters[8]                        ) { queryFilters.push([ allFilters[i][0], 
                                                                                           allFilters[i][1],
                                                                                           'ILIKE'
                                                                                         ]);}

                    // if none of the above edgecases apply, we can just push the name and  state variable.
                    else                                             { queryFilters.push([ allFilters[i][0], 
                                                                                           allFilters[i][1]
                                                                                         ]);}
                  
                // if the filter switch is off, we can skip to the next filter.
                } else { continue; }
            }

            // if there are no filters engaged, return an error message.
            // otherwise, clear the error message.
            if (queryFilters.length === 0) { return setErrorMsg('filterless'); }
            else                           {        setErrorMsg(false);        }
            

            // if the order_by switch is engaged, we neeed to specify
            // an order for loadData to use.
            // note that age is a special case, since birthyear is the column in the database.
            // the presence of a second value in the array indicates descending order to the server.
            const order      =     !orderBySwitch                      ?   null             
                                 :  orderBy === 'age' && ascending     ? ['birthyear', true ]     
                                 :  orderBy === 'age'                  ?  'birthyear'
                                 :  ascending                          ? [ orderBy,    true ]
                                 :                                         orderBy

            // if the limit switch is engaged, we need to specify a limit for loadData to use.
            const queryLimit = limitSwitch ? limit : null
            

            // after all that, we can finally call loadData with the filters we've built,
            // and it should run just like in any other page of the Director's Chair.
            loadData( table, order, queryFilters, queryLimit );          
                    
    }

    return (
        
        <div className='adminForm'>

            <h2 className='formTitle' style={{marginBottom: '1.5em'}}>Query Database</h2> 

            <div className='adminFormFields'>

                    {/* four basic filters are always displayed */}
                    { filter(...weightGear)}
                    { filter(...heightGear)}
                    { filter(...ageGear   )}
                    { filter(...genderGear)}
                

                {/* this button is displayed next, until you push it and the rest of the filters appear. */}
                { !moreFilters && 
                    <button className='adminPerformerFormButton' 
                                 type='button' 
                              onClick={() => setMoreFilters(true)}
                    >{ <img alt='dropdown icon'
                            src={dropdownIcon} /> 
                     }More Filters</button>
                }

                {  moreFilters &&
                    <>
                        
                            {/*  the rest of the filters */}
                            { filter(...provinceGear)  }
                            { filter(...skill1Gear)    }
                            { filter(...skill2Gear)    }
                            { filter(...skill3Gear)    } 
                            { filter(...ethnicityGear) }
                            { filter(...unionsGear)    }
                            { filter(...classGear)     }
                            { filter(...eyesGear)      }
                            { filter(...hairGear)      }
                            { filter(...imdbIdGear)    }
                            { filter(...firstNameGear) }
                            { filter(...lastNameGear)  }
                            { filter(...emailGear)     }
                            { filter(...phoneGear)     }
                            { filter(...formUsedGear)  }
                    
                        {/* button to disappear the rest of the filters */}
                        <button className='adminPerformerFormButton' 
                                     type='button' 
                                  onClick={() => setMoreFilters(false)}
                        >{ <img alt='dropdown icon'
                                src={popUpIcon} /> 
                        }Less Filters</button>
                
                    </>
                }
           
                {/* the order_by filter */}
                { filter(...orderByGear)}

                {/* slider bounces between ascending and descending for order_by */}
                <Toggle    
                        name='orderByToggle'
                       state={ascending}
                      setter={setAscending}
                  disengaged='descending'
                     engaged='ascending'
                />

                <div style={{display: 'flex', alignItems: 'center'}} >

                    {/* the limit filter activator */}
                    < Checkbox  state={limitSwitch} setter={setLimitSwitch} />
                    
                    {/* the limit filter */}
                    <Slider    
                         name='Limit'
                        state={limit}
                       setter={setLimit}
                          min={0}
                          max={100}
                    />

                </div>

                
                {/* the button to submit the query */}
                <button className='formButton' type='button' onClick={() => queryPerformers()}>Query</button>


                {/* notification handler */}
                {   errorMsg === 'error'       ? <Notification type='bad'  msg='Looks like something is filled out incorrectly. Make sure the lights next to active filters are shining green, then try again.' />
                  : errorMsg === 'filterless'  ? <Notification type='bad'  msg='You need to set at least one filter before making a query' />   
                  : currentData.length === 0   ? <Notification type='bad'  msg='No matches found.'                  />
                  : currentData.length === 1   ? <Notification type='good' msg='Only returned a single match...'         />
                  : currentData.length  >  1   ? <Notification type='good' msg={`Displaying ${currentData.length} results`} />  
                  :                               null
                }
            </div>    
        </div>
           
   )
}

    