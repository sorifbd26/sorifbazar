import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Ad, CATEGORIES } from '../types';
import AdCard from '../components/AdCard';
import { ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  
  const category = CATEGORIES.find(c => c.slug === slug);

  useEffect(() => {
    const fetchAds = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'ads'), 
          where('category', '==', slug),
          orderBy('createdAt', 'desc')
        );
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
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#149777]">Home</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="font-medium text-gray-900">{category?.name || slug}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {category?.name || slug} in Bangladesh
          </h1>
          <p className="text-gray-500 mt-1">{ads.length} ads found</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link 
                    to={`/category/${cat.slug}`}
                    className={`block py-1 hover:text-[#149777] ${cat.slug === slug ? 'text-[#149777] font-bold' : 'text-gray-600'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-[#149777]" />
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Min: 0</span>
                <span>Max: 1M+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
              <h3 className="text-lg font-bold text-gray-900">No ads found in this category</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or check back later.</p>
              <Link to="/" className="btn-primary">Back to Home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
