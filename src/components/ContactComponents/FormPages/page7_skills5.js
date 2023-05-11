







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 7 covers snow and ice skills
export default function Page7 ({pageState, setPageState}) {

    const [  skatingIce,        setSkatingIce        ] = useState(false);
    const [  skiingAlpine,      setSkiingAlpine      ] = useState(false);
    const [  skiingXC,          setSkiingXC          ] = useState(false);
    const [  skiingDownhill,    setSkiingDownhill    ] = useState(false);
    const [  skiingFreestyle,   setSkiingFreestyle   ] = useState(false);
    const [  skiingJumps,       setSkiingJumps       ] = useState(false);
    const [  mountainBoarding,  setMountainBoarding  ] = useState(false);
    const [  snowbiking,        setSnowbiking        ] = useState(false);
    const [  snowkiting,        setSnowkiting        ] = useState(false);
    const [  snowboarding,      setSnowboarding      ] = useState(false);
    const [  iceClimbing,       setIceClimbing       ] = useState(false);

    const [  valuesLoaded,      setValuesLoaded      ] = useState(false);
    



    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
            [  'Ice Skating',          skatingIce,        setSkatingIce        ],
            [  'Alpine Skiing',        skiingAlpine,      setSkiingAlpine      ],
            [  'Cross-Country Skiing', skiingXC,          setSkiingXC          ],
            [  'Downhill Skiing',      skiingDownhill,    setSkiingDownhill    ],
            [  'Freestyle Skiing',     skiingFreestyle,   setSkiingFreestyle   ],
            [  'Ski Jumping',          skiingJumps,       setSkiingJumps       ],
            [  'Mountain Boarding',    mountainBoarding,  setMountainBoarding  ],
            [  'Snowbiking',           snowbiking,        setSnowbiking        ],
            [  'Snowkiting',           snowkiting,        setSnowkiting        ],
            [  'Snowboarding',         snowboarding,      setSnowboarding      ],
            [  'Ice Climbing',         iceClimbing,       setIceClimbing       ]
        ];
    }, [iceClimbing, mountainBoarding, skatingIce, skiingAlpine, skiingDownhill, skiingFreestyle, skiingJumps, skiingXC, snowbiking, snowboarding, snowkiting]);



    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded])



    // update pageState when any skill changes
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);
    

    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Skills 5/6: Winter</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                name={skill[0]}
                                                                sort='winter'
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}