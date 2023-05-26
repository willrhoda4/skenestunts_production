






import                      './Info.css';

import teamShot        from '../images/team.webp'
import teamShotBackup  from '../images/team.jpeg'

import iconIntegrity   from '../images/icon_integrity2.svg';
import iconSafety      from '../images/icon_safety.svg';
import iconPerformance from '../images/icon_performance.svg';
import iconInstagram   from '../images/icon_instagram.svg';
import iconFacebook    from '../images/icon_facebook.svg';
import logo            from '../images/logo_background.webp';
import logoPng         from '../images/logo_background.png';
import iconReels       from '../images/icon_reels.svg';
import iconMedia       from '../images/icon_media.svg';
import iconContact     from '../images/icon_mailClosed.svg';
import iconTeam        from '../images/icon_clapperboard.svg';
import dropdownIcon    from '../images/icon_dropdown.svg';


import FacebookFeed    from '../components/FacebookFeed';
import Picture         from '../components/Picture';    


import Axios           from 'axios';

import { Helmet }      from 'react-helmet';

import { useEffect, 
         useState    } from 'react';
import { Link        } from 'react-router-dom';






export default function Info({photoData, faqRef, fbFeed, setFbFeed, getData}) {




   
   const [  reel,            setReel         ] = useState(false);
   const [  reelH2Skew,      setReelH2Skew   ] = useState(0);

   const [  value,           setValue        ] = useState('safety');

   const [  FAQs,            setFAQs         ] = useState(false);
   const [  displayedFAQ,    setDisplayedFAQ ] = useState(false);

   const [  quote,           setQuote        ] = useState('');
   const [  quoteBy,         setQuoteBy      ] = useState('');

   const [  smallScreen,     setSmallScreen  ] = useState(false);







    // just a little bit of data fetching on load.
    useEffect(() => {


        // gets latest reel
        getData([ 'reels', null, { orderBy: 'rank', limit: 1 } ] )
          .then( res => setReel(res.data[0])                     )
         .catch( err => console.log(err)                         );
        

        // loads faq buffet
         getData(['faq',    null, { orderBy: 'rank' }] )
          .then( res => setFAQs(res.data)             )
         .catch( err => console.log(err)              );


        // gets quote data
        Axios.all([ getData(['misc', [[ 'description', 'info_quote'    ]]]),
                    getData(['misc', [[ 'description', 'info_quote_by' ]]])
                 ])
             .then( Axios.spread((...responses) => {
                      setQuote(responses[0].data[0].value );
                    setQuoteBy(responses[1].data[0].value );

             }))   
        
    }, [getData])



    // when user arrives at site via an FAQ link generated in the Director's Chair:
    //  get the FAQ id from the URL,
    //  wait for the FAQs to load,
    //  open the FAQ in question, 
    //  scroll the FAQ div to said question.
    //  scroll the page to the FAQ div.    
    useEffect(() => {

        const id     = new URLSearchParams(window.location.search).get('faq'); 
        const faq    = document.getElementById(id); 
        
       
            if (FAQs && faq && !displayedFAQ) { setDisplayedFAQ(id); 
                                                faq.scrollIntoView();
                                                faqRef.current.scrollIntoView(false);  
                                              }
    }, [FAQs, displayedFAQ, faqRef])




    // uses Facebook widget's embedded method to make sure the feed reloads 
    // on every initial render for the Info component, once FB is loaded.
    // if FB isn't loaded, wait 250ms then call function recursively.
    useEffect(() => { 
        
        function loadFeed () {

            if (Object.hasOwn(window, 'FB')) {  return window.FB.XFBML.parse();          }
            else                             {  return setTimeout(() => loadFeed, 250);  }
        
        }loadFeed() 
        
    },[]);





    // manages smallScreen state by listening for window resize events.
    useEffect(() => {
  
      function judgeScreen () {
          
        if (window.innerWidth <= 700)  { setSmallScreen(true);  }
        else                           { setSmallScreen(false); }
      }
  
      window.addEventListener('resize', judgeScreen);
      judgeScreen();
      
      return () =>  window.removeEventListener('resize', judgeScreen);
  
    }, [])

    
    

    // manages the skew angle of the reel h2 element by listening for window resize events 
    // and using pythagorean theorem to calculate the angle.
    useEffect(() => {
        
        function setAngle () {

            const reelDiv    = document.querySelector('#reelDiv');
            const adjacent   = reelDiv.offsetWidth;
            const opposite   = reelDiv.offsetHeight * .2;

            setReelH2Skew(Math.atan(opposite/adjacent));
        }

        window.addEventListener('resize', setAngle);
        setAngle();

        return () => window.removeEventListener('resize', setAngle);

    }, [])



    // intersection observer triggers animations for Info component as user scrolls.
    const animater = new IntersectionObserver(entries => {
        
            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    let section = entry.target;

                    let animatable = section.querySelectorAll('.animate');

                    animatable.forEach( element => {

                        element.classList.remove('animate');
                        element.classList.add('animated');
                    })
                    animater.unobserve(section);
                }
            })
        },
        {   threshold: .5    }
    ) 

    // initiates the intersection observer for the Info component.
    const sections = document.querySelectorAll('.infoDiv');
          sections.forEach( div => animater.observe(div) );


      

    // intersection observer for the FAQ component.
    const faqBuffet   = document.querySelector('#faqBuffet');
    const faqObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => entry.target.classList.toggle('onScreen', entry.isIntersecting));
        },
        { root: faqBuffet, threshold: 1 }
    )
    
    // initiates the intersection observer for the FAQ component.
    const faqs = document.querySelectorAll('.faqQ');
          faqs.forEach( q => faqObserver.observe(q) )











    // bio and value blurbs are stored in-script as template literals to insure speedy loading.
    const bioBlurb   = `Skene Stunts has been crashing cars and choreographing brawls for the Canadian commercial and film industry since the late eighties, when we started out as a one-man show working on small projects in the Manitoba area. Today, our performers and coordinators have credits on more than 350 films, and a catalogue of expertise that includes everything from major vehicle stunts and high falls, to body burns and wire work. From our first take, we made it our mission to deliver the kind of excellence that exceeds expectations and makes movies memorable, and over 35 years later we’re still here.`

    const valueBlurb = value === 'integrity'     ? `We expect honesty, trust and respect from all of our team members and co-workers, and are dedicated to fully serving the technical and artistic needs of every project we work on, without compromising our human values. We regard every person on the production team as a valued collaborator, recognizing and appreciating the critical role they each play in the process.`
                     : value === 'safety'        ? `With a stellar safety record that stretches decades, Skene Stunts prides itself on observing world-class safety standards and consistently contributing to a safe work environment. We are committed to a harassment- and bully-free workplace and are allies to the under-represented. Our policy of inclusion insists that every project we work on be a safe space for all, regardless of race, gender or orientation.`
                     : value === 'performance'   ? `We have an international reputation for executing exceptional stunt performances and sequences for film and television. Leveraging a solid resume of creative writing, directing and filmmaking, you can count on our determination to bring your vision to the screen, and expect our work to enhance and support your story. We can also provide second-unit directors for stunt sequences, if required.`
                     :                              null;




    // generates selector shields for the values section of the page.
    function valueSelector(valueIs, icon) {

        return (

            <div className={     value !== valueIs ? 'valueSelector'       : 'valueSelector selected'       } onClick={() => setValue(valueIs)}>
                <img className={ value !== valueIs ? 'valueSelectIcon'     : 'valueSelectIcon selected'     } alt='value icon' src={icon} />
                <p className={   value !== valueIs ? 'valueSelectTitle'    : 'valueSelectTitle selected'    }>{valueIs}</p>
            </div>
        )
    }



    // generates blurbs for the values section of the mobile page.
    function mobileValue(valueIs, icon) {

        function mobileValueBlurb (thisValue) {

            return  thisValue === 'integrity'     ? `We expect honesty, trust and respect from all of our team members and co-workers, and regard every person on the production team as a valued collaborator, recognizing and appreciating the critical role they each play in the process.`
                :   thisValue === 'safety'        ? `Skene Stunts prides itself in observing world-class safety standards and consistently contributing to a safe work environment. We are committed to a harassment- and bully-free workplace and are allies for the under-represented.`
                :   thisValue === 'performance'   ? `We have an international reputation for executing exceptional stunt performances and sequences for film and television. You can count on our determination to bring your vision to the screen.`
                :                                    null;
        }

        return (

            <div className='mobileValue' >
                <img className='mobileValueIcon' alt='value icon' src={icon} />
                <h5 className='mobileValueName'>{valueIs}</h5>
                <p className='mobileValueBlurb'>{mobileValueBlurb(valueIs)}</p>
            </div>
        )
    }





    // generates the next page options for calls to action at page bottom.
    function nextPage(name, path, icon) {

        return (
            <Link to={path}>
                <div className='nextPageOption'>
                    <img className='nextPageIcon' alt={`${name} icon`} src={icon} />
                    <p className='nextPageTitle'>{name}</p>
                </div>
            </Link>

        )

    }




    // genrates question components for the FAQ buffet
    function makeFAQ(question, answer, id, key) {

        return (

            <div key={id} id={id} className='faq'>
                <div className='faqQuestion' onClick={() => displayedFAQ === id ? setDisplayedFAQ(false) : setDisplayedFAQ(id)}>
                    <div className='faqQ' style={{display: 'flex', alignItems: 'center'}}>
                        <h5 style={{marginRight: '2.5vmin', fontSize: '5vmin'}}>Q:</h5>
                        <p>{question}</p>
                    </div>
                    <img className={ displayedFAQ === id ? 'adminPerformerDropdownIcon adminPerformerGridItem spun' 
                                                         : 'adminPerformerDropdownIcon adminPerformerGridItem' 
                                   } 
                               alt='dropdown icon'
                             style={{height: '5vh', margin: '2.5vh', color: 'red'}}
                           onClick={ displayedFAQ !== id ? () => setDisplayedFAQ(id)
                                                          : () => setDisplayedFAQ(false)
                                   }
                               src={dropdownIcon}
                    />
                </div>
                    <div className={ displayedFAQ !== id ?'faqAnswer' : 'faqAnswer open'}>
                        <p style={{whiteSpace: 'pre-line', paddingBottom: '10vmin'}}>{answer}</p>
                    </div>
                
            </div>
        )
    }






    return ( 

        <>

            <Helmet>
              <title>Skene Stunts - Info</title>
              <meta name="description" content="Visit our FAQ section, see our company value statements and find links to our social media accounts." />
              <link rel="canonical"    href="https://www.skenestunts.com/info" />
            </Helmet>


            <div id='infoWrapper'>

                <div className='infoDiv' >

                    {/* bio and get-in-touch button */}
                    <div className='infoBioDiv'>

                        <div id='infoBioWrapper'>

                            <p id='infoBio' className='animate' >{bioBlurb}</p>

                            <Link to='/contact'>
                                <button  id='infoBioButton' className='formButton optionButton'>connect with Skene Stunts</button>
                            </Link>   


                        </div>

                    </div>
            
                    {/* header image and background rectangles */}
                    <div className='infoBioDiv'>

                        <div id='infoBioImageWrapper'>
                            
                            <Picture
                                     src={teamShot}
                                fallback={teamShotBackup}
                                    type={'image/webp'}
                                     alt={'rick daniel and sean skene posing next to an old dump truck'}
                                      id={'infoBioImage'}
                            />

                            <div id='infoBioImageBlockLeft'   className='infoBioImageBlock animate' />
                            <div id='infoBioImageBlockRight'  className='infoBioImageBlock animate' />
                            <div id='infoBioImageBlockBottom' className='infoBioImageBlock animate' />

                        </div>

                    </div>

                </div>






                {/* latest reel section */}
                <div id='reelDiv' className='infoDiv' >

                    <div    id='infoReelTitleWrapper' style={{ transform:  'rotate(-'+reelH2Skew+'rad)' }} >
                        <h2 id='infoReelTitle' className='animate' >{reel.title}</h2>
                    </div>
                    <div id='infoReelTileLeft'  className='infoReelTile animate' />
                    <div id='infoReelTileRight' className='infoReelTile animate' />
                
                    {   reel &&  <div id='infoReelPlayer' dangerouslySetInnerHTML={{__html: reel.embed_code}}  />  }
                </div>







                {/* value section uses a ternary to render a stripped-down offering for mobile and a splashy implementation for desktop */}
                    
                {   !smallScreen    ?   <div className='infoDiv'>

                                          

                                            <div id='infoValuesDisplay'>
                                                <div id='infoValueBox' className={value}>
                                                    <p id='infoValueBlurb'>{valueBlurb}</p>    
                                                </div>                
                                                <h2  className='infoValueTitle animate'>Core<br/>Values</h2>
                                            </div>
                            
                                            <div id='infoValuesSelect'>
                                                <div id='infoValuesSelectBar' />
                                                { valueSelector('safety',         iconSafety       )}
                                                { valueSelector('performance',    iconPerformance  )}
                                                { valueSelector('integrity',      iconIntegrity    )}    
                                            </div>

                                            <Picture
                                                     src={logo}
                                                fallback={logoPng}
                                                    type='image/webp'
                                                     alt='Skene Stunts company logo'
                                                      id='infoValueLogo'
                                            />
                                           

                                        </div>
                
                                    :   <div className='infoDiv'>
                                            <h2  className='infoValueTitle animate'
                                                style={{marginBottom: '2.5vmax'}}>Core<br/>Values</h2>
                                            { mobileValue('safety',         iconSafety        )}
                                            { mobileValue('performance',    iconPerformance   )}
                                            { mobileValue('integrity',      iconIntegrity     )}
                                        </div>

                }






                {/* the infamous faq buffet */}
                <div ref={faqRef} id='faqDiv' className='infoDiv' >
                    <h2 id='faqTitle'>FAQ</h2>
                    <div id='faqBuffet'>
                        { FAQs && FAQs.map((faq, index) => <div key={index}>
                                                                {
                                                                    makeFAQ( faq.question, 
                                                                            faq.answer,
                                                                            faq.css_id, 
                                                                            index
                                                                        )
                                                                }
                                                            </div>
                        )}
                    </div>
                </div>






                {/* social media section offers widgets for desktop and simple icons for mobile */}
                <div className='infoDiv' >

                    <div className='infoSocialPlatform'>

                        <a  target="_blank"
                            rel="noreferrer"
                            href='https://www.facebook.com/Skene-Stunts-109369232473048'
                        > 
                            <img className='infoSocialIcon animate' alt='facebook icon' src={iconFacebook} />
                        </a>

                        <div id='fb' className='infoPlatformWrapper'>

                            <FacebookFeed name='Skene Stunts' 
                                           url='https://www.facebook.com/Skene-Stunts-109369232473048' 
                            />

                        </div>
                    </div>
                    

                    <div className='infoSocialPlatform'>

                        <a  target="_blank"
                            rel="noreferrer"
                            href='https://www.instagram.com/skenestunts/'
                        > 
                            <img className='infoSocialIcon animate' alt='instagram icon' src={iconInstagram} />
                                    <div id='ig' className='infoPlatformWrapper'>
                                        { photoData && photoData.slice(0,6).map((image, index) => <img className='infoGramImage'
                                                                                                            id={'example'+index}
                                                                                                            key={index}
                                                                                                            alt='example instagram content'
                                                                                                            src={image.media_url}
                                                                                                />
                                                                               )
                                        }
                                    </div>
                        </a>
                    </div>
                </div>       






                {/* mildly suggestive footer section to move user along to next foot of their journey. */}
                <div className='infoDiv' >

                    <div id='infoNextPageMenu'>
                        {   nextPage('Contact', '/contact', iconContact )  }
                        {   nextPage('Reels',   '/reels',   iconReels   )  }
                        {   nextPage('Media',   '/media',   iconMedia   )  }
                        {   nextPage('Team',    '/team',    iconTeam    )  }
                    </div>

                    <div id='infoQuoteWrapper'>
                        <p id='infoQuote'>"{quote}"</p>
                        <p id='infoQuoteBy'>-{quoteBy}</p>
                    </div>

                </div>
            </div> 
        </>


    )
}






