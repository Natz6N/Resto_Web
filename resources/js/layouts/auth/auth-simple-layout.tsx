import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-white p-4 md:p-6">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    {title && (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-full max-w-[240px] py-4">
                                <img
                                    src="/logo.svg"
                                    alt="Logo"
                                    className="mx-auto h-auto w-24"
                                />
                                <img
                                    src="/images/auth-illustration.svg"
                                    alt="Illustration"
                                    className="mx-auto mt-4 h-auto w-full max-w-[180px]"
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                            {description && <p className="text-sm text-gray-500">{description}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
