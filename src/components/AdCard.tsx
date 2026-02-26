import { Link } from 'react-router-dom';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
  key?: string | number;
}

export default function AdCard({ ad }: AdCardProps) {
  const timeAgo = ad.createdAt ? formatDistanceToNow(ad.createdAt.toDate()) : 'Recently';

  return (
    <Link 
      to={`/ad/${ad.id}`} 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {ad.images && ad.images.length > 0 ? (
          <img 
            src={ad.images[0]} 
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {ad.condition === 'new' && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            New
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-2 h-10 mb-1 group-hover:text-[#149777]">
          {ad.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{ad.location}</p>
        <p className="text-[#149777] font-bold text-lg mb-3">
          Tk {ad.price.toLocaleString()}
        </p>
        
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-50">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo} ago</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShieldCheck className="h-3 w-3 text-blue-400" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
