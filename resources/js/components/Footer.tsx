import React from 'react';
import { Link } from '@inertiajs/react';

const Footer: React.FC = () => {
    return (
        <footer className="relative w-full bg-gray-900 text-white overflow-hidden">
            {/* Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large circle on the left */}
                <div className="absolute -left-32 -top-32 w-96 h-96 rounded-full border-[14px] border-gray-700 opacity-30"></div>
                {/* Medium circle in the middle */}
                <div className="absolute left-1/2 -top-20 w-64 h-64 rounded-full border-[10px] border-gray-700 opacity-20 transform -translate-x-1/2"></div>
                {/* Large circle on the right */}
                <div className="absolute -right-40 -bottom-40 w-[500px] h-[500px] rounded-full border-[10px] border-gray-700 opacity-25"></div>
                {/* Small circle on the right */}
                <div className="absolute right-20 top-20 w-32 h-32 rounded-full border-[14px] border-gray-700 opacity-20"></div>
            </div>

            {/* Footer Content */}
            <div className="relative z-10 container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                My<span className="text-orange-500">Food</span>
                            </h2>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                            Delicious meals with a modern touch.
                            Enjoy high-quality dishes made by expert
                            chefs
                        </p>
                    </div>

                    {/* Main Navigation */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">
                            Main Navigation
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/food"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Food
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/category"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Category
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/article"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Article
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">
                            Customer Support
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/track-order"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/returns"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/payment"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Payment Methods
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Information */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">
                            Company Information
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/journey"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Our Journey
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/careers"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/press"
                                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                                >
                                    Press & Media
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-12 pt-8">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 MyFood. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Styling for Better Circle Effects */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .absolute.-left-32 {
                        left: -8rem;
                        top: -8rem;
                        width: 16rem;
                        height: 16rem;
                    }

                    .absolute.-right-40 {
                        right: -10rem;
                        bottom: -10rem;
                        width: 20rem;
                        height: 20rem;
                    }
                }

                @media (max-width: 640px) {
                    .absolute.-left-32 {
                        left: -6rem;
                        top: -6rem;
                        width: 12rem;
                        height: 12rem;
                    }

                    .absolute.-right-40 {
                        right: -8rem;
                        bottom: -8rem;
                        width: 16rem;
                        height: 16rem;
                    }

                    .absolute.left-1/2 {
                        display: none;
                    }

                    .absolute.right-20 {
                        display: none;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;