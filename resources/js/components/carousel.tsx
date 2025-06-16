import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Link } from "@inertiajs/react";
import { Product, Category } from "@/types/Resto";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface CarouselProps {
    data: Product[] | Category[];
    type: 'product' | 'category';
    slidesPerView?: number;
    spaceBetween?: number;
    showNavigation?: boolean;
    showPagination?: boolean;
    className?: string;
    showScrollbar?: boolean;
    autoplay?: boolean;
    breakpoints?: {
        [width: number]: {
            slidesPerView: number;
            spaceBetween?: number;
        };
    };
    loop?: boolean;
    autoplayDelay?: number;
    renderItem?: (item: Product | Category) => React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({
    data,
    type,
    slidesPerView = 1,
    spaceBetween = 20,
    showNavigation = true,
    showPagination = true,
    showScrollbar = false,
    autoplay = false,
    className = "",
    breakpoints,
    loop,
    autoplayDelay = 3000,
    renderItem
}) => {
    // Konfigurasi responsive breakpoints
    const defaultBreakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: 10
        },
        640: {
            slidesPerView: type === 'product' ? 2 : 3,
            spaceBetween: 15
        },
        768: {
            slidesPerView: type === 'product' ? 3 : 4,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: type === 'product' ? 4 : 5,
            spaceBetween: 25
        },
        1280: {
            slidesPerView: type === 'product' ? 5 : 6,
            spaceBetween: 30
        }
    };

    // Merge custom breakpoints with defaults
    const mergedBreakpoints = breakpoints ? { ...defaultBreakpoints, ...breakpoints } : defaultBreakpoints;

    // Type guard untuk Product
    const isProduct = (item: Product | Category): item is Product => {
        return type === 'product';
    };

    // Type guard untuk Category
    const isCategory = (item: Product | Category): item is Category => {
        return type === 'category';
    };

    // Render Product Card
    const renderProductCard = (product: Product) => {
        const hasDiscount = product.discounts && product.discounts.length > 0;
        const discountValue = hasDiscount ? product.discounts[0]?.value : 0;
        const discountedPrice = hasDiscount ? product.price * (1 - discountValue / 100) : product.price;

        return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                    />
                    {hasDiscount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            -{discountValue}%
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            {hasDiscount ? (
                                <>
                                    <span className="text-lg font-bold text-red-500">
                                        Rp {discountedPrice.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-gray-800">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={() => {
                                // Handle add to cart logic here
                                console.log('Add to cart:', product.id);
                            }}
                        >
                            Beli
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render Category Card
    const renderCategoryCard = (category: Category) => (
        <Link
            href={`/category/${category.slug}`}
            className="flex flex-col justify-center items-center gap-5 aspect-square bg-white w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
        >
            <div className="relative flex items-center justify-center overflow-hidden  bg-gray-50">
                <i className={`${category.icon} text-2xl text-gray-600 group-hover:text-blue-500 transition-colors`}></i>
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    {category.name}
                </h3>
            </div>
        </Link>
    );

    // Early return jika data kosong
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Tidak ada data untuk ditampilkan
            </div>
        );
    }

    // Konfigurasi modules Swiper
    const swiperModules = [Navigation, Pagination, Scrollbar, A11y];
    if (autoplay) {
        swiperModules.push(Autoplay);
    }

    // Determine the render function for items
    const renderItemFunction = (item: Product | Category) => {
        if (renderItem) {
            return renderItem(item);
        }

        if (isProduct(item)) {
            return renderProductCard(item);
        } else if (isCategory(item)) {
            return renderCategoryCard(item);
        }

        return null;
    };

    return (
        <div className={`relative w-full ${className}`}>
            <Swiper
                modules={swiperModules}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                navigation={showNavigation}
                pagination={showPagination ? { clickable: true } : false}
                scrollbar={showScrollbar ? { draggable: true } : false}
                breakpoints={mergedBreakpoints}
                autoplay={autoplay ? {
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                } : false}
                className="px-4"
                loop={loop !== undefined ? loop : data.length > 1}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={`${type}-${item.id}-${index}`}>
                        {renderItemFunction(item)}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Swiper Styles */}
            <style>{`
                .swiper-button-next,
                .swiper-button-prev {
                    color: #3b82f6 !important;
                    background: white !important;
                    width: 40px !important;
                    height: 40px !important;
                    border-radius: 50% !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    margin-top: -20px !important;
                }

                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 16px !important;
                    font-weight: bold !important;
                }

                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    background: #f8fafc !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
                }

                .swiper-pagination-bullet {
                    background: #3b82f6 !important;
                    opacity: 0.3 !important;
                    width: 8px !important;
                    height: 8px !important;
                }

                .swiper-pagination-bullet-active {
                    opacity: 1 !important;
                    transform: scale(1.2) !important;
                }

                .swiper-scrollbar-drag {
                    background: #3b82f6 !important;
                }

                .swiper-scrollbar {
                    background: #e2e8f0 !important;
                }

                /* Line clamp utility untuk text truncation */
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Carousel;