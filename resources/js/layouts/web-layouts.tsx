import Navbar from '@/components/Navbar';
import { type ReactNode } from 'react';
import Footer from '@/components/Footer';
interface AppLayoutProps {
    children: ReactNode;
}
export default function LayoutsWeb({ children, ...props }: AppLayoutProps) {
    return (

        <div className="flex bg-white flex-col items-center justify-center w-full" {...props}>

            <Navbar
                navItems={[
                    { label: "Home", href: "/", active: true },
                    { label: "Menu", href: "/Menu" },
                    { label: "About", href: "/about" },
                    { label: "Contact", href: "/contact" },
                ]}
            />
            {children}
            <Footer />
        </div>
    );
}


