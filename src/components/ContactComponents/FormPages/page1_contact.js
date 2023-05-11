







import { useState, 
         useEffect, 
         useMemo    }   from 'react';
import   StringDropdown from '../../FormFunctions/StringDropdown';
import   TextField      from '../../FormFunctions/TextField';



// Page 1 of the contact form is responsible for collecting conatact information.
// it won't allow propgressing to the next page until all fields are filled out properly.
// it also checks for duplicate emails in the database and prevents submission if one is found.
export default function Page1 ({pageState, setPageState, setPageError, performerOptions, update}) {


    const [  firstName,             setFirstName        ] = useState('');
    const [  lastName,              setLastName         ] = useState('');
    const [  email,                 setEmail            ] = useState('');
    const [  phone,                 setPhone            ] = useState('');
    const [  province,              setProvince         ] = useState('');
    const [  pronouns,              setPronouns         ] = useState('');
   
    const [  firstNameError,        setFirstNameError   ] = useState(false);
    const [  lastNameError,         setLastNameError    ] = useState(false);
    const [  emailError,            setEmailError       ] = useState(false);
    const [  phoneError,            setPhoneError       ] = useState(false);
    const [  provinceError,         setProvinceError    ] = useState(true);
    const [  pronounsError,         setPronounsError    ] = useState(true);

    const [  valuesLoaded,          setValuesLoaded     ] = useState(false);

    

    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const facts = useMemo(() => {
        
        return [
            [  firstName,  setFirstName  ],
            [  lastName,   setLastName   ],
            [  email,      setEmail      ],
            [  phone,      setPhone      ],
            [  province,   setProvince   ],
            [  pronouns,   setPronouns   ],
        ];
    }, [firstName, lastName, email, phone, province, pronouns])
        


    // if values haven't been loaded yet, load them.
    // this is to prevent the page from resetting the values when the user goes back to the page.
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === facts.length) {

            // hack to prevent racing behaviour
            setValuesLoaded(true);

            for (let i = 0; i < facts.length; i++) {
                facts[i][1](pageState[i]);
            }
        }
        
    }, [facts, pageState, valuesLoaded])


    // if there's any change to the component's local state,
    // update the page state in the parent component.
    useEffect(() => {
        
        setPageState(facts.map(fact => fact[0]))

    }, [facts, setPageState])
  
    
    
    // if there's any error in the form, set the page error in the parent component.
    useEffect(() => {

        if ( firstNameError  ||
             lastNameError   ||
             emailError      ||
             phoneError      ||
             provinceError   ||
             pronounsError   ){ setPageError(true);  }
             else             { setPageError(false); }


    }, [firstNameError, lastNameError, emailError, phoneError, provinceError, pronounsError, setPageError]);



    useEffect(() => { setFirstNameError(firstName.length === 0); }, [firstName]);


    useEffect(() => { setLastNameError(lastName.length === 0)    }, [lastName]);

     
    useEffect(() => { setEmailError(    email.indexOf('@')  ===  -1   ||
                                        email.indexOf('.')  ===  -1    ) }, [email]);


    useEffect(() => {

        const phoneRegEx   = /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/;
        const validPhone   = phoneRegEx.exec(phone);

        setPhoneError(!validPhone);    

    }, [phone]);


    useEffect(() => { province && setProvinceError(false); }, [province])

    
    useEffect(() => { pronouns && setPronounsError(false); }, [pronouns])


    return (<>
    
            <div className='formPageH2Wrapper'>
                <h2 className='formPageH2'>Contact</h2>
            </div>

            < TextField
                name='first name'
                state={firstName}
                setter={setFirstName}
                error={firstNameError}
                instructions='As it appears on your birth certificate'
                noHelp={true}
            />

    
            < TextField
                name='last name'
                state={lastName}
                setter={setLastName}
                error={lastNameError}
                instructions='As it appears on your birth certificate'
                noHelp={true}
            />

        
            < TextField
                name='email'
                state={email}
                setter={setEmail}
                error={emailError}
                instructions='A valid address is required.'
                noHelp={true}
            />
            

            < TextField
                name='phone'
                state={phone}
                setter={setPhone}
                error={phoneError}
                instructions='Use this format: ###-###-####'
                noHelp={true}
            />

            {/* options for string dropdowns provided courtesy of performerOptions */}
            < StringDropdown
                name='province'
                state={province}
                setter={setProvince}
                error={provinceError}
                options={performerOptions.province}
                noHelp={true}
            />

            < StringDropdown
                name='pronouns'
                state={pronouns}
                setter={setPronouns}
                error={pronounsError}
                options={performerOptions.pronouns}
                noHelp={true}
            />
       
    </>)
}


