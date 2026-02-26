import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Ad } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, Phone, User, ShieldCheck, ChevronLeft, Share2, Heart, MessageSquare } from 'lucide-react';

export default function AdDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAd({ id: docSnap.id, ...docSnap.data() } as Ad);
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-100 rounded-2xl" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-100 rounded-2xl" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ad Not Found</h2>
        <p className="text-gray-500 mb-8">The advertisement you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-[#149777] text-white px-8 py-3 rounded-full font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  const timeAgo = ad.createdAt ? formatDistanceToNow(ad.createdAt.toDate()) : 'Recently';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs / Back */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-[#149777] font-medium">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all ads
        </Link>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-video relative bg-gray-50">
              {ad.images && ad.images.length > 0 ? (
                <img 
                  src={ad.images[0]} 
                  alt={ad.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {ad.images && ad.images.length > 1 && (
              <div className="p-4 flex space-x-4 overflow-x-auto">
                {ad.images.map((img, i) => (
                  <button key={i} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#149777] transition-all flex-shrink-0">
                    <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-green-50 text-[#149777] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {ad.condition}
              </span>
              <span className="text-sm text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Posted {timeAgo} ago
              </span>
              <span className="text-sm text-gray-400 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {ad.location}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{ad.title}</h1>
            <p className="text-3xl font-bold text-[#149777] mb-8">Tk {ad.price.toLocaleString()}</p>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {ad.description}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Seller Info & Actions */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Seller Information</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-[#149777]/10 rounded-full flex items-center justify-center text-[#149777]">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{ad.userName}</h4>
                <p className="text-xs text-gray-500">Member since 2026</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowPhone(!showPhone)}
                className="w-full bg-[#149777] text-white py-4 rounded-xl font-bold hover:bg-[#118065] transition-colors flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                {showPhone ? ad.contactNumber : 'Show Phone Number'}
              </button>
              <button className="w-full bg-white border-2 border-[#149777] text-[#149777] py-4 rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat with Seller
              </button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
            <div className="flex items-center space-x-2 mb-4 text-yellow-800">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-bold">Safety Tips</h3>
            </div>
            <ul className="text-sm text-yellow-800 space-y-3 opacity-80">
              <li>• Meet in a safe public place</li>
              <li>• Check the item before you buy</li>
              <li>• Never pay in advance</li>
              <li>• Be wary of too-good-to-be-true offers</li>
            </ul>
          </div>

          {/* Ad ID */}
          <div className="text-center text-xs text-gray-400">
            Ad ID: {ad.id}
          </div>
        </div>
      </div>
    </div>
  );
}
