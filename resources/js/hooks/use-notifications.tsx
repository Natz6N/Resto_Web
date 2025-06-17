import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Declare global window with Echo property
declare global {
    interface Window {
        Echo: any;
    }
}

// Simple toast implementation until react-toastify is installed
const toast = {
    info: (message: string, options?: any) => console.info('TOAST:', message),
    success: (message: string, options?: any) => console.info('TOAST SUCCESS:', message),
    warning: (message: string, options?: any) => console.warn('TOAST WARNING:', message),
    error: (message: string, options?: any) => console.error('TOAST ERROR:', message)
};

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    data: any;
    timestamp: string;
    read?: boolean;
}

interface UseNotificationsProps {
    role?: string;
    autoSubscribe?: boolean;
}

export const useNotifications = ({ role = 'all', autoSubscribe = true }: UseNotificationsProps = {}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await axios.get('/dashboard/notifications/unread-count');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
        }
    }, []);

    // Fetch all notifications
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/dashboard/notifications');
            setNotifications(response.data.notifications.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Mark notifications as read
    const markAsRead = useCallback(async (ids: string[]) => {
        try {
            await axios.post('/dashboard/notifications/mark-as-read', { ids });
            setNotifications(prev =>
                prev.map(notification =>
                    ids.includes(notification.id)
                        ? { ...notification, read: true }
                        : notification
                )
            );
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }, [fetchUnreadCount]);

    // Subscribe to relevant channels
    const subscribeToChannels = useCallback(() => {
        // Check if Echo is available
        if (!window.Echo) {
            console.error('Laravel Echo is not available');
            return () => {};
        }

        // Subscribe to public notification channel
        const notificationChannel = window.Echo.channel('notifications');
        notificationChannel.listen('.system.notification', (event: any) => {
            // Check if notification is for the current user's role
            if (event.for.includes('all') || event.for.includes(role)) {
                // Add notification to state
                const newNotification: Notification = {
                    id: new Date().getTime().toString(),
                    type: event.type,
                    message: event.message,
                    data: event.data,
                    timestamp: event.timestamp
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show toast notification
                const toastFn = toast[event.type as NotificationType] || toast.info;
                toastFn(event.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        });

        // Subscribe to payments channel
        const paymentsChannel = window.Echo.channel('payments');
        paymentsChannel.listen('.payment.status.changed', (event: any) => {
            // Create a notification object
            const toastType = event.status === 'success' ? 'success' :
                    event.status === 'failed' ? 'error' : 'info';

            const newNotification: Notification = {
                id: new Date().getTime().toString(),
                type: toastType as NotificationType,
                message: event.message,
                data: {
                    transaction_id: event.id,
                    transaction_code: event.transaction_code,
                    status: event.status
                },
                timestamp: event.timestamp
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show toast notification
            const toastFn = toast[toastType as NotificationType] || toast.info;
            toastFn(event.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });

        // Subscribe to orders channel for kitchen staff
        if (role === 'koki' || role === 'admin') {
            const ordersChannel = window.Echo.channel('orders');
            ordersChannel.listen('.order.status.changed', (event: any) => {
                // Create a notification object
                const newNotification: Notification = {
                    id: new Date().getTime().toString(),
                    type: 'info',
                    message: event.message,
                    data: {
                        transaction_id: event.id,
                        transaction_code: event.transaction_code,
                        status: event.status
                    },
                    timestamp: event.timestamp
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show toast notification
                toast.info(event.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave('notifications');
                window.Echo.leave('payments');
                if (role === 'koki' || role === 'admin') {
                    window.Echo.leave('orders');
                }
            }
        };
    }, [role]);

    // Send a test notification (for development)
    const sendTestNotification = useCallback(async (type: NotificationType, message: string, forRoles: string[] = ['all']) => {
        try {
            await axios.post('/dashboard/notifications/test', {
                type,
                message,
                for: forRoles
            });
        } catch (error) {
            console.error('Error sending test notification:', error);
        }
    }, []);

    // Initialize
    useEffect(() => {
        fetchUnreadCount();

        if (autoSubscribe) {
            const cleanup = subscribeToChannels();
            return cleanup;
        }
    }, [fetchUnreadCount, autoSubscribe, subscribeToChannels]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        subscribeToChannels,
        sendTestNotification
    };
};
