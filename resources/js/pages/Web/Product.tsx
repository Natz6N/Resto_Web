import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps, Product as ProductType } from '@/types/Resto';
import Carousel from '@/components/carousel';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface ProductPageProps extends PageProps {
  featuredProducts: ProductType[];
  newProducts: ProductType[];
  popularProducts: ProductType[];
  categories: any[];
}

export default function Product({ auth, featuredProducts, newProducts, popularProducts, categories }: ProductPageProps) {
  const navItems = [
    { label: 'Home', href: '/', active: false },
    { label: 'Products', href: '/products', active: true },
    { label: 'About', href: '/about', active: false },
    { label: 'Contact', href: '/contact', active: false },
  ];

  return (
    <>
      <Head title="Products" />
      <Navbar navItems={navItems} />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Discover Our Delicious Menu
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Explore our wide variety of mouthwatering dishes prepared with fresh ingredients and love.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                View All Menu
              </button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Items</h2>
            <a href="#" className="text-blue-500 hover:underline">View All</a>
          </div>
          <Carousel
            data={featuredProducts}
            type="product"
            showNavigation={true}
            showPagination={false}
            autoplay={true}
            autoplayDelay={5000}
          />
        </section>

        {/* New Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
            <a href="#" className="text-blue-500 hover:underline">View All</a>
          </div>
          <Carousel
            data={newProducts}
            type="product"
            showNavigation={true}
            showPagination={false}
          />
        </section>

        {/* Popular Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Most Popular</h2>
            <a href="#" className="text-blue-500 hover:underline">View All</a>
          </div>
          <Carousel
            data={popularProducts}
            type="product"
            showNavigation={true}
            showPagination={false}
          />
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
            <a href="#" className="text-blue-500 hover:underline">View All</a>
          </div>
          <Carousel
            data={categories}
            type="category"
            showNavigation={true}
            showPagination={false}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
