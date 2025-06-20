import React, { useEffect, useState } from 'react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface CustomerNotificationPanelProps {
    transactionId?: number;
}

export const CustomerNotificationPanel: React.FC<CustomerNotificationPanelProps> = ({
    transactionId
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Use the notifications hook to subscribe to transaction-specific notifications
    const {
        notifications: hookNotifications,
        subscribeToChannels
    } = useNotifications({
        role: 'all',
        transactionId,
        autoSubscribe: true,
        enableToasts: false // We'll handle our own notifications display
    });

    // Update local notifications when hookNotifications changes
    useEffect(() => {
        if (hookNotifications.length > 0) {
            setNotifications(prev => {
                // Merge new notifications, avoid duplicates
                const newNotifications = hookNotifications.filter(
                    newNotif => !prev.some(existingNotif => existingNotif.id === newNotif.id)
                );
                return [...newNotifications, ...prev].slice(0, 5); // Keep only the latest 5
            });
        }
    }, [hookNotifications]);

    // Auto-dismiss notifications after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (notifications.length > 0) {
                setNotifications(prev => prev.slice(0, prev.length - 1));
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, [notifications]);

    // Dismiss a notification by ID
    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // No notifications to show
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => dismissNotification(notification.id)}
                />
            ))}
        </div>
    );
};

interface NotificationItemProps {
    notification: Notification;
    onDismiss: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
    // Get the appropriate icon based on notification type
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case 'info':
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    // Get appropriate color classes based on type
    const getColorClasses = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-500 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-500 text-red-800';
            case 'warning':
                return 'bg-amber-50 border-amber-500 text-amber-800';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-500 text-blue-800';
        }
    };

    return (
        <div className={`p-4 rounded-lg shadow-md border-l-4 ${getColorClasses()} animate-slide-up`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                        {notification.message}
                    </p>

                    {notification.data && notification.notification_type === 'payment_status' && (
                        <div className="mt-1 text-xs">
                            Status: {notification.data.status}
                        </div>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        type="button"
                        className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onDismiss}
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerNotificationPanel;
