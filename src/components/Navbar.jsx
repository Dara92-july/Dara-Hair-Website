import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import logo from '../assets/images/dara-logo.jpg';
import cartIcon from '../assets/images/raphael--cart.svg';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const cartItems = useSelector((state) => state.cart);
  const itemCount = cartItems.length;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="bg-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
            <Link to="/" className="text-xl font-bold hover:text-pink-500">Dara Hair</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-pink-500">Home</Link>
            <Link to="/about" className="hover:text-pink-500">About</Link>
            <div className="relative">
              <button onClick={toggleDropdown} className="hover:text-pink-500 focus:outline-none">
                Shop by Categories
              </button>
              {isDropdownOpen && (
                <div className="absolute top-8 left-0 w-48 bg-white shadow-lg border rounded z-50">
                  <Link to="/category/braided-wig" className="block px-4 py-2 hover:bg-pink-100">Braided Wig</Link>
                  <Link to="/category/curly-wig" className="block px-4 py-2 hover:bg-pink-100">Curly Wig</Link>
                  <Link to="/category/straight-wig" className="block px-4 py-2 hover:bg-pink-100">Straight Wig</Link>
                  <Link to="/category/hair-products" className="block px-4 py-2 hover:bg-pink-100">Hair Products</Link>
                  <Link to="/category/tools" className="block px-4 py-2 hover:bg-pink-100">Tools</Link>
                  <Link to="/category/others" className="block px-4 py-2 hover:bg-pink-100">Others</Link>
                </div>
              )}
            </div>
            {user && (
              <Link to="/profile" className="hover:text-pink-500">Profile</Link>
            )}
            <Link to="/cart" className="relative">
              <img src={cartIcon} alt="Cart" className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow p-4 space-y-2">
            <Link to="/" className="block hover:text-pink-500">Home</Link>
            <Link to="/about" className="block hover:text-pink-500">About</Link>
            <div>
              <p className="font-semibold mb-1">Shop by Categories</p>
              <Link to="/category/braided-wig" className="block px-2 py-1 hover:bg-pink-100">Braided Wig</Link>
              <Link to="/category/curly-wig" className="block px-2 py-1 hover:bg-pink-100">Curly Wig</Link>
              <Link to="/category/straight-wig" className="block px-2 py-1 hover:bg-pink-100">Straight Wig</Link>
              <Link to="/category/hair-products" className="block px-2 py-1 hover:bg-pink-100">Hair Products</Link>
              <Link to="/category/tools" className="block px-2 py-1 hover:bg-pink-100">Tools</Link>
              <Link to="/category/others" className="block px-2 py-1 hover:bg-pink-100">Others</Link>
            </div>
            {user && (
              <Link to="/profile" className="block hover:text-pink-500">Profile</Link>
            )}
            <Link to="/cart" className="flex items-center space-x-2 hover:text-pink-500">
              <img src={cartIcon} alt="Cart" className="w-6 h-6" />
              <span>Cart ({itemCount})</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="bg-pink-500 text-center text-sm py-2 font-medium">
        Delivery Of Ready Made Wigs Will Be Posted For Delivery Within 3–7 Working Days
      </div>
    </>
  );
};

export default Navbar;
