import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps, Product as ProductType, ProductReview } from '@/types/Resto';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Carousel from '@/components/carousel';

interface ShowProductProps extends PageProps {
  product: ProductType;
  relatedProducts: ProductType[];
  reviews: ProductReview[];
}

export default function ShowProduct({ auth, product, relatedProducts, reviews }: ShowProductProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const navItems = [
    { label: 'Home', href: '/', active: false },
    { label: 'Products', href: '/products', active: false },
    { label: 'Product Details', href: `/products/${product.slug}`, active: true },
  ];

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

  const hasDiscount = product.discounts && product.discounts.length > 0;
  const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;
  const discountedPrice = hasDiscount ? product.price * (1 - discountValue / 100) : product.price;

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <>
      <Head title={product.name} />
      <Navbar navItems={navItems} />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Product Details */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
              {/* Image Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.gallery.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`${product.name} gallery ${index}`}
                        className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

              {/* Category */}
              {product.category && (
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {product.category.name}
                  </span>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating || 0} ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {hasDiscount ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-800 mr-2">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {discountValue}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-800">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : product.status === 'out_of_stock'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.status_label}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.status === 'available' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-10 w-10 rounded-l flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-10 w-16 border-y border-gray-200 text-center"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-10 w-10 rounded-r flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="mb-6">
                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                    product.status === 'available'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.status !== 'available'}
                >
                  {product.status === 'available' ? 'Add to Cart' : 'Not Available'}
                </button>
              </div>

              {/* Product Features */}
              <div className="border-t border-gray-200 pt-4">
                <ul className="space-y-2">
                  {product.preparation_time && (
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⏱️</span>
                      Preparation Time: {product.preparation_time} minutes
                    </li>
                  )}
                  {product.is_spicy && (
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🌶️</span>
                      Spicy
                    </li>
                  )}
                  {product.is_vegetarian && (
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🥬</span>
                      Vegetarian
                    </li>
                  )}
                  {product.is_vegan && (
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🌱</span>
                      Vegan
                    </li>
                  )}
                  {product.calories && (
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🔥</span>
                      {product.calories} calories
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs */}
        <section className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ingredients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ingredients</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-600">{ingredient}</li>
                      ))}
                    </ul>

                    {product.allergens && product.allergens.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 mb-2">Allergen Information</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.allergens.map((allergen, index) => (
                            <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No ingredient information available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{review.rating}/5</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium">{review.customer_name}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}

                {/* Review Form */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h4>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="text-2xl text-yellow-400 focus:outline-none"
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <Carousel
              data={relatedProducts}
              type="product"
              showNavigation={true}
              showPagination={false}
            />
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
