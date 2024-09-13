





import { useEffect, useRef } from 'react';





// hook to implement the spotlight animation effect.
// this hook accepts options for size, speed, scaling, and whether to use one or two lights.
// returns a ref that can be applied to any element to give it a spotlight effect.
export default function useSpotlight({ size, speed, scale, oneLight = false, size2, speed2, scale2 }) {
    
    
    // create a ref to hold the spotlight effect.
    const spotlightRef = useRef(null);

    useEffect(() => {

        // creates a div that fills its parent element.
        function fullSizedDiv() {
            const  div = document.createElement('div');
                   div.style.width  = '100%';
                   div.style.height = '100%';
            return div;
        }

        // handles the spotlight effect for one or two lights.
        function doubleSpotlight( container ) {

            const leftLight  = fullSizedDiv();
            const rightLight = fullSizedDiv();
            const litArea    = fullSizedDiv();

            // litArea is styled to overlap the background image and hold the light areas.
            litArea.style.position = 'absolute';
            litArea.style.display  = 'flex';
            litArea.style.zIndex   = '1';

            // always append at least one light to litArea.
            litArea.appendChild(leftLight);

            // append the second light unless `oneLight` is true.
            if (!oneLight) litArea.appendChild(rightLight);

            // prepend the litArea to the parent element.
            container.prepend(litArea);

            // initial values for the left light (first spotlight).
            const leftWidth  = leftLight.offsetWidth;
            const leftHeight = leftLight.offsetHeight;
            const leftAnchor = size;

            // initialize the light at the center of its territory, starting at the anchor size.
            let leftX    = leftWidth / 2;
            let leftY    = leftHeight / 2;
            let leftSize = leftAnchor;

            // variables for controlling movement and scaling of the left light.
            let leftScale  = scale;
            let leftSpeedX = speed * -1;
            let leftSpeedY = speed * -1;

            // initial values for the right light (second spotlight), using optional params or defaults.
            const rightWidth  = rightLight.offsetWidth;
            const rightHeight = rightLight.offsetHeight;
            const rightAnchor = size2 || size;

            let rightX    = rightWidth  / 2;
            let rightY    = rightHeight / 2;
            let rightSize = rightAnchor;

            // set up movement and scaling for the second light, or use default values.
            let rightScale  = ( scale2 || scale ) * -1;
            let rightSpeedX =   speed2 || speed;
            let rightSpeedY =   speed2 || speed;

            // animation loop to move and scale the lights.
            function moveLights() {
                // reverse direction if the lights reach the edges of their territories.
                if ( leftX >= leftWidth - leftSize || leftX <= leftSize / 2 ) leftSpeedX *= -1;
                if ( leftY >= leftHeight           || leftY <= 0            ) leftSpeedY *= -1;

                if ( rightX >= rightWidth - rightSize / 2 || rightX <= rightSize ) rightSpeedX *= -1;
                if ( rightY >= rightHeight                || rightY <= 0         ) rightSpeedY *= -1;

                // move the lights according to their current speed.
                leftX += leftSpeedX;
                leftY += leftSpeedY;

                rightX += rightSpeedX;
                rightY += rightSpeedY;

                // reverse scaling direction if lights reach max/min size.
                if ( leftSize  >= leftAnchor  + 50 || leftSize  <= leftAnchor  - 50 ) leftScale  *= -1;
                if ( rightSize >= rightAnchor + 50 || rightSize <= rightAnchor - 50 ) rightScale *= -1;

                // update the size of the lights.
                leftSize  += leftScale;
                rightSize += rightScale;

                // update the background gradient to animate the spotlight.
                leftLight.style.background  = `radial-gradient(circle at ${leftX }px ${leftY }px, #00000000 10px, #000000ee ${leftSize }px)`;
                rightLight.style.background = `radial-gradient(circle at ${rightX}px ${rightY}px, #00000000 10px, #000000ee ${rightSize}px)`;
            }

            // start the animation loop at 30 frames per second.
            const intervalId = setInterval( moveLights, 33 );
            
            // return a cleanup function to stop the animation when the component unmounts.
            return () => clearInterval(intervalId);
        }


        // start the spotlight effect when the component mounts.
        const container = spotlightRef.current;

        if (  container  ) {
           
            const cleanup = doubleSpotlight( container );
            return ()  => cleanup();
        }
    }, [ size, speed, scale, oneLight, size2, speed2, scale2 ] );

    // return the ref for use in the component.
    return spotlightRef;
}

