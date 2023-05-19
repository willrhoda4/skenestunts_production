










import                         './Reels.css';
import {  useState, 
          useEffect  }    from 'react';
import {  Helmet     }    from 'react-helmet';

import    Loader          from '../components/Loader.js';



export default function Reels({getData}) {



    const [ reelData, setReelData ] = useState([]);


    // loads reel data from the database and stores it in component state for rendering.
    useEffect(() => {

      getData([ 'reels', null, { orderBy: 'rank'} ]  )
        .then(  res =>  setReelData(res.data)        )
        .catch( err =>  console.log(err)             );

    }, [getData])



    // generates a reel component.
    function makeReel (title, caption, code, key) {
        
        return (
                  <div key={key} className='reelWrapper' >
                    <div className='realReelWrapper'>
                      <div className='reelPlayer' dangerouslySetInnerHTML={{__html: code}} />
                      <h2 className='reelTitle'>{title}</h2>
                    </div>
                    { caption && <p   className='reelCaption' >{caption}</p> }
                  </div>
        )
    }


  return (

    <>

        <Helmet>
          <title>Skene Stunts - Reels</title>
          <meta name="description" content="The best part of the website. Our demo reels will show you exactly the type of work our company does." />
          <link rel="canonical"    href="https://www.skenestunts.com/reels" />
        </Helmet>

        <div className='reelContent'>
                  { reelData.length === 0 ? <Loader />
                                          : reelData.map( reel => { return makeReel( reel.title,
                                                                                    reel.caption, 
                                                                                    reel.embed_code,
                                                                                    reel.reel_id
                                                                                  )})
                  }
        </div>
    </>
  );
}














