import { Link } from "react-router-dom";
import logo from "../assets/images/dara-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Logo & About */}
        <div className="text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center space-x-2 mb-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="text-lg font-bold">Dara Hair</span>
          </div>
          <p className="text-gray-600 max-w-xs mx-auto md:mx-0">
            Premium quality wigs and hair products to help you look your best
            every day. Affordable, stylish, and delivered with care.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-pink-500">Home</Link></li>
            <li><Link to="/about" className="hover:text-pink-500">About</Link></li>
            <li><Link to="/cart" className="hover:text-pink-500">Cart</Link></li>
            <li><Link to="/profile" className="hover:text-pink-500">Profile</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            <li><Link to="/category/braided-wig" className="hover:text-pink-500">Braided Wig</Link></li>
            <li><Link to="/category/curly-wig" className="hover:text-pink-500">Curly Wig</Link></li>
            <li><Link to="/category/straight-wig" className="hover:text-pink-500">Straight Wig</Link></li>
            <li><Link to="/category/hair-products" className="hover:text-pink-500">Hair Products</Link></li>
            <li><Link to="/category/tools" className="hover:text-pink-500">Tools</Link></li>
            <li><Link to="/category/others" className="hover:text-pink-500">Others</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-gray-600">
            <li>📞 +234 813 588 1390</li>
            <li>📍 Lagos, Nigeria</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-pink-500 text-white text-center text-sm py-3">
        © {new Date().getFullYear()} Dara Hair and Extensions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
