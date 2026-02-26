import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Ad } from '../types';
import AdCard from '../components/AdCard';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAds = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedAds = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Ad[];
        setAds(fetchedAds);
      } catch (error) {
        console.error("Error fetching ads for search:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAds();
  }, []);

  useEffect(() => {
    if (queryParam) {
      const lowerQuery = queryParam.toLowerCase();
      const filtered = ads.filter(ad => 
        ad.title.toLowerCase().includes(lowerQuery) || 
        ad.description.toLowerCase().includes(lowerQuery) ||
        ad.category.toLowerCase().includes(lowerQuery) ||
        ad.location.toLowerCase().includes(lowerQuery)
      );
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads);
    }
  }, [queryParam, ads]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link to="/" className="hover:text-[#149777]">Home</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <span className="font-medium text-gray-900">Search Results</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Search results for "{queryParam}"
        </h1>
        <p className="text-gray-500 mt-1">{filteredAds.length} ads found</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredAds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No results found</h3>
          <p className="text-gray-500 mb-6">Try different keywords or browse categories.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      )}
    </div>
  );
}
