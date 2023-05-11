







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 5 covers riding skills
export default function Page5 ({pageState, setPageState}) {

    const [  drivingStunts,     setDrivingStunts     ] = useState(false);
    const [  drivingPrecision,  setDrivingPrecision  ] = useState(false);
    const [  nascar,            setNascar            ] = useState(false);
    const [  quadRiding,        setQuadRiding        ] = useState(false);
    const [  quadTricks,        setQuadTricks        ] = useState(false);
    const [  motorcycleRiding,  setMotorcycleRiding  ] = useState(false);
    const [  motorcycleTricks,  setMotorcycleTricks  ] = useState(false);
    const [  dirtBikeRiding,    setDirtBikeRiding    ] = useState(false);
    const [  dirtBikeTricks,    setDirtBikeTricks    ] = useState(false);
    const [  bicycleRiding,     setBicycleRiding     ] = useState(false);
    const [  bicycleTricks,     setBicycleTricks     ] = useState(false);
    const [  bicycleMountain,   setBicycleMountain   ] = useState(false);
    const [  tricycle,          setTricycle          ] = useState(false);
    const [  unicycle,          setUnicycle          ] = useState(false);
    const [  rollerblading,     setRollerblading     ] = useState(false);
    const [  snowmobile,        setSnowmobile        ] = useState(false);
    const [  skateboarding,     setSkateboarding     ] = useState(false);
    const [  horseBareback,     setHorseBareback     ] = useState(false);
    const [  horseJousting,     setHorseJousting     ] = useState(false);
    const [  horseJumping,      setHorseJumping      ] = useState(false);
    const [  horseRiding,       setHorseRiding       ] = useState(false);

    const [  valuesLoaded,      setValuesLoaded      ] = useState(false);


    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
            [  'Stunt Driving',              drivingStunts,      setDrivingStunts      ],
            [  'Precision Driving',          drivingPrecision,   setDrivingPrecision   ],
            [  'NASCAR',                     nascar,             setNascar             ],
            [  'ATV/Quad - Riding',          quadRiding,         setQuadRiding         ],
            [  'ATV/Quad - Tricks/Jumps',    quadTricks,         setQuadTricks         ],
            [  'Motorcycle - Riding',        motorcycleRiding,   setMotorcycleRiding   ],
            [  'Motorcycle - Tricks/Jumps',  motorcycleTricks,   setMotorcycleTricks   ],
            [  'Dirt Bike - Riding',         dirtBikeRiding,     setDirtBikeRiding     ],
            [  'Dirt Bike - Tricks/Jumps',   dirtBikeTricks,     setDirtBikeTricks     ],
            [  'Bicycle - Riding',           bicycleRiding,      setBicycleRiding      ],
            [  'Bicycle - Tricks/Jumps',     bicycleTricks,      setBicycleTricks      ],
            [  'Mountain Bike',              bicycleMountain,    setBicycleMountain    ],
            [  'Tricycle',                   tricycle,           setTricycle           ],
            [  'Unicycle',                   unicycle,           setUnicycle           ],
            [  'Rollerblading',              rollerblading,      setRollerblading      ],
            [  'Snowmobile',                 snowmobile,         setSnowmobile         ],
            [  'Skateboarding',              skateboarding,      setSkateboarding      ],
            [  'Horse - Bareback',           horseBareback,      setHorseBareback      ],
            [  'Horse - Jousting',           horseJousting,      setHorseJousting      ],
            [  'Horse - Jumping',            horseJumping,       setHorseJumping       ],
            [  'Horse - Riding',             horseRiding,        setHorseRiding        ]

        ];
    }, [bicycleMountain, bicycleRiding, bicycleTricks, dirtBikeRiding, dirtBikeTricks, drivingPrecision, drivingStunts, horseBareback, horseJousting, horseJumping, horseRiding, motorcycleRiding, motorcycleTricks, nascar, quadRiding, quadTricks, rollerblading, skateboarding, snowmobile, tricycle, unicycle])



    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded])



    // update pageState when any of the skill values change
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);


    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Skills 3/6: Riding</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                name={skill[0]}
                                                                sort='riding'
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}