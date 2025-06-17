import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
    const {
        notifications,
        loading,
        unreadCount,
        fetchNotifications,
        markAsRead
    } = useNotifications();

    const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');

    // Load notifications when panel opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Mark all as read
    const handleMarkAllAsRead = () => {
        if (notifications.length === 0) return;

        const unreadIds = notifications
            .filter(notification => !notification.read)
            .map(notification => notification.id);

        if (unreadIds.length > 0) {
            markAsRead(unreadIds);
        }
    };

    // Get icon based on notification type
    const getNotificationIcon = (type: string) => {
        switch (type) {
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

    // Filter notifications based on selected tab
    const filteredNotifications = selectedTab === 'unread'
        ? notifications.filter(notification => !notification.read)
        : notifications;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full shadow-lg flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-gray-700" />
                        <h2 className="text-lg font-semibold">Notifikasi</h2>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            selectedTab === 'all'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedTab('all')}
                    >
                        Semua
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            selectedTab === 'unread'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedTab('unread')}
                    >
                        Belum Dibaca
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                    <button
                        onClick={() => fetchNotifications()}
                        className="text-sm text-gray-600 flex items-center hover:text-gray-800"
                    >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                    </button>

                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-gray-600 hover:text-gray-800"
                        disabled={unreadCount === 0}
                    >
                        Tandai semua dibaca
                    </button>
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
                            <p className="text-gray-500 mt-2">Memuat notifikasi...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <Bell className="h-6 w-6 text-gray-400" />
                            <p className="text-gray-500 mt-2">
                                {selectedTab === 'all'
                                    ? 'Tidak ada notifikasi'
                                    : 'Tidak ada notifikasi yang belum dibaca'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 ${
                                        notification.read ? 'bg-white' : 'bg-blue-50'
                                    }`}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead([notification.id]);
                                        }
                                    }}
                                >
                                    <div className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                {notification.message}
                                            </p>

                                            {notification.data && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {notification.data.transaction_id && (
                                                        <span className="font-medium">
                                                            ID: {notification.data.transaction_id}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-1 text-xs text-gray-500">
                                                {notification.timestamp && (
                                                    formatDistanceToNow(new Date(notification.timestamp), {
                                                        addSuffix: true,
                                                        locale: id
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
