















import React, { useEffect, useMemo } from 'react';



// loads a facebook feed component.
// basically implements the embed instructions from facebook.
// https://developers.facebook.com/docs/plugins/page-plugin/
// just pass in the url of the page you want to embed as a prop.
// name prop  only displays on failure.
export default function FacebookFeed ({name, url}) {




  // injects the facebook sdk script and fb-root div into the DOM when the component mounts.
  useEffect(() => {

    
    // if fb-root div does not exist, create it and add it to the DOM.
    if ( !document.getElementById('fb-root') ) {
          
        const fbRoot    = document.createElement('div');
              fbRoot.id = 'fb-root';
        
        document.body.prepend(fbRoot);
        
    }


    // if the script tag does not exist, create it and add it to the DOM.
    const scriptId   = 'facebook-jssdk';

    if ( !document.getElementById( scriptId ) ) {

        const script             =  document.createElement('script');
              script.id          =  scriptId;
              script.src         = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0';
              script.crossOrigin = 'anonymous';
              script.nonce       = 'qnkdXd6A';
              script.async       =  true;
              script.defer       =  true;

        document.body.prepend(script);

    }

    return () => {

        const existingScript = document.getElementById(scriptId);
        if  ( existingScript ) document.body.removeChild(existingScript);
    };

  }, []);


 
  useEffect(() => {


    if (window.FB && window.FB.XFBML) {
        try {
            window.FB.XFBML.parse();
        } catch (e) {
            console.error('FB.XFBML.parse() error:', e);
        }
    }

    // Bandaid fix to clear errors from FB SDK appearing in Chromium browsers
    const timerId = setTimeout(() => console.clear(), 3000);
    // Cleanup function to clear the timeout
    return () => clearTimeout(timerId);

}, [url]);




    // returns the facebook feed component. 
    const feed = (url, name) =>     <>
                                        <div id="fb-root"/>

                                        <div style={{width: '40vmin', height: '60vmin'}}
                                            className='fb-page'
                                            data-href={url}
                                            data-tabs='timeline'
                                            data-width="500"
                                            data-small-header='true'
                                            data-adapt-container-width='true'
                                            data-hide-cover='true'
                                            data-show-facepile='true'
                                        >
                                            
                                            <blockquote
                                                cite={url}
                                                className='fb-xfbml-parse-ignore'
                                            >
                                                <a href={url}>{name}</a>
                                            </blockquote>
                                            
                                        </div>
                                    </>
    
    // memoizes the feed component or it won't render.
    const  thisFeed = useMemo (() => feed(url, name), [url, name]);
     

    // returns the feed component.
    return thisFeed;


}

