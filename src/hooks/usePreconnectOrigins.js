// hooks/usePreconnectOrigins.js
import { useEffect } from 'react';

export const usePreconnectOrigins = () => {
    useEffect(() => {
        const origins = [
            'https://connect.facebook.net',
            'https://drive.google.com',
            'https://scontent.cdninstagram.com',
            'https://www.gstatic.com',
            'https://doc-0o-5c-docs.googleusercontent.com',
            'https://fresnel.vimeocdn.com',
            'https://player.vimeo.com'
        ];

        origins.forEach(origin => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = origin;
            document.head.appendChild(link);
        });
    }, []);
};
