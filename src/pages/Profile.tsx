import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Ad } from '../types';
import AdCard from '../components/AdCard';
import { User, Package, Trash2, Settings, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAds = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'ads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedAds = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Ad[];
        setAds(fetchedAds);
      } catch (error) {
        console.error("Error fetching user ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, [user]);

  const handleDelete = async (adId: string) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteDoc(doc(db, 'ads', adId));
        setAds(ads.filter(ad => ad.id !== adId));
      } catch (error) {
        console.error("Error deleting ad:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
        <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-[#149777]/10 rounded-full flex items-center justify-center text-[#149777] mb-4">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.displayName || 'User'}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <nav className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-green-50 text-[#149777] font-bold">
                <Package className="h-5 w-5" />
                <span>My Ads</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={() => signOut(auth)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Advertisements</h1>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
              {ads.length} Ads
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <div key={ad.id} className="relative group">
                  <AdCard ad={ad} />
                  <button 
                    onClick={() => handleDelete(ad.id)}
                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">You haven't posted any ads yet</h3>
              <p className="text-gray-500 mb-6">Start selling your items today!</p>
              <button onClick={() => navigate('/post-ad')} className="btn-primary">Post an Ad</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
