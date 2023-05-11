







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 4 covers sports skills
export default function Page4 ({pageState, setPageState}) {

    const [  football,      setFootball      ] = useState(false);
    const [  baseball,      setBaseball      ] = useState(false);
    const [  basketball,    setBasketball    ] = useState(false);
    const [  cheerleading,  setCheerleading  ] = useState(false);
    const [  dance,         setDance         ] = useState(false);
    const [  gymnastics,    setGymnastics    ] = useState(false);
    const [  hockeyField,   setHockeyField   ] = useState(false);
    const [  hockeyIce,     setHockeyIce     ] = useState(false);
    const [  hockeyStreet,  setHockeyStreet  ] = useState(false);
    const [  lacrosse,      setLacrosse      ] = useState(false);
    const [  rugby,         setRugby         ] = useState(false);
    const [  soccer,        setSoccer        ] = useState(false);
    const [  softball,      setSoftball      ] = useState(false);
    const [  volleyball,    setVolleyball    ] = useState(false);
    const [  tennis,        setTennis        ] = useState(false);
    const [  fencing,       setFencing       ] = useState(false);
    
    const [  valuesLoaded,  setValuesLoaded  ] = useState(false);
    

    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
            [  'American Football',     football,      setFootball      ],
            [  'Baseball',              baseball,      setBaseball      ],
            [  'Basketball',            basketball,    setBasketball    ],
            [  'Cheerleading',          cheerleading,  setCheerleading  ],
            [  'Dance',                 dance,         setDance         ],
            [  'Gymnastics',            gymnastics,    setGymnastics    ],
            [  'Field Hockey',          hockeyField,   setHockeyField   ],
            [  'Ice Hockey',            hockeyIce,     setHockeyIce     ],
            [  'Inline/Street Hockey',  hockeyStreet,  setHockeyStreet  ],
            [  'Lacrosse',              lacrosse,      setLacrosse      ],
            [  'Rugby',                 rugby,         setRugby         ],
            [  'Soccer',                soccer,        setSoccer        ],
            [  'Softball',              softball,      setSoftball      ],
            [  'Volleyball',            volleyball,    setVolleyball    ],
            [  'Tennis',                tennis,        setTennis        ],
            [  'Fencing',               fencing,       setFencing       ]
        ];
    }, [baseball, basketball, cheerleading, dance, fencing, football, gymnastics, hockeyField, hockeyIce, hockeyStreet, lacrosse, rugby, soccer, softball, tennis, volleyball])



    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded]);


    // update pageState when any of the checkboxes are clicked
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);



    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Skills 2/6: Sports</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                sort='sports'
                                                                name={skill[0]}
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}