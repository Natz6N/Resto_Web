import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Dropdown from "./ui/Dropdown";

interface NavItem {
    label: string;
    href: string;
    active?: boolean;
}

interface NavbarProps {
    navItems?: NavItem[];
}

function Navbar({ navItems = [] }: NavbarProps) {
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [offsetY, setOffsetY] = useState(0);
    // Update window width on resize
    const mobile = window.innerWidth < 768;
    useEffect(() => {

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        const handleScroll = () => {
            if (!mobile) {
                setOffsetY(window.scrollY);
                console.log(offsetY);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Set initial width
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const isMobile = windowWidth <= 768;
    const menuItems = navItems.length > 0 ? navItems : [];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleDropdownSelect = (value: string) => {
        console.log('Dipilih:', value);
        // Tambahkan logika sesuai kebutuhan
        if (value === 'Keluar') {
            // Logika logout
        } else if (value === 'Profil') {
            // Redirect ke profil
        }
    };
    const isScrolled = offsetY > 200;
    return (
        <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            mobile ? "bg-white shadow-md backdrop-blur-0" :
            isScrolled
            ? "bg-white shadow-md backdrop-blur-0"
            : "backdrop-blur-md"
        }`}
        style={{
          backdropFilter: isScrolled ? "none" : `blur(${Math.min(offsetY * 0.2, 10)}px)`,
        }}
      >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className={`text-xl font-semibold ${isScrolled ? "text-black" : "text-white"}`}>
                                My<span className="text-orange-400">Food</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <div className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${item.active
                                            ? "text-white bg-orange-400"
                                            : "hover:text-orange-400"
                                        } ${isScrolled ? "text-black" : "text-white"}`}

                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Section - Desktop */}
                    {!isMobile && (
                        <div className="hidden md:flex items-center space-x-4">
                            <Dropdown
                                label="Akun"
                                items={['Profil', 'Pengaturan', 'Keluar']}
                                onSelect={handleDropdownSelect}
                            />
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <div className="md:hidden flex items-center space-x-2">
                            <Dropdown
                                label="Akun"
                                items={['Profil', 'Pengaturan', 'Keluar']}
                                onSelect={handleDropdownSelect}
                            />
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Buka menu utama</span>
                                {/* Hamburger Icon */}
                                <svg
                                    className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                                {/* Close Icon */}
                                <svg
                                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation Menu */}
                {isMobile && isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${item.active
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;