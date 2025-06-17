import LayoutsWeb from "@/layouts/web-layouts"
import { useEffect, useState } from "react"
import { usePage } from "@inertiajs/react";
import axios from "axios";
import Carousel from "@/components/carousel";
import { Category, Product } from "@/types/Resto";
export default function Home() {
  const [offsetY, setOffsetY] = useState(0);
  const { props } = usePage<{
    menu: Product[];
    carouselCategories: Category[];
    carouselProductPopular: Product[];
  }>();

  const handleScroll = () => {
    setOffsetY(window.scrollY);

  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    console.log(axios.get('/'));
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <LayoutsWeb>
      <section className="relative w-full h-[80vh] overflow-hidden bg-black flex items-center justify-center">
        <img
          src="https://i.pinimg.com/736x/0b/bb/e8/0bbbe8435a1373f6564377a6059cb710.jpg" // Ganti dengan gambar kamu
          alt="Parallax"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            transform: `translateY(${offsetY * 0.5}px)`,
            transition: "transform 0.1s ease-out"
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/80 flex items-center px-3 md:px-30 justify-start">
            <div className="flex flex-col gap-4 max-w-xl">
                <h1 className="z-10 text-white text-4xl md:text-6xl font-bold">Limited Time Offer Get 50% off your first order</h1>
                <button className="z-10 bg-orange-400 text-white px-4 py-2 rounded-md w-fit">Order Now</button>
            </div>
        </div>
      </section>

      <section className=" container-xl mx-auto w-full flex-col mt-10 bg-white text-black flex gap-4">
        <h3 className="text-2xl font-bold ml-3">Kategori</h3>
        <Carousel
            className="pl-3"
            data={props.carouselCategories}
            type="category"
            breakpoints={{
              320: {
                slidesPerView: 3,
                spaceBetween: 10
              },
              640: {
                slidesPerView: 5,
                spaceBetween: 10
              },
              768: {
                slidesPerView: 7,
                spaceBetween: 10
              },
              1024: {
                slidesPerView: 10,
                spaceBetween: 10
              },
              1280: {
                slidesPerView: 14,
                spaceBetween: 10
              }
            }}
            showNavigation={false}
            showPagination={false}
        />
      </section>
      <section className="w-full flex-col flex mt-10 bg-white text-black flex">
        <h3 className="text-2xl font-bold ml-3">Produk Populer</h3>
        <Carousel
            data={props.carouselProductPopular}
            type="product"
            showNavigation={false}
            showPagination={false}
            breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 10
                },
                768: {
                  slidesPerView: 5,
                  spaceBetween: 10
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 10
                },
                1280: {
                  slidesPerView: 8,
                  spaceBetween: 10
                }
              }}
        />
      </section>
      <section className="w-full flex-col flex mt-10 bg-white text-black flex">
        <h3 className="text-2xl font-bold ml-3">Produk Populer</h3>
        <Carousel
            data={props.carouselProductPopular}
            type="product"
            showNavigation={false}
            showPagination={false}
            breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 10
                },
                768: {
                  slidesPerView: 5,
                  spaceBetween: 10
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 10
                },
                1280: {
                  slidesPerView: 8,
                  spaceBetween: 10
                }
              }}
        />
      </section>
      <section className="w-full flex-col flex mt-10 bg-white text-black flex">
        <h3 className="text-2xl font-bold ml-3">Article</h3>
        <div className="grid">
            Ongoing
        </div>
      </section>
    </LayoutsWeb>
  );
}
