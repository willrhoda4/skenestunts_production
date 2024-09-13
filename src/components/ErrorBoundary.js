





import { Component   }  from 'react';
import   * as Sentry    from '@sentry/react';
import   Fallback       from './Fallback.js';





class ErrorBoundary extends Component {


  constructor( props ) {
    super( props );
    this.state = { hasError: false };
  }

  // this static method is called when an error is thrown in any of the child components.
  static getDerivedStateFromError( error ) {
    return { hasError: true };
  }


  // renders the fallback UI if an error has occurred, otherwise renders the child components as usual.
  render() {

    if (this.state.hasError) { return <Fallback type={ 'error' } />; }
    else                     { return this.props.children;           };

  }
}

export default Sentry.withProfiler( ErrorBoundary );






