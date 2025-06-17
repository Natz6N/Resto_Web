import { useEffect, useRef, useState } from "react";

export default function About() {
    const parallaxRef = useRef<HTMLDivElement>(null);
    const [offsetY, setOffsetY] = useState(0);

    const handleScroll = () => {
        if (parallaxRef.current) {
            const rect = parallaxRef.current.getBoundingClientRect();
            setOffsetY(-rect.top / 3); // kontrol kecepatan parallax
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative w-full overflow-x-hidden text-gray-800">
            {/* Parallax Background */}
            <div
                ref={parallaxRef}
                className="absolute top-0 left-0 w-full h-[400px] bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1400&q=80)`,
                    transform: `translateY(${offsetY}px)`,
                    transition: "transform 0.1s linear",
                }}
            />

            {/* Overlay Gradient */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-black/60 to-transparent z-10" />

            {/* Main Content */}
            <div className="relative z-20 pt-[420px] pb-16 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-6 text-red-700">Tentang Kami</h1>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    <p className="mb-6 text-lg leading-relaxed">
                        <strong>MyFood</strong> adalah restoran modern yang didirikan sejak tahun <strong>20xx</strong> oleh <strong>NatzSixN</strong>. Didirikan dari passion terhadap kuliner dan teknologi, MyFood menggabungkan keduanya dalam satu pengalaman bersantap yang luar biasa.
                    </p>

                    <p className="mb-6 italic border-l-4 border-red-600 pl-4 text-gray-600">
                        "Rasa Asli, Teknologi Terkini."
                    </p>

                    <p className="mb-6 text-base leading-relaxed">
                        Seiring waktu, kami berkembang dari kedai sederhana menjadi restoran yang dikenal karena inovasi dan konsistensinya dalam menyajikan rasa. Kami percaya bahwa makanan bukan hanya untuk kenyang, tapi juga pengalaman yang membekas.
                    </p>

                    <h2 className="text-2xl font-semibold mb-2 text-red-700">Visi dan Misi Kami</h2>
                    <p className="mb-6 text-base leading-relaxed">
                        Visi kami adalah menjadi restoran terdepan dalam inovasi kuliner, sementara misi kami adalah memberikan pengalaman bersantap yang tak terlupakan bagi setiap pelanggan.
                    </p>

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-2 text-red-700">Sosial Media Kami</h2>
                        <ul className="list-disc list-inside text-blue-600">
                            <li>
                                Instagram:{" "}
                                <a
                                    href="https://instagram.com/Natz6N"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    @Natz6N
                                </a>
                            </li>
                            <li>
                                GitHub:{" "}
                                <a
                                    href="https://github.com/Natz6N"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    github.com/Natz6N
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10 text-center">
                        <a href="/reservasi" className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">
                            Reservasi Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
