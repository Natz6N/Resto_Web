import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationIndicator from '@/components/NotificationIndicator';
import NotificationPanel from '@/components/Notifications/NotificationPanel';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
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
            />

            <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
            />

            <div className="flex items-center">
                <NotificationIndicator
                    onToggle={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                    className="mr-2"
                />
            </div>

            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </div>
    );
}
