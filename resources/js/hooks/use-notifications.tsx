import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

// Declare global window with Echo property
declare global {
    interface Window {
        Echo: any;
        toast?: {
            info: (message: string, options?: any) => void;
            success: (message: string, options?: any) => void;
            warning: (message: string, options?: any) => void;
            error: (message: string, options?: any) => void;
        };
    }
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    data?: any;
    timestamp: string;
    read?: boolean;
    notification_type?: 'system' | 'payment_status' | 'order_status' | 'customer';
}

interface UseNotificationsProps {
    role?: string;
    userId?: number | null;
    transactionId?: number | null;
    autoSubscribe?: boolean;
    enableToasts?: boolean;
}

interface ToastFunctions {
    info: (message: string, options?: any) => void;
    success: (message: string, options?: any) => void;
    warning: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
}

// Simple toast implementation that can be replaced with real toast library
const defaultToast: ToastFunctions = {
    info: (message: string, options?: any) => console.info('TOAST:', message),
    success: (message: string, options?: any) => console.info('TOAST SUCCESS:', message),
    warning: (message: string, options?: any) => console.warn('TOAST WARNING:', message),
    error: (message: string, options?: any) => console.error('TOAST ERROR:', message)
};

export const useNotifications = ({
    role = 'all',
    userId = null,
    transactionId = null,
    autoSubscribe = true,
    enableToasts = true
}: UseNotificationsProps = {}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastFunctions>(defaultToast);

    // Initialize toast library if available
    useEffect(() => {
        // Check if toast library is available in window
        if (window.toast && typeof window.toast === 'object') {
            setToast(window.toast as ToastFunctions);
        }
    }, []);

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
            setNotifications(response.data.notifications.data || []);
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

    // Handle adding a new notification
    const addNotification = useCallback((newNotification: Notification) => {
        // Add notification to state
        setNotifications(prev => {
            // Check if notification already exists (prevent duplicates)
            const exists = prev.some(n => n.id === newNotification.id);
            if (exists) return prev;
            return [newNotification, ...prev];
        });

        // Increment unread count
        setUnreadCount(prev => prev + 1);

        // Show toast notification if enabled
        if (enableToasts) {
            const toastFn = toast[newNotification.type as NotificationType] || toast.info;
            toastFn(newNotification.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [toast, enableToasts]);

    // Subscribe to relevant channels
    const subscribeToChannels = useCallback(() => {
        // Check if Echo is available
        if (!window.Echo) {
            console.error('Laravel Echo is not available');
            return () => {};
        }

        console.log(`Subscribing to channels with role=${role}, userId=${userId}, transactionId=${transactionId}`);
        const subscriptions: Array<() => void> = [];

        try {
            // Subscribe to public notification channel
            const notificationChannel = window.Echo.channel('notifications');
            notificationChannel.listen('.system.notification', (event: any) => {
                console.log('Received system notification:', event);

                // Check if notification is for this user's role
                if (event.for.includes('all') || event.for.includes(role)) {
                    // Add notification to state
                    const newNotification: Notification = {
                        id: event.id || `notification_${Date.now()}`,
                        type: event.type as NotificationType,
                        message: event.message,
                        data: event.data,
                        timestamp: event.timestamp,
                        notification_type: 'system'
                    };

                    addNotification(newNotification);
                }
            });

            subscriptions.push(() => window.Echo.leave('notifications'));

            // Subscribe to payments channel for all users
            const paymentsChannel = window.Echo.channel('payments');
            paymentsChannel.listen('.payment.status.changed', (event: any) => {
                console.log('Received payment status change:', event);

                // Create a notification object
                const toastType = event.status === 'dibayar' ? 'success' :
                        event.status === 'batal' ? 'error' : 'info';

                const newNotification: Notification = {
                    id: event.id || `payment_${Date.now()}`,
                    type: toastType as NotificationType,
                    message: event.message,
                    data: {
                        transaction_id: event.id,
                        transaction_code: event.transaction_code,
                        status: event.status
                    },
                    timestamp: event.timestamp,
                    notification_type: 'payment_status'
                };

                addNotification(newNotification);
            });

            subscriptions.push(() => window.Echo.leave('payments'));

            // Subscribe to role-specific channel if role is provided
            if (role && role !== 'all') {
                try {
                    const roleChannel = window.Echo.private(`role.${role}`);
                    roleChannel.listen('.system.notification', (event: any) => {
                        console.log(`Received role-specific notification for ${role}:`, event);

                        const newNotification: Notification = {
                            id: event.id || `role_${Date.now()}`,
                            type: event.type as NotificationType,
                            message: event.message,
                            data: event.data,
                            timestamp: event.timestamp,
                            notification_type: 'system'
                        };

                        addNotification(newNotification);
                    });

                    subscriptions.push(() => window.Echo.leave(`role.${role}`));
                } catch (error) {
                    console.error(`Error subscribing to role.${role} channel:`, error);
                }
            }

            // Subscribe to user-specific channel if userId is provided
            if (userId) {
                try {
                    const userChannel = window.Echo.private(`user.${userId}`);
                    userChannel.listen('.customer.notification', (event: any) => {
                        console.log(`Received user-specific notification for user ${userId}:`, event);

                        const newNotification: Notification = {
                            id: event.id || `user_${Date.now()}`,
                            type: event.type as NotificationType,
                            message: event.message,
                            data: event.data,
                            timestamp: event.timestamp,
                            notification_type: 'customer'
                        };

                        addNotification(newNotification);
                    });

                    subscriptions.push(() => window.Echo.leave(`user.${userId}`));
                } catch (error) {
                    console.error(`Error subscribing to user.${userId} channel:`, error);
                }
            }

            // Subscribe to transaction-specific channel if transactionId is provided
            if (transactionId) {
                const transactionChannel = window.Echo.channel(`transaction.${transactionId}`);

                // Listen for payment updates
                transactionChannel.listen('.payment.status.changed', (event: any) => {
                    console.log(`Received payment update for transaction ${transactionId}:`, event);

                    const toastType = event.status === 'dibayar' ? 'success' :
                                    event.status === 'batal' ? 'error' : 'info';

                    const newNotification: Notification = {
                        id: event.id || `transaction_payment_${Date.now()}`,
                        type: toastType as NotificationType,
                        message: event.message,
                        data: event.data,
                        timestamp: event.timestamp,
                        notification_type: 'payment_status'
                    };

                    addNotification(newNotification);
                });

                // Listen for order updates
                transactionChannel.listen('.order.status.changed', (event: any) => {
                    console.log(`Received order update for transaction ${transactionId}:`, event);

                    const newNotification: Notification = {
                        id: event.id || `transaction_order_${Date.now()}`,
                        type: 'info',
                        message: event.message,
                        data: event.data,
                        timestamp: event.timestamp,
                        notification_type: 'order_status'
                    };

                    addNotification(newNotification);
                });

                // Listen for customer notifications
                transactionChannel.listen('.customer.notification', (event: any) => {
                    console.log(`Received customer notification for transaction ${transactionId}:`, event);

                    const newNotification: Notification = {
                        id: event.id || `transaction_customer_${Date.now()}`,
                        type: event.type as NotificationType,
                        message: event.message,
                        data: event.data,
                        timestamp: event.timestamp,
                        notification_type: 'customer'
                    };

                    addNotification(newNotification);
                });

                subscriptions.push(() => window.Echo.leave(`transaction.${transactionId}`));
            }

            // Subscribe to orders channel for kitchen staff
            if (role === 'koki' || role === 'admin') {
                const ordersChannel = window.Echo.channel('orders');
                ordersChannel.listen('.order.status.changed', (event: any) => {
                    console.log('Received order status change:', event);

                    // Create a notification object
                    const newNotification: Notification = {
                        id: event.id || `order_${Date.now()}`,
                        type: 'info',
                        message: event.message,
                        data: {
                            transaction_id: event.id,
                            transaction_code: event.transaction_code,
                            status: event.status
                        },
                        timestamp: event.timestamp,
                        notification_type: 'order_status'
                    };

                    addNotification(newNotification);
                });

                subscriptions.push(() => window.Echo.leave('orders'));
            }
        } catch (error) {
            console.error('Error setting up Echo listeners:', error);
        }

        // Return a cleanup function that leaves all channels
        return () => {
            subscriptions.forEach(unsubscribe => unsubscribe());
            console.log('Unsubscribed from all channels');
        };
    }, [role, userId, transactionId, addNotification]);

    // Send a test notification (for development)
    const sendTestNotification = useCallback(async (type: NotificationType, message: string, forRoles: string[] = ['all']) => {
        try {
            await axios.post('/dashboard/notifications/test', {
                type,
                message,
                for: forRoles
            });
            console.log(`Test notification sent: ${message} (${type}) for ${forRoles.join(', ')}`);
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
