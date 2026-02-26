import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, User, LogOut, Menu, X } from 'lucide-react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#ffc800] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#149777] tracking-tighter">TechSorif</span>
              <span className="text-xs bg-[#149777] text-white px-1 rounded font-bold">MARKET</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 rounded-full border-none focus:ring-2 focus:ring-[#149777] bg-white text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </form>

              <Link to="/post-ad" className="flex items-center space-x-1 text-[#149777] font-bold hover:opacity-80 transition-opacity">
                <PlusCircle className="h-5 w-5" />
                <span>POST AD</span>
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-gray-700 hover:text-[#149777]">
                    <User className="h-6 w-6" />
                  </Link>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-[#149777] font-bold hover:underline">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#149777]"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
            <Link
              to="/post-ad"
              className="flex items-center space-x-2 text-[#149777] font-bold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Post your Ad</span>
            </Link>
            <Link
              to="/login"
              className="block text-gray-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">More from TechSorif</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-[#149777]">Sell Fast</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Membership</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Banner Ads</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Ad Promotions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Help & Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-[#149777]">FAQ</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Stay Safe</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">About TechSorif</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-[#149777]">About Us</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Careers</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Terms and Conditions</Link></li>
                <li><Link to="#" className="hover:text-[#149777]">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Social icons would go here */}
                <span className="text-xs text-gray-400">Facebook</span>
                <span className="text-xs text-gray-400">Twitter</span>
                <span className="text-xs text-gray-400">YouTube</span>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2026 TechSorif Marketplace. All rights reserved.</p>
            <p className="text-sm text-gray-500 mt-4 md:mt-0">Built with ❤️ for Bangladesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
