







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 6 covers water skills
export default function Page6 ({pageState, setPageState}) {

    const [  canoe,               setCanoe               ] = useState(false);
    const [  highDiving,          setHighDiving          ] = useState(false);
    const [  jetSkiRiding,        setJetSkiRiding        ] = useState(false);
    const [  jetSkiTricks,        setJetSkiTricks        ] = useState(false);
    const [  kayak,               setKayak               ] = useState(false);
    const [  kayakWhitewater,     setKayakWhitewater     ] = useState(false);
    const [  raftWhitewater,      setRaftWhitewater      ] = useState(false);
    const [  sup,                 setSup                 ] = useState(false);
    const [  surf,                setSurf                ] = useState(false);
    const [  surfski,             setSurfski             ] = useState(false);
    const [  wakeboard,           setWakeboard           ] = useState(false);
    const [  waterski,            setWaterski            ] = useState(false);
    const [  freeDiving,          setFreeDiving          ] = useState(false);
    const [  scuba,               setScuba               ] = useState(false);
    const [  occupationalDiving,  setOccupationalDiving  ] = useState(false);
 
    const [  valuesLoaded,        setValuesLoaded        ] = useState(false);


    
    
    // it's critical that the facts array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
            [  'Occupational Diving',   occupationalDiving,  setOccupationalDiving  ],
            [  'High Diving',           highDiving,          setHighDiving          ],
            [  'Freediving',            freeDiving,          setFreeDiving          ],
            [  'Scuba Diving (PADI)',   scuba,               setScuba               ],
            [  'Stand-Up Paddleboard',  sup,                 setSup                 ],
            [  'Surfing',               surf,                setSurf                ],
            [  'Surfskiing',            surfski,             setSurfski             ],
            [  'Waterskiing',           waterski,            setWaterski            ],
            [  'Wakeboarding',          wakeboard,           setWakeboard           ],
            [  'Canoeing',              canoe,               setCanoe               ],
            [  'Kayaking',              kayak,               setKayak               ],
            [  'Whitewater Kayaking',   kayakWhitewater,     setKayakWhitewater     ],
            [  'Whitewater Rafting',    raftWhitewater,      setRaftWhitewater      ],
            [  'Jet Ski - Riding',      jetSkiRiding,        setJetSkiRiding        ],
            [  'Jet Ski - Tricks',      jetSkiTricks,        setJetSkiTricks        ],
        ];
    }, [canoe, freeDiving, highDiving, jetSkiRiding, jetSkiTricks, kayak, kayakWhitewater, occupationalDiving, raftWhitewater, scuba, sup, surf, surfski, wakeboard, waterski])



    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded])



    // update pageState when skills change. This will be passed back up to the parent component
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);

    return (<>
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Skills 4/6: Water</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                name={skill[0]}
                                                                sort='water'
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}