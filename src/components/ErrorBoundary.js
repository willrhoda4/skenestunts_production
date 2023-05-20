







import{ useState, useEffect } from 'react';




export default function ErrorBoundary  ({ children }) {



  const [hasError, setHasError] = useState(false);

  useEffect(() => {

    const errorHandler = (error) => {

        
        console.log('boundary ran');
        console.error(error);
        setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => window.removeEventListener('error', errorHandler);

  }, []);

  if (hasError) { return <p>Something went wrong.</p>; }
  else          { return children;                     }

  
};

