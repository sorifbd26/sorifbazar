import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CATEGORIES } from '../types';
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type FormData = {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  condition: 'new' | 'used';
  contactNumber: string;
};

export default function PostAdPage() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setImages(prev => [...prev, ...fileList].slice(0, 5)); // Limit to 5 images
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError("Please login to post an ad");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload images
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `ads/${Date.now()}-${image.name}`);
          await uploadBytes(imageRef, image);
          return getDownloadURL(imageRef);
        })
      );

      // 2. Save to Firestore
      await addDoc(collection(db, 'ads'), {
        ...data,
        price: Number(data.price),
        images: imageUrls,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      console.error("Error posting ad:", err);
      setError(err.message || "Failed to post ad. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to post an advertisement.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-[#149777] text-white px-8 py-3 rounded-full font-bold w-full"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Ad Posted!</h2>
        <p className="text-gray-600">Your advertisement has been successfully published. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post an Ad</h1>
        <p className="text-gray-500 mb-8">Fill in the details below to reach thousands of buyers</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photos (Max 5)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-100 overflow-hidden relative">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                  <button 
                    type="button"
                    onClick={() => setImages(images.filter((_, index) => index !== i))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#149777] hover:bg-green-50 transition-all">
                  <Camera className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Add Photo</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ad Title</label>
              <input 
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. iPhone 13 Pro Max 256GB"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] focus:border-transparent outline-none"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              {...register('description', { required: 'Description is required' })}
              rows={4}
              placeholder="Describe what you are selling. Include details like condition, features, and reason for selling."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] focus:border-transparent outline-none resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (Tk)</label>
              <input 
                type="number"
                {...register('price', { required: 'Price is required' })}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] focus:border-transparent outline-none"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
              <div className="flex space-x-4">
                <label className="flex-1">
                  <input type="radio" {...register('condition')} value="used" className="hidden peer" defaultChecked />
                  <div className="text-center py-3 rounded-lg border border-gray-200 cursor-pointer peer-checked:border-[#149777] peer-checked:bg-green-50 peer-checked:text-[#149777] font-bold text-sm">
                    Used
                  </div>
                </label>
                <label className="flex-1">
                  <input type="radio" {...register('condition')} value="new" className="hidden peer" />
                  <div className="text-center py-3 rounded-lg border border-gray-200 cursor-pointer peer-checked:border-[#149777] peer-checked:bg-green-50 peer-checked:text-[#149777] font-bold text-sm">
                    New
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <input 
                {...register('location', { required: 'Location is required' })}
                placeholder="e.g. Uttara, Dhaka"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] focus:border-transparent outline-none"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
            <input 
              {...register('contactNumber', { required: 'Contact number is required' })}
              placeholder="017XXXXXXXX"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#149777] focus:border-transparent outline-none"
            />
            {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className="w-full bg-[#149777] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#118065] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Publishing Ad...
              </>
            ) : (
              'Publish Ad'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
