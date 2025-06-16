import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, MapPin, Clock, Shield, Truck } from 'lucide-react';

// Mock data - replace with actual props/API data
const productData = {
    id: 1,
    name: "Nasi Gudeg Yogyakarta Special",
    description: "Gudeg khas Yogyakarta dengan cita rasa otentik, disajikan dengan ayam kampung, telur pindang, dan sambal krecek yang pedas manis. Dimasak dengan santan kelapa muda dan bumbu rempah pilihan selama 6 jam untuk menghasilkan kelezatan yang tak terlupakan.",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    rating: 4.8,
    reviewCount: 324,
    images: [
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
        "/api/placeholder/600/600"
    ],
    category: "Indonesian Food",
    tags: ["Spicy", "Traditional", "Halal", "Popular"],
    ingredients: ["Nangka Muda", "Ayam Kampung", "Telur Pindang", "Santan Kelapa", "Bumbu Rempah", "Sambal Krecek"],
    nutritionFacts: {
        calories: 520,
        protein: 28,
        carbs: 45,
        fat: 22
    },
    preparationTime: "15-20 minutes",
    restaurant: {
        name: "Warung Gudeg Bu Sari",
        rating: 4.9,
        location: "Yogyakarta",
        verified: true
    },
    stock: 25,
    minOrder: 1,
    maxOrder: 10
};

const relatedProducts = [
    { id: 2, name: "Soto Ayam Lamongan", price: 35000, image: "/api/placeholder/200/200", rating: 4.7 },
    { id: 3, name: "Rendang Padang", price: 55000, image: "/api/placeholder/200/200", rating: 4.9 },
    { id: 4, name: "Gado-gado Jakarta", price: 28000, image: "/api/placeholder/200/200", rating: 4.6 },
    { id: 5, name: "Ayam Betutu Bali", price: 65000, image: "/api/placeholder/200/200", rating: 4.8 }
];

const reviews = [
    {
        id: 1,
        user: "Ahmad Rizki",
        rating: 5,
        comment: "Gudeg terenak yang pernah saya coba! Rasanya otentik banget, persis seperti di Yogya.",
        date: "2 hari yang lalu",
        helpful: 12
    },
    {
        id: 2,
        user: "Sari Dewi",
        rating: 4,
        comment: "Enak sih, tapi agak kurang pedas untuk selera saya. Overall recommended!",
        date: "1 minggu yang lalu",
        helpful: 8
    },
    {
        id: 3,
        user: "Budi Santoso",
        rating: 5,
        comment: "Packaging rapi, makanan sampai dalam kondisi hangat. Mantap!",
        date: "2 minggu yang lalu",
        helpful: 15
    }
];

export default function ShowProduct() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    const handleQuantityChange = (action: 'increase' | 'decrease') => {
        if (action === 'increase' && quantity < productData.maxOrder) {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrease' && quantity > productData.minOrder) {
            setQuantity(prev => prev - 1);
        }
    };

    const totalPrice = productData.price * quantity;
    const savedAmount = (productData.originalPrice - productData.price) * quantity;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i < rating
                        ? 'fill-yellow-400/50 text-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/food" className="text-gray-500 hover:text-blue-600">Food</Link>
                        <span className="text-gray-400">/</span>
                        <Link href={`/category/${productData.category.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-blue-600">
                            {productData.category}
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{productData.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={productData.images[selectedImage]}
                                alt={productData.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {productData.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImage === index
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${productData.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Restaurant Info */}
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {productData.restaurant.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-gray-900">{productData.restaurant.name}</h3>
                                    {productData.restaurant.verified && (
                                        <Shield className="w-4 h-4 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(productData.restaurant.rating)}
                                        <span>{productData.restaurant.rating}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{productData.restaurant.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Title & Rating */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">{productData.name}</h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(productData.rating)}
                                    </div>
                                    <span className="font-semibold">{productData.rating}</span>
                                    <span className="text-gray-500">({productData.reviewCount} reviews)</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {productData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-red-500">
                                    Rp {productData.price.toLocaleString('id-ID')}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                    Rp {productData.originalPrice.toLocaleString('id-ID')}
                                </span>
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                                    -{productData.discount}%
                                </span>
                            </div>
                            <p className="text-sm text-green-600">
                                You save Rp {(productData.originalPrice - productData.price).toLocaleString('id-ID')}
                            </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-700 font-medium">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange('decrease')}
                                            disabled={quantity <= productData.minOrder}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('increase')}
                                            disabled={quantity >= productData.maxOrder}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {productData.stock} items left
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Total:</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {savedAmount > 0 && (
                                    <div className="text-sm text-green-600 mt-1">
                                        Total savings: Rp {savedAmount.toLocaleString('id-ID')}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </button>
                                <button
                                    onClick={() => setIsFavorited(!isFavorited)}
                                    className={`p-3 rounded-lg border transition-colors ${
                                        isFavorited
                                            ? 'bg-red-50 border-red-200 text-red-600'
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-2 text-green-700">
                                <Truck className="w-5 h-5" />
                                <span className="font-semibold">Free Delivery</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>Preparation time: {productData.preparationTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Information Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-12">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            {['description', 'ingredients', 'nutrition', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                                        activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">{productData.description}</p>
                            </div>
                        )}

                        {activeTab === 'ingredients' && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Ingredients</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {productData.ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">{ingredient}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'nutrition' && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Nutrition Facts (per serving)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{productData.nutritionFacts.calories}</div>
                                        <div className="text-sm text-gray-500">Calories</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{productData.nutritionFacts.protein}g</div>
                                        <div className="text-sm text-gray-500">Protein</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{productData.nutritionFacts.carbs}g</div>
                                        <div className="text-sm text-gray-500">Carbs</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{productData.nutritionFacts.fat}g</div>
                                        <div className="text-sm text-gray-500">Fat</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        Write a Review
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-medium text-gray-900">{review.user}</span>
                                                        <div className="flex items-center space-x-1">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <span className="text-sm text-gray-500">{review.date}</span>
                                                    </div>
                                                    <p className="text-gray-700 mb-2">{review.comment}</p>
                                                    <button className="text-sm text-gray-500 hover:text-gray-700">
                                                        Helpful ({review.helpful})
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="flex items-center space-x-1">
                                            {renderStars(product.rating)}
                                        </div>
                                        <span className="text-sm text-gray-500">{product.rating}</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}