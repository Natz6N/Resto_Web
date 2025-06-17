import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Clock, Users, ChefHat, Award } from 'lucide-react';
import WebLayouts from '@/layouts/web-layouts';

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

const ShowProduct: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [activeTab, setActiveTab] = useState<string>('description');

  const productImages: ProductImage[] = [
    { id: 0, src: '/api/placeholder/400/400', alt: 'Nasi Gudeg Jogja - Main' },
    { id: 1, src: '/api/placeholder/400/400', alt: 'Nasi Gudeg Jogja - Side 1' },
    { id: 2, src: '/api/placeholder/400/400', alt: 'Nasi Gudeg Jogja - Side 2' },
    { id: 3, src: '/api/placeholder/400/400', alt: 'Nasi Gudeg Jogja - Ingredients' }
  ];

  const sizes = ['Regular', 'Large', 'Extra Large'];

  const relatedProducts = [
    { id: 1, name: 'Sate Ayam Madura', price: 25000, rating: 4.8, image: '/api/placeholder/200/200' },
    { id: 2, name: 'Rendang Padang', price: 35000, rating: 4.9, image: '/api/placeholder/200/200' },
    { id: 3, name: 'Gado-Gado Jakarta', price: 20000, rating: 4.7, image: '/api/placeholder/200/200' }
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <WebLayouts>
    <div className="min-h-screen bg-gray-50">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={productImages[selectedImage].src}
                alt={productImages[selectedImage].alt}
                className="w-full h-96 object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex space-x-3">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nasi Gudeg Jogja Spesial
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span>(124 reviews)</span>
                </div>
                <span>•</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              <div className="flex items-center space-x-4 text-3xl font-bold text-gray-900">
                <span>Rp 28.000</span>
                <span className="text-lg text-gray-500 line-through">Rp 35.000</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Nikmati kelezatan Gudeg Jogja autentik dengan cita rasa manis khas yang dimasak dengan
              santan kelapa dan gula merah. Disajikan dengan nasi hangat, ayam kampung, telur, dan kerupuk.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Prep time: 15-20 min</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-orange-500" />
                <span>Serves 1-2 people</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ChefHat className="w-4 h-4 text-orange-500" />
                <span>Chef's special recipe</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-orange-500" />
                <span>Halal certified</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex space-x-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <button className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Order Now
              </button>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Fast Delivery</p>
                <p className="text-xs text-gray-600">within 30min</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Quality</p>
                <p className="text-xs text-gray-600">Guaranteed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Easy</p>
                <p className="text-xs text-gray-600">Online Order</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Customer</p>
                <p className="text-xs text-gray-600">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Dish</h3>
                <p className="text-gray-600 mb-4">
                  Gudeg adalah makanan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan
                  santan. Gudeg biasanya dimakan dengan nasi dan disajikan dengan kuah santan yang disebut areh,
                  ayam kampung, telur pindang, tempe, tahu, dan sambal goreng krecek.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Nutritional Information</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Calories: 450 per serving</li>
                  <li>Protein: 25g</li>
                  <li>Carbohydrates: 55g</li>
                  <li>Fat: 18g</li>
                </ul>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Main Ingredients:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Nangka muda (young jackfruit)</li>
                      <li>• Santan kelapa (coconut milk)</li>
                      <li>• Gula merah (palm sugar)</li>
                      <li>• Bumbu halus (ground spices)</li>
                      <li>• Daun salam (bay leaves)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Served With:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Nasi putih (steamed rice)</li>
                      <li>• Ayam kampung (free-range chicken)</li>
                      <li>• Telur pindang (braised egg)</li>
                      <li>• Kerupuk (crackers)</li>
                      <li>• Sambal (chili sauce)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.8 out of 5 (124 reviews)</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    { name: 'Sarah M.', rating: 5, comment: 'Gudeg terenak yang pernah saya coba! Rasanya autentik dan porsinya pas.', date: '2 days ago' },
                    { name: 'Budi S.', rating: 4, comment: 'Makanan datang masih hangat dan fresh. Recommended!', date: '1 week ago' },
                    { name: 'Rina T.', rating: 5, comment: 'Pelayanan cepat dan rasa tidak mengecewakan. Akan order lagi!', date: '2 weeks ago' }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{review.name[0]}</span>
                          </div>
                          <span className="font-medium text-gray-900">{review.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Rp {product.price.toLocaleString()}
                    </span>
                    <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </WebLayouts>
  );
};

export default ShowProduct;