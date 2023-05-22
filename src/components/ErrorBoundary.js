







import                              './Construction.css';

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


    const errorPage = () => {

        <div className='constructionPage'>
            
            <h2>Looks like someting went wrong...</h2>/

            {/* <img className='constructionLogo' alt='skene stunts logo' src={logo} />*/}

            <p className='constructionGraf'>Sorry about this. Try refreshing the browser, and if the problem persists send us an email..</p> 

        </div>
    }

    if (hasError) { console.log('displaying the error page'); return errorPage; }
    else          { console.log('dispalying the children');   return children;  }

  
};

