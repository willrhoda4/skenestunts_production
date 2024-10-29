







import                          './NavBar.css';
import { useRef,
         useState,
         useEffect   }     from 'react';
import { Link,
         useLocation }     from 'react-router-dom';

import   iconFacebook      from '../images/icon_facebook_white.svg';
import   iconInstagram     from '../images/icon_instagram_white.svg';
import   iconVimeo         from '../images/icon_vimeo_white.svg';
import   iconMenu          from '../images/icon_menu.svg';
import   iconClapperboard  from '../images/icon_clapperboard.svg'




// this component is the navigation bar for both the forward-facing site and Director's Chair.
function NavBar({links, editing, setEditing}) {




    const   location                  = useLocation();  
    const   dropdownRef               = useRef(null);

    const [ displayed, setDisplayed ] = useState(false);
    const [ animation, setAnimation ] = useState(false);
    
    

    // sets displayed to true or false based on animation state.
    // gives the dropdown time to close before setting displayed to false.
    useEffect(() => {

             if (animation === 'open' ) {                    setDisplayed(true);           }
        else if (animation === 'close') { setTimeout(() => { setDisplayed(false);  }, 400) }
        else                            {                    return;                       }

    }, [animation])


    
 
        
    // sets animation to close when the user clicks outside the dropdown.
    useEffect(() => {

        function handleClickOutside (event) {
            
            if ( displayed && !dropdownRef.current.contains(event.target) ) {  setAnimation('close'); }
        };

        document.addEventListener("mousedown", handleClickOutside);
    
        return () => { document.removeEventListener("mousedown", handleClickOutside); }

    });



    // good ol' fashioned navLink generator.
    function navLinks () {

      
        // generates nav links for forward-facing site.
        // automatically capitalizes the first letter of each link.
        // uses react-router-dom's Link component to navigate to the appropriate page.
        function navLink (name, key) {

            const path  = '/'+name;
            const title = name[0].toUpperCase()+name.slice(1);

            return <Link className={ location.pathname === path ? 'navLink activeLink'
                                                                : 'navLink'
                                   }
                           onClick={ () => setAnimation('close') }
                               key={key}
                                to={path}
                   >{title}</Link>
        }


        // generates nav links for Director's Chair.
        // uses onClick to set the editing state to the appropriate page.
        function adminNavLink (page, key) {

            return (  <p    onClick={ () => { setEditing(page); setAnimation('close'); } }
                          className={ editing === page ? 'navLink activeLink'
                                                       : 'navLink' 
                                    }
                                key={key}
                      >{page}</p>
            )
        }

        
        // returns array of links based on the current path.
        if (location.pathname !== '/director') { return links.map( (link, index) => navLink(     link, index) ) }
        else                                   { return links.map( (link, index) => adminNavLink(link, index) ) }
    }


    // generates socia media icon links for forward-facing site.
    function socialLink(platform, url, icon) {

        return (

            <a target="_blank"
                  rel="noreferrer"
                 href={url}
            >
                <img       alt={platform + ' icon'}
                     className='social icon'
                           src={icon}
                />
            </a>
        )
    }

    



    return (

        <div id='navbar'>

            {/* toggling between desktop and mobile links is handled by the css */}
            <nav id='desktopLinks'>
                {navLinks()} 
            </nav>

            <div id='mobileLinks'>
                <img alt='menu icon' className='menu icon' src={iconMenu} onClick={() => displayed ? setAnimation('close') : setAnimation('open')} />
                <h3 id='mobileTitle'>{   location.pathname === '/passwordReset' ? 'password reset'
                                       : location.pathname !== '/director'      ?  location.pathname.slice(1) 
                                       :                                           editing }
                </h3>
            </div>

          {/* social links for forward-facing site and simple header for Director's Chair*/}
          { location.pathname !== '/director' ? <nav id='socialLinks'>
                                                        {  socialLink('facebook',  'https://www.facebook.com/Skene-Stunts-109369232473048/', iconFacebook  )  }
                                                        {  socialLink('instagram', 'https://www.instagram.com/skenestunts/',                 iconInstagram )  }
                                                        {  socialLink('vimeo',     'https://vimeo.com/user144528473',                        iconVimeo     )  }
                                                </nav>

                                              : <div id='adminNavbarRight'>
                                                    <img className='adminNavbarIcon' alt='clapperboard icon' src={iconClapperboard} />
                                                    <h3 id='adminNavBarH3'>skenestunts.com director's chair</h3>
                                                </div>
          }

            {/* update performer tab for forward-facing site. Un
                don't bother displaying it when an update is already happening. */}
            { location.pathname !== '/updatePerformer' &&
              location.pathname !== '/director'        &&

                <div id='updateTab'>
                    <Link className='navLink' to="/updatePerformer">Update Performer Profile</Link>  
                </div>
            }

            {/* dropdown links for mobile display.
                this is the part that gets animated. */}
            { displayed &&
            
                <nav ref={dropdownRef} id='dropdownLinks' className={animation}>
                    {navLinks()}
                </nav>
            }

        </div>


    )

}

export default NavBar;


