







import                              './Construction.css';

import Picture  from                './Picture';


import logo     from                '../images/logo_error.webp';
import logoPng  from                '../images/logo_error.png';





import{ useState, useEffect } from 'react';



export default function ErrorBoundary  ({ children }) {


    const [hasError, setHasError] = useState(false);

    useEffect(() => {

        const errorHandler = (error) => {

            
            console.error(error);
            setHasError(true);
        };

        window.addEventListener('error', errorHandler);

        return () => window.removeEventListener('error', errorHandler);

    }, []);


    function errorPage () {

        return (

            <div className='constructionPage' style={{background: 'white'}}>
                
                <h2>Looks like someting went wrong...</h2>

                <Picture
                         src={logo}
                    fallback={logoPng}
                        type='image/webp'
                         alt='Skene Stunts company logo'
                          id='errorLogo'
                />
                
                <p className='constructionGraf'>Sorry about this. Try refreshing the browser, and if the problem persists send us an email..</p> 

            </div>

        )
    }

    if (hasError) { return errorPage(); }
    else          { return children;    }

  
};

