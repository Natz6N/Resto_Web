import Navbar from '@/components/Navbar';
import { type ReactNode } from 'react';
import Footer from '@/components/Footer';
import CustomerNotificationPanel from '@/components/CustomerNotificationPanel';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    className?: string;
    transactionId?: number;
}

export default function LayoutsWeb({ className, children, transactionId, ...props }: AppLayoutProps) {
    // Get transaction ID from props or from the Inertia page props if available
    const { transaction } = usePage().props as any;
    const currentTransactionId = transactionId || transaction?.id;

    return (
        <div className={`flex bg-white flex-col items-center justify-center w-full ${className}`} {...props}>
            <Navbar
                navItems={[
                    { label: "Home", href: route('home') },
                    { label: "Menu", href: route('products') },
                    { label: "About", href: route('about') },
                ]}
            />
            {children}
            <Footer />

            {/* Add the customer notification panel */}
            <CustomerNotificationPanel transactionId={currentTransactionId} />
        </div>
    );
}


