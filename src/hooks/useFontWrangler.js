





import { useEffect } from 'react';



/**
 * Custom hook to adjust the font size of multiple text elements to fit within their parent containers.
 * 
 * @param {Object} params               - Parameters for font wrangling.
 * @param {Array}  params.ids           - Array of element IDs to apply the font wrangling to (must be unique IDs).
 * @param {number} params.initialSize   - Optional. Initial font size in pixels. Default is 16px.
 * @param {number} params.maxIterations - Optional. Maximum number of tries for font adjustment. Default is 15.
 * @param {string} params.childSelector - Optional. CSS selector to adjust font size of specific child elements.
 */
export default function useFontWrangler( { ids, initialSize = 16, maxIterations = 15, childSelector = null } ) {
  

  // the `useEffect` hook runs when the component mounts and whenever 
  // the `ids`, `initialSize`, `maxIterations`, or `childSelector` change.
  useEffect(() => {


    let attempts = 0;

    // define the function to adjust the font size of the text elements.
    function adjustFontSize() {


      // If no IDs are provided or we're in a race situation, exit the function.
      if ( !ids || attempts > 30 ) return;

      // loop through all the element IDs provided.
      ids.forEach( id => {
        
        // find the text element using its ID.
        const text = document.getElementById( id );

        if (!text) return setTimeout( () => { attempts++; adjustFontSize() }, 100);

        // automatically get the parent container of the text element.
        const container = text?.parentElement;

        // if a childSelector is provided, query the child elements within the text.
        const childElements = childSelector && text.querySelectorAll( childSelector );

        // if either the text or its container is missing, exit the function.
        if ( !(container && text) ) return;

        // start the font size at the initial size provided (default: 16px).
        let size = initialSize;

        // if the screen width is less than 1000px, set a static font size and return.
        if ( window.innerWidth < 1000 ) {
          
          size = `${initialSize}px`;
          
          // if no childSelector is provided, apply the font size directly to the text element,
          // else apply the font size to the child elements.
          return !childSelector ? text.style.fontSize = size
                                : childElements.forEach( child => child.style.fontSize = size );
        }


        // for larger screens, establish the container area and set the initial font size,
        // then initialize the iteration counter.
        const containerArea = container.offsetHeight * container.offsetWidth;
        text.style.fontSize = `${initialSize}px`;
        let iterations = 0;


        // loop to adjust the font size until it fits within the parent container,
        // or until  maxIterations is reached.
        while ( iterations < maxIterations ) {
  

          // calculate the current area of the text div.
          const textArea = text.scrollHeight * text.scrollWidth;

          // determine if the text is too big or too small for the container.
          const tooBig    = containerArea / textArea > 1.2;   // too big if the container is 20% larger than the text.
          const tooSmall  = containerArea / textArea < 1;     // too small if the text is larger than the container.
          const justRight = !tooBig && !tooSmall;             // font size is "just right" if neither tooBig nor tooSmall.

          // if the font size is just right, stop adjusting and exit the loop.
          if ( justRight ) break;

          // adjust the font size based on whether it's too big or too small.
          size = tooBig ? size + 1 : size - 1;

          // convert the new font size to a string with `px` for use in CSS.
          const newSize = `${size}px`;

          // If no childSelector is provided, apply the size to the text element.
          !childSelector ? text.style.fontSize = newSize
                         : childElements.forEach( child => child.style.fontSize = newSize );           
        }

          // lastly, increment the iteration counter.
          iterations++;
      });
    }


    // Utility: Debounce function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => func(...args), delay);
  };
  }


  const debouncedResize = debounce(adjustFontSize, 200); // Debounce function

    // call `adjustFontSize` immediately when the component mounts.
    adjustFontSize();

    // add an event listener to adjust the font size whenever the window is resized.
    window.addEventListener('resize', debouncedResize);

    // cleanup: Remove the resize event listener when the component unmounts.
    return () => window.removeEventListener('resize', debouncedResize);
    
  }, [ ids, initialSize, maxIterations, childSelector ] );
}

