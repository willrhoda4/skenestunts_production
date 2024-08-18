// hooks/useScrollToTop.js
import { useEffect } from 'react';

export const useScrollToTop = (location, mainRef) => {
    useEffect(() => {
        const faq = new URLSearchParams(window.location.search).get('faq');
        const scrollToRef = (ref) => window.scroll(0, (ref.current.offsetTop - window.innerHeight * 0.1));

        if (!faq && location.pathname !== '/') {
            scrollToRef(mainRef);
        }
    }, [location, mainRef]);
};
