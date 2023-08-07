







import React, { useEffect, useMemo } from 'react';



// loads a facebook feed component.
// basically implements the embed instructions from facebook.
// https://developers.facebook.com/docs/plugins/page-plugin/
// just pass in the url of the page you want to embed as a prop.
// name prop  only displays on failure.
export default function FacebookFeed ({name, url}) {


    // injects the facebook sdk script into the DOM when the component mounts.
    useEffect(() => {

        const script = document.createElement('script');
              script.src='https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0&appId=1229119547492444&autoLogAppEvents=1';
              script.crossorigin='anonymous';
              script.nonce='DSHjCoBi';
              script.async = true;
              script.defer = true;                      
                        
        document.body.prepend(script);

        return () => { document.body.removeChild(script); }

    });





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


