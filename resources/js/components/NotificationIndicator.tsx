import React, { useState, useEffect } from 'react';
import { BellIcon } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { usePage } from '@inertiajs/react';

interface NotificationIndicatorProps {
    onToggle?: () => void;
    className?: string;
    transactionId?: number;
}

export const NotificationIndicator: React.FC<NotificationIndicatorProps> = ({
    onToggle,
    className = '',
    transactionId
}) => {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const role = user?.roles?.[0]?.name || 'all';
    const userId = user?.id || null;

    const { unreadCount, subscribeToChannels } = useNotifications({
        role,
        userId,
        transactionId,
        autoSubscribe: true,
        enableToasts: true
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

export default NotificationIndicator;
