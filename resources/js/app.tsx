import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { configureEcho } from '@laravel/echo-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Make toast available globally for notifications
window.toast = toast;

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Resto';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Wrap the app with ToastContainer
        root.render(
            <>
                <App {...props} />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();


function Msg() {
    const styleTitle = 'color: #fff; background: #CF0000; font-size: 16px; font-weight: bold; padding: 8px 12px; border-radius: 5px;';
    const styleBody = 'color: #333; font-size: 13px;';

    console.log('%c🍽️ MyFood v1.0.0', styleTitle);
    console.log('%cCopyright © 2025 MyFood. All rights reserved.', styleBody);
    console.log('%cBuilt with love by the MyFood Team 💖', styleBody);
    console.log('%cUnauthorized copying or reverse engineering is prohibited 🔒', styleBody);
    console.log('%cVisit us: https://myfood.example.com', 'color: #0066cc; font-size: 13px; text-decoration: underline;');
}

Msg();
