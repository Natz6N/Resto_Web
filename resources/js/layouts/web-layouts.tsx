import Navbar from '@/components/Navbar';
import { type ReactNode } from 'react';
import Footer from '@/components/Footer';
interface AppLayoutProps {
    children: ReactNode;
    className?: string;
}
export default function LayoutsWeb({ className, children, ...props }: AppLayoutProps) {
    return (

        <div className={`flex bg-white flex-col items-center justify-center w-full ${className}`} {...props}>

            <Navbar
                navItems={[
                    { label: "Home", href: route('home') },
                    { label: "Menu", href: route('products') },
                    { label: "About", href: route('about') },
                    // { label: "Contact", href: route('contact') },
                ]}
            />
            {children}
            <Footer />
        </div>
    );
}


