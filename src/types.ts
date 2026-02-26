export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: any; // Firebase Timestamp
  condition: 'new' | 'used';
  contactNumber: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Mobiles', icon: 'Smartphone', slug: 'mobiles' },
  { id: '2', name: 'Electronics', icon: 'Tv', slug: 'electronics' },
  { id: '3', name: 'Vehicles', icon: 'Car', slug: 'vehicles' },
  { id: '4', name: 'Property', icon: 'Home', slug: 'property' },
  { id: '5', name: 'Home & Living', icon: 'Lamp', slug: 'home-living' },
  { id: '6', name: 'Pets & Animals', icon: 'Dog', slug: 'pets' },
  { id: '7', name: 'Fashion & Beauty', icon: 'Shirt', slug: 'fashion' },
  { id: '8', name: 'Hobbies & Sports', icon: 'Trophy', slug: 'hobbies' },
];
