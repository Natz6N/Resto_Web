import Navbar from '@/components/Navbar';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}
export default function LayoutsWeb({ children, ...props }: AppLayoutProps) {
    return (

        <div className="flex bg-white items-center justify-center w-full" {...props}>

            <Navbar
                navItems={[
                    { label: "Dashboard", href: "/dashboard", active: true },
                    { label: "Products", href: "/products" },
                    { label: "Home", href: "/Home" },
                ]}
            />
            {children}
        </div>
    );
}


