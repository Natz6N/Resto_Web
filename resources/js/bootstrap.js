/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Set default options for development
const isLocalDev = window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';

// Configure Pusher to handle connection errors silently
Pusher.logToConsole = import.meta.env.DEV ? true : false;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: isLocalDev ? 6001 : (import.meta.env.VITE_REVERB_PORT || 80),
    wssPort: isLocalDev ? 6001 : (import.meta.env.VITE_REVERB_PORT || 443),
    forceTLS: isLocalDev ? false : ((import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https'),
    encrypted: isLocalDev ? false : true,
    enabledTransports: isLocalDev ? ['ws'] : ['ws', 'wss'],
    disableStats: true,
    // Set a longer connection timeout
    activityTimeout: 60000,
    // Add error handling
    enableLogging: import.meta.env.DEV,
    // Automatically reconnect if connection is lost
    autoConnect: false,
});

// For development purposes, log Echo connection
if (import.meta.env.DEV) {
    window.Echo.connector.pusher.connection.bind('connected', () => {
        console.log('Echo connected via Reverb');
    });

    window.Echo.connector.pusher.connection.bind('error', (error) => {
        console.error('Echo connection error:', error);
    });

    // Try to connect with a delay
    setTimeout(() => {
        window.Echo.connector.pusher.connect();
    }, 1000);
}
