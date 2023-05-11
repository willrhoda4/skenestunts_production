







import { useState, useEffect, useMemo } from 'react';

import Checkbox from '../../FormFunctions/Checkbox';



// Page 3 covers combat skills
export default function Page3 ({pageState, setPageState}) {


    const [  filmFighting,      setFilmFighting  ] = useState(false);
    const [  stageCombat,       setStageCombat   ] = useState(false);
    const [  stageSwords,       setStageSwords   ] = useState(false);
    const [  boxing,            setBoxing        ] = useState(false);
    const [  judo,              setJudo          ] = useState(false);
    const [  jiuJitsu,          setJiuJitsu      ] = useState(false);
    const [  kravMaga,          setKravMaga      ] = useState(false);
    const [  karate,            setKarate        ] = useState(false);
    const [  kungFu,            setKungFu        ] = useState(false);
    const [  mma,               setMma           ] = useState(false);
    const [  muayThai,          setMuayThai      ] = useState(false);
    const [  capoeira,          setCapoeira      ] = useState(false);
    const [  wrestling,         setWrestling     ] = useState(false);




    // it's critical that the skills array is in the same order as
    // the corresponding column array in performerOptions.
    // don't tamper with it unless you know what you're doing.
    const    skills  = useMemo(() => {
        
        return [
          [ 'Film Fighting',    filmFighting,  setFilmFighting  ],
          [ 'Stage Combat',     stageCombat,   setStageCombat   ],
          [ 'Stage Swordplay',  stageSwords,   setStageSwords   ],
          [ 'Boxing',           boxing,        setBoxing        ],
          [ 'Judo',             judo,          setJudo          ],
          [ 'Jiu Jitsu',        jiuJitsu,      setJiuJitsu      ],
          [ 'Krav Maga',        kravMaga,      setKravMaga      ],
          [ 'Karate',           karate,        setKarate        ],
          [ 'Kung Fu',          kungFu,        setKungFu        ],
          [ 'MMA',              mma,           setMma           ],
          [ 'Muay Thai',        muayThai,      setMuayThai      ],
          [ 'Capoeira',         capoeira,      setCapoeira      ],
          [ 'Wrestling',        wrestling,     setWrestling     ]
        ];
    }, [boxing, capoeira, filmFighting, jiuJitsu, judo, karate, kravMaga, kungFu, mma, muayThai, stageCombat, stageSwords, wrestling]) 



    const [  valuesLoaded,        setValuesLoaded       ] = useState(false);

    // load existing data if it exists and hasn't been loaded
    useEffect(() => {
  
        if (!valuesLoaded && pageState.length === skills.length) {

            setValuesLoaded(true);

            for (let i = 0; i < skills.length; i++) {
                skills[i][2](pageState[i]);
            }
        }
        
    }, [skills, pageState, valuesLoaded])


    // update pageState when any of the checkboxes are changed
    useEffect(() => { setPageState(skills.map(skill => skill[1])); }, [skills, setPageState]);

    

    return (<>
        
                <div className='formPageH2Wrapper'>
                    <h2 className='formPageH2'>Skills 1/6: Combat</h2>
                    <h5>Check as many as applicable</h5>
                </div>
                <div id='ethnicityGrid'>
                    {  skills.map((skill, index) => < Checkbox  key={index}
                                                                sort='martialArts'
                                                                name={skill[0]}
                                                                state={pageState[index]}
                                                                setter={skill[2]}
                                                    />
                                    ) 
                    }
                </div>
            </>)
}