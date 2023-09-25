







import { Component } from 'react';
import   Fallback    from './Fallback.js';
import   Axios       from 'axios';

class ErrorBoundary extends Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This static method is called when an error is thrown in any of the child components.
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // This lifecycle method is called when an error is thrown in any of the child components.
  // It handles the error by logging the error in the database and notifying the tech team via email.
  componentDidCatch(error, errorInfo) {   
    
    // create a string containing the error name, message, and stack trace.
    // this string will be logged in the database and sent to the tech team via email.
    const errorMessage = `

      <b>Error Name:</b> ${error.name}<br>
      <b>Error Message:</b> ${error.message}<br>
      <b>Stack Trace:</b><br>
      ${error.stack}

    `;

    Axios.post(`${process.env.REACT_APP_API_URL}addData`, ['error_log', ['error_message'], [errorMessage]]);
    Axios.post(`${process.env.REACT_APP_API_URL}email`, { type: 'errorNotification', message: errorMessage });
  }

  // Renders the fallback UI if an error has occurred, otherwise renders the child components as usual.
  render() {

    if (this.state.hasError) {  return <Fallback type={'error'} />; } 
    else                     {  return this.props.children;         }
  }
}

export default ErrorBoundary;