import Link from "next/link";
import Image from "next/image";

export default function JustArrivedSection({ products, isLoading }) {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Just arrived
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm font-semibold text-black hover:opacity-70 transition-opacity"
            >
              VIEW ALL
            </Link>
            <button className="text-sm text-gray-600 hover:text-black transition-colors">
              &lt;
            </button>
            <button className="text-sm text-gray-600 hover:text-black transition-colors">
              &gt;
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex flex-col">
                {/* Product Image */}
                <div className="bg-gray-100 aspect-square mb-4 rounded overflow-hidden">
                  <Image
                    src={product.image || "/main.jpg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-black text-sm mb-2 uppercase">
                  {product.name}
                </h3>
                <p className="text-gray-800 font-semibold mb-2">
                  €{product.price?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">
                  {product.availability || "Available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
