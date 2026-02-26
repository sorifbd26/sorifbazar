import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Ad, CATEGORIES } from '../types';
import AdCard from '../components/AdCard';
import { Smartphone, Tv, Car, Home, Lamp, Dog, Shirt, Trophy, MapPin, ChevronRight } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Smartphone, Tv, Car, Home, Lamp, Dog, Shirt, Trophy
};

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'), limit(12));
        const querySnapshot = await getDocs(q);
        const fetchedAds = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Ad[];
        setAds(fetchedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero / Banner */}
      <div className="bg-[#149777] rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
        <div className="z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Buy, Sell, Anything.</h1>
          <p className="text-green-50 text-lg mb-8">Join the largest marketplace in Bangladesh. Find great deals on everything from mobiles to property.</p>
          <div className="flex space-x-4">
            <Link to="/post-ad" className="bg-[#ffc800] text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors">
              Post your Ad
            </Link>
            <button className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full font-bold transition-colors">
              Browse All
            </button>
          </div>
        </div>
        <div className="hidden md:block z-10">
          <Smartphone className="h-48 w-48 text-white/20 absolute -right-12 -bottom-12 rotate-12" />
          <Smartphone className="h-64 w-64 text-white/10 absolute -right-4 -bottom-4 -rotate-12" />
        </div>
      </div>

      {/* Categories */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-gray-500">Find exactly what you're looking for</p>
          </div>
          <Link to="/categories" className="text-[#149777] font-bold flex items-center hover:underline">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = ICON_MAP[category.icon];
            return (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`}
                className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-[#149777]/30 transition-all group"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#149777]/10 transition-colors">
                  <Icon className="h-6 w-6 text-gray-400 group-hover:text-[#149777]" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#149777]">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Ads */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Ads</h2>
            <p className="text-gray-500">The latest items posted on TechSorif</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Sort by:</span>
            <select className="border-none bg-transparent font-bold text-[#149777] focus:ring-0 cursor-pointer">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 h-80 animate-pulse">
                <div className="h-48 bg-gray-100 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="mb-4 flex justify-center">
              <Smartphone className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No ads found yet</h3>
            <p className="text-gray-500 mb-6">Be the first one to post an ad!</p>
            <Link to="/post-ad" className="bg-[#149777] text-white px-8 py-3 rounded-full font-bold hover:bg-[#118065] transition-colors">
              Post an Ad
            </Link>
          </div>
        )}
      </section>

      {/* Locations */}
      <section className="mt-20 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Popular Locations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          {['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Rangpur', 'Barishal', 'Mymensingh', 'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura'].map((loc) => (
            <Link key={loc} to={`/location/${loc.toLowerCase()}`} className="text-gray-600 hover:text-[#149777] flex items-center">
              <MapPin className="h-3 w-3 mr-2 opacity-40" />
              {loc}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
