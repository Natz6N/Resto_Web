import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import WebLayouts from "@/layouts/web-layouts";
import { Product, Category, PageProps } from "@/types/Resto";
import { Search, Filter, ChevronDown, Grid3X3, List } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProductDetailModal from "@/components/product-detail-modal";
import CartDrawer from "@/components/ui/cart-drawer";
import { useCartStore } from "@/lib/cart-store";
// @ts-ignore
import debounce from "lodash/debounce";

interface ProductPageProps {
    products: Product[];
    categories: Category[];
    filters: {
        search: string;
        category: string;
        sort: string;
        order: string;
    };
    auth: {
        user: any;
    };
    errors?: Record<string, string>;
    [key: string]: any;
}

export default function ProductPage() {
    const { products, categories, filters } = usePage<ProductPageProps>().props;

    // State for filter and search
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [categoryFilter, setCategoryFilter] = useState(filters.category || "all");
    const [sortBy, setSortBy] = useState(filters.sort || "name");
    const [sortOrder, setSortOrder] = useState(filters.order || "asc");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // State for products
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [isLoading, setIsLoading] = useState(false);

    // State for product detail modal
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Cart drawer
    const { setIsOpen: setCartOpen } = useCartStore();

    // Debounced search function
    const debouncedSearch = React.useCallback(
        debounce(async (search: string, category: string, sort: string, order: string) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (category !== "all") params.append("category", category);
                params.append("sort", sort);
                params.append("order", order);

                const response = await fetch(`/api/search-products?${params.toString()}`);
                const data = await response.json();
                setFilteredProducts(data);
            } catch (error) {
                console.error("Error searching products:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    // Update URL when filters change (without full page reload)
    const updateUrl = () => {
        const queryParams = {
            search: searchTerm,
            category: categoryFilter,
            sort: sortBy,
            order: sortOrder,
        };

        // Use window.history.pushState to update URL without page reload
        const url = new URL(window.location.href);
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    };

    // Effect to handle search and filters
    useEffect(() => {
        // First do a quick local filter for immediate feedback
        let localFiltered = [...products];

        // Apply search filter locally
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            localFiltered = localFiltered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                (product.description && product.description.toLowerCase().includes(searchLower))
            );
        }

        // Apply category filter locally
        if (categoryFilter !== 'all') {
            localFiltered = localFiltered.filter(product =>
                product.category_id.toString() === categoryFilter
            );
        }

        // Apply sorting locally
        localFiltered.sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'price') {
                const priceA = parseFloat(a.price.toString());
                const priceB = parseFloat(b.price.toString());
                return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
            } else if (sortBy === 'created_at') {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });

        // Update with local filtered results immediately
        setFilteredProducts(localFiltered);

        // Then fetch from server for accurate results
        debouncedSearch(searchTerm, categoryFilter, sortBy, sortOrder);

        // Update URL to reflect current filters
        updateUrl();
    }, [searchTerm, categoryFilter, sortBy, sortOrder]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
    };

    return (
        <WebLayouts className="bg-gray-50 min-h-screen">
            <Head title="Menu | Resto" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Menu Kami</h1>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari menu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="pl-10 pr-10 py-2 w-full appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1">
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSortBy, newSortOrder] = e.target.value.split("-");
                                        setSortBy(newSortBy);
                                        setSortOrder(newSortOrder);
                                    }}
                                    className="pl-4 pr-10 py-2 w-full appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="name-asc">Nama (A-Z)</option>
                                    <option value="name-desc">Nama (Z-A)</option>
                                    <option value="price-asc">Harga (Rendah-Tinggi)</option>
                                    <option value="price-desc">Harga (Tinggi-Rendah)</option>
                                    <option value="created_at-desc">Terbaru</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {/* View Mode Toggles */}
                            <div className="flex space-x-2 border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    className={`p-2 ${
                                        viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-500"
                                    }`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="h-5 w-5" />
                                </button>
                                <button
                                    className={`p-2 ${
                                        viewMode === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-500"
                                    }`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Display */}
                <div className="relative min-h-[300px]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                            <div className="loader w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <div className="text-5xl mb-4">😕</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Tidak ada menu yang ditemukan
                            </h3>
                            <p className="text-gray-500">
                                Coba ubah filter atau kata kunci pencarian Anda
                            </p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredProducts.map((product) => (
                                <ProductListItem
                                    key={product.id}
                                    product={product}
                                    onClick={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
            />

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around items-center py-3 px-4 z-20">
                <button
                    onClick={() => router.get('/')}
                    className="flex flex-col items-center text-gray-600 text-xs"
                >
                    <span className="text-lg mb-1">🏠</span>
                    <span>Home</span>
                </button>
                <button
                    onClick={() => router.get('/Menu')}
                    className="flex flex-col items-center text-blue-500 text-xs"
                >
                    <span className="text-lg mb-1">🍔</span>
                    <span>Menu</span>
                </button>
                <button
                    onClick={() => setCartOpen(true)}
                    className="flex flex-col items-center text-gray-600 text-xs relative"
                >
                    <span className="text-lg mb-1">🛒</span>
                    <span>Keranjang</span>
                </button>
                <button
                    onClick={() => router.get('/about')}
                    className="flex flex-col items-center text-gray-600 text-xs"
                >
                    <span className="text-lg mb-1">ℹ️</span>
                    <span>Tentang</span>
                </button>
            </div>
        </WebLayouts>
    );
}

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    // Parse price with proper conversion
    const parsePrice = (price: any): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const parsed = parseFloat(price);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // Calculate prices
    const originalPrice = parsePrice(product.price);
    const hasDiscount = product.discounts && product.discounts.length > 0;
    const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;
    const discountAmount = hasDiscount ? originalPrice * (discountValue / 100) : 0;
    const finalPrice = originalPrice - discountAmount;

    // Render stars for rating
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="text-yellow-400">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300">★</span>);
            }
        }
        return stars;
    };

    return (
        <div
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <div className="relative aspect-square">
                <img
                    src={product.image || '/Product/default.jpg'}
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
        </div>
    );
};

interface ProductListItemProps {
    product: Product;
    onClick: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onClick }) => {
    // Parse price with proper conversion
    const parsePrice = (price: any): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const parsed = parseFloat(price);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // Calculate prices
    const originalPrice = parsePrice(product.price);
    const hasDiscount = product.discounts && product.discounts.length > 0;
    const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;
    const discountAmount = hasDiscount ? originalPrice * (discountValue / 100) : 0;
    const finalPrice = originalPrice - discountAmount;

    return (
        <div
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer flex"
            onClick={onClick}
        >
            {/* Product Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <img
                    src={product.image || '/Product/default.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg line-clamp-1">
                        {product.name}
                    </h3>

                    {/* Promo badge */}
                    {hasDiscount && (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold h-fit">
                            Promo
                        </div>
                    )}
                </div>

                {/* Category */}
                {product.category && (
                    <div className="text-xs text-gray-500 mt-1">
                        {product.category.name}
                    </div>
                )}

                {/* Description */}
                {product.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Price and Discount */}
                <div className="mt-auto pt-2 flex items-end justify-between">
                    <div className="flex flex-col">
                        {/* Current/Final Price */}
                        <span className="text-lg font-bold text-gray-800">
                            {formatCurrency(finalPrice)}
                        </span>

                        {/* Original price with strikethrough if discounted */}
                        {hasDiscount && originalPrice > 0 && (
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 line-through mr-2">
                                    {formatCurrency(originalPrice)}
                                </span>
                                <span className="text-xs text-green-600 font-medium">
                                    Hemat {formatCurrency(discountAmount)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                        <div className="flex items-center text-sm text-yellow-500">
                            <span className="mr-1">★</span>
                            <span>{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
