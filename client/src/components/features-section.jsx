export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          Why Be Yours?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🍃",
              title: "Clean Skincare",
              desc: "Clean and natural skincare with safe and transparent ingredients",
            },
            {
              icon: "🌍",
              title: "European Made",
              desc: "Fast delivery options, tracking your order and more.",
            },
            {
              icon: "✓",
              title: "Luxury Quality",
              desc: "Premium formulations crafted with the finest ingredients.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-white rounded hover:bg-gray-100 transition-colors"
            >
              <p className="text-4xl mb-4">{feature.icon}</p>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
