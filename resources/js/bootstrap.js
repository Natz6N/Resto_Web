/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

// Set default options for development
const isLocalDev = window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'local',
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: isLocalDev ? 6001 : (import.meta.env.VITE_REVERB_PORT || 80),
    wssPort: isLocalDev ? 6001 : (import.meta.env.VITE_REVERB_PORT || 443),
    forceTLS: isLocalDev ? false : ((import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https'),
    enabledTransports: isLocalDev ? ['ws'] : ['ws', 'wss'],
    disableStats: true,
    activityTimeout: 60000,
    enableLogging: import.meta.env.DEV,
    autoConnect: false,
});

// For development purposes, log Echo connection
if (import.meta.env.DEV) {
    window.Echo.connector.socket.on('connect', () => {
        console.log('Echo connected via Reverb');
    });

    window.Echo.connector.socket.on('error', (error) => {
        console.error('Echo connection error:', error);
    });

    // Try to connect with a delay
    setTimeout(() => {
        window.Echo.connect();
    }, 1000);
}
