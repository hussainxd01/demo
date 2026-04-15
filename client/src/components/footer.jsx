import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-4 md:px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">SHOP</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link
                href="/skincare"
                className="hover:text-gray-900 transition-colors"
              >
                Skincare
              </Link>
            </li>
            <li>
              <Link
                href="/body-care"
                className="hover:text-gray-900 transition-colors"
              >
                Body Care
              </Link>
            </li>
            <li>
              <Link
                href="/brands"
                className="hover:text-gray-900 transition-colors"
              >
                All Brands
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">HELP</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-900 transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-gray-900 transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/shipping"
                className="hover:text-gray-900 transition-colors"
              >
                Shipping Info
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">ABOUT</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link
                href="/about"
                className="hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/sustainability"
                className="hover:text-gray-900 transition-colors"
              >
                Sustainability
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">FOLLOW</h4>
          <div className="flex gap-4 text-sm">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pinterest
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
        <p>&copy; 2024 Luxury Beauty Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
