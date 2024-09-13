




import { useEffect    } from 'react';
import   Axios          from 'axios';
import   * as Sentry    from '@sentry/react';



export default function useAxiosErrorHandling () {


  useEffect(() => {

    const interceptor = Axios.interceptors.response.use(

      response => response,

      error => {
        Sentry.captureException( error );
        return Promise.reject( error );
      }
    );

    // cleanup the interceptor when the component is unmounted
    return () => {
      Axios.interceptors.response.eject(interceptor);
    };

  }, []);
  
};


