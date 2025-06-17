import React, { useState, useEffect } from 'react';
import { BellIcon } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationIndicatorProps {
    onToggle?: () => void;
    className?: string;
}

export const NotificationIndicator: React.FC<NotificationIndicatorProps> = ({
    onToggle,
    className = ''
}) => {
    const { user } = useAuth();
    const role = user?.roles?.[0]?.name || 'all';

    const { unreadCount, subscribeToChannels } = useNotifications({
        role,
        autoSubscribe: true
    });

    const hasNotifications = unreadCount > 0;

    return (
        <button
            className={`relative p-2 rounded-full transition-colors ${
                hasNotifications ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
            } ${className}`}
            onClick={onToggle}
            aria-label="Notifications"
        >
            <BellIcon className="h-5 w-5" />
            {hasNotifications && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
};

// Hook for using the auth user
function useAuth() {
    // This is a placeholder - replace with your actual auth hook or implementation
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // For example, you might get the user from Inertia page props
        const pageElement = document.getElementById('app');
        if (pageElement) {
            try {
                const pageProps = JSON.parse(pageElement.dataset.page || '{}');
                if (pageProps.props && pageProps.props.auth && pageProps.props.auth.user) {
                    setUser(pageProps.props.auth.user);
                }
            } catch (e) {
                console.error('Error parsing auth user', e);
            }
        }
    }, []);

    return { user };
}

export default NotificationIndicator;
