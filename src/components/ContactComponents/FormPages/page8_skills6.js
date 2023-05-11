







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 8 covers miscellaneous skills
export default function Page8 ({pageState, setPageState}) {

    const [  airRams,           setAirRams           ] = useState(false);
    const [  archeryHorseback,  setArcheryHorseback  ] = useState(false);
    const [  archeryTarget,     setArcheryTarget     ] = useState(false);
    const [  circusTraining,    setCircusTraining    ] = useState(false);
    const [  rockClimbing,      setRockClimbing      ] = useState(false);
    const [  descenderWork,     setDescenderWork     ] = useState(false);
    const [  fireBurns,         setFireBurns         ] = useState(false);
    const [  fireSafety,        setFireSafety        ] = useState(false);
    const [  hangGliding,       setHangGliding       ] = useState(false);
    const [  highFalls,         setHighFalls         ] = useState(false);
    const [  parkour,           setParkour           ] = useState(false);
    const [  prostheticWork,    setProstheticWork    ] = useState(false);
    const [  skydiving,         setSkydiving         ] = useState(false);
    const [  slacklining,       setSlacklining       ] = useState(false);
    const [  stairFalls,        setStairFalls        ] = useState(false);
    const [  trampoline,        setTrampoline        ] = useState(false);
    const [  wireWork,          setWireWork          ] = useState(false);
    const [  stuntActor,        setStuntActor        ] = useState(false);

    const [  valuesLoaded,      setValuesLoaded      ] = useState(false);

    
    
    
    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
            [  'Air Rams',              airRams,           setAirRams           ],
            [  'Archery - Horseback',   archeryHorseback,  setArcheryHorseback  ],
            [  'Archery - Target',      archeryTarget,     setArcheryTarget     ],
            [  'Circus Training',       circusTraining,    setCircusTraining    ],
            [  'Rock Climbing',         rockClimbing,      setRockClimbing      ],
            [  'Descender Work',        descenderWork,     setDescenderWork     ],
            [  'Fire Burns',            fireBurns,         setFireBurns         ],
            [  'Fire Safety',           fireSafety,        setFireSafety        ],
            [  'Hang Gliding',          hangGliding,       setHangGliding       ],
            [  'High Falls',            highFalls,         setHighFalls         ],
            [  'Parkour',               parkour,           setParkour           ],
            [  'Prosthetic Work',       prostheticWork,    setProstheticWork    ],
            [  'Skydiving',             skydiving,         setSkydiving         ],
            [  'Slacklining',           slacklining,       setSlacklining       ],
            [  'Stair Falls',           stairFalls,        setStairFalls        ],
            [  'Trampoline',            trampoline,        setTrampoline        ],
            [  'Wire Work',             wireWork,          setWireWork          ],
            [  'Actor/Stunt Peformer',  stuntActor,        setStuntActor        ]
        ];
    }, [airRams, archeryHorseback, archeryTarget, circusTraining, descenderWork, fireBurns, fireSafety, hangGliding, highFalls, parkour, prostheticWork, rockClimbing, skydiving, slacklining, stairFalls, stuntActor, trampoline, wireWork]);


    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded])



    // update pageState when any of the checkboxes are clicked
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);



    return (<>
               <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Skills 6/6: Other</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                name={skill[0]}
                                                                sort='other'
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}