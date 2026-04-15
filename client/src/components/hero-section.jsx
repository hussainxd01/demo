import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6hHLzLqvkEhs91NKQW3aWmfGTe4Pnm.png"
          alt="Bold by design showcase"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <p className="text-xs md:text-sm text-white uppercase tracking-widest mb-6 font-light">
            SS26 STATEMENT PIECES
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Bold by design
          </h1>
          <Link
            href="/products"
            className="inline-block px-8 py-3 md:py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            DISCOVER MORE
          </Link>
        </div>
      </div>
    </section>
  );
}
