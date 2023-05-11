







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 9 covers driving skills
export default function Page9 ({pageState, setPageState}) {

    const [  licenseClass1,  setLicenseClass1  ] = useState(false);
    const [  licenseClass2,  setLicenseClass2  ] = useState(false);
    const [  licenseClass3,  setLicenseClass3  ] = useState(false);
    const [  licenseClass4,  setLicenseClass4  ] = useState(false);
    const [  licenseClass5,  setLicenseClass5  ] = useState(false);
    const [  licenseClass6,  setLicenseClass6  ] = useState(false);
    const [  airBrake,       setAirBrake       ] = useState(false);
    const [  trailerHeavy,   setTrailerHeavy   ] = useState(false);
    const [  trailerHouse,   setTrailerHouse   ] = useState(false);
   
    const [  valuesLoaded,   setValuesLoaded   ] = useState(false);


    
    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
            [  'Class 1 License',            licenseClass1,  setLicenseClass1  ],
            [  'Class 2 License',            licenseClass2,  setLicenseClass2  ],
            [  'Class 3 License',            licenseClass3,  setLicenseClass3  ],
            [  'Class 4 License',            licenseClass4,  setLicenseClass4  ],
            [  'Class 5 License',            licenseClass5,  setLicenseClass5  ],
            [  'Class 6 License',            licenseClass6,  setLicenseClass6  ],
            [  'Air Brake Endorsement',      airBrake,       setAirBrake       ],
            [  'Heavy-Trailer Endorsement',  trailerHeavy,   setTrailerHeavy   ],
            [  'House-Trailer Endorsement',  trailerHouse,   setTrailerHouse   ],
        ];
    }, [airBrake, licenseClass1, licenseClass2, licenseClass3, licenseClass4, licenseClass5, licenseClass6, trailerHeavy, trailerHouse]);


    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded])


    // update pageState when skills change
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);

    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Driver's Licenses</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                sort='driving'
                                                                name={skill[0]}
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}