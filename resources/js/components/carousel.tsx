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

    const renderStars = (rating: number): React.ReactElement[] => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);

        for (let i = 0; i < 5; i++) {
          if (i < fullStars) {
            stars.push(
              <span key={i} className="text-yellow-400">★</span>
            );
          } else {
            stars.push(
              <span key={i} className="text-gray-300">★</span>
            );
          }
        }
        return stars;
    };

    // Helper function untuk konversi price
    const parsePrice = (price: any): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const parsed = parseFloat(price);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // Helper function untuk format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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

    const renderProductCard = (product: Product) => {
        const hasDiscount = product.discounts && product.discounts.length > 0;
        const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;

        // Parse price dengan fungsi helper
        const originalPrice = parsePrice(product.price);
        const discountAmount = hasDiscount ? originalPrice * (discountValue / 100) : 0;
        const finalPrice = originalPrice - discountAmount;

        return (
            <Link href={ `${route('products.show', product.slug)}`} key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="relative aspect-square">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {/* Flame icon for promo */}
                    {hasDiscount && (
                        <div className="absolute top-3 left-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">🔥</span>
                            </div>
                        </div>
                    )}
                    {/* Promo badge */}
                    {hasDiscount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Promo
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 text-base line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex items-center mr-2">
                            {renderStars(product.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                            {product.rating || 0}
                        </span>
                    </div>

                    {/* Price and discount */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                                {/* Current/Final Price */}
                                <span className="text-lg font-bold text-gray-800">
                                    {formatCurrency(finalPrice)}
                                </span>

                                {/* Original price with strikethrough if discounted */}
                                {hasDiscount && originalPrice > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatCurrency(originalPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Discount badge */}
                            {hasDiscount && (
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                                    {discountValue}% off
                                </span>
                            )}
                        </div>

                        {/* Savings amount */}
                        {hasDiscount && discountAmount > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                                Hemat {formatCurrency(discountAmount)}
                            </div>
                        )}
                    </div>

                </div>
            </Link>
        );
    };

    // Render Category Card
    const renderCategoryCard = (category: Category) => (
        <Link
            href={`/category/${category.slug}`}
            className="flex flex-col justify-center items-center gap-5 aspect-square bg-white w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
        >
            <div className="relative flex items-center justify-center overflow-hidden bg-gray-50">
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