'use client'

import { Spinner } from '@heroui/spinner'
import SpinnerBtn from '../../components/SpinnerBtn'
import { 
  Favorite,
  DeleteOutline,  // 🗑️ آیکون سطل آشغال
  FavoriteBorder,
  Star
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddToCartButton from '../../components/AddToCartBtn'
import { formatPrice, toPersianNumber } from '../../components/comments/utils'

export default function FavoritesTab({fetchFavorites,session,favorites,setFavorites,loading,setLoading}){
  const [removingId, setRemovingId] = useState(null);



  // تابع حذف از علاقه‌مندی‌ها
  async function removeFromFavorites(packageId, favoriteId) {
    setRemovingId(favoriteId);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      if (res.ok) {
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="mb-6 font-bold text-2xl">علاقه‌مندی‌های من</h1>
        <div className="flex flex-col justify-center items-center gap-2 h-64">
                  < Spinner classNames = {{
                  circle1: "text-gray-400",  // حلقه اول
                  circle2: "text-orange-500",  // حلقه دوم
                  wrapper: "text-[#001122]"     // wrapper
                }}variant = 'simple' size = 'lg' /> 
                <p>در حال بارگذاری ...</p>
    
       
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="mb-6 font-bold text-2xl">علاقه‌مندی‌های من</h1>
        <div className="flex flex-col justify-center items-center bg-gray-800/50 p-12 rounded-xl">
          <FavoriteBorder className="mb-4 w-20 h-20 text-gray-500" />
          <p className="mb-2 text-gray-400 text-xl">لیست علاقه‌مندی‌ها خالی است</p>
          <p className="mb-6 text-gray-500">پکیج‌های مورد علاقه خود را به این لیست اضافه کنید</p>
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
          >
            مشاهده پکیج‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="mb-6 font-bold text-2xl">علاقه‌مندی‌های من</h1>
      
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((item) => (
          <div 
            key={item.id} 
            className={`group bg-gray-800/50 p-6 border border-gray-700 hover:border-pink-500/30 rounded-xl transition-all duration-300 ${
              removingId === item.id ? 'opacity-50 scale-95' : ''
            }`}
          >
            {/* هدر کارت - عنوان و دکمه قلب */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg line-clamp-1">{item.package.title}</h3>
              <div className="flex items-center gap-2">
                {/* ❤️ قلب قرمز پر - نشان‌دهنده وجود در علاقه‌مندی‌ها */}
                <Favorite className="w-5 h-5 text-pink-500" />
                
                {/* 🗑️ سطل آشغال برای حذف */}
                <button 
                  onClick={() => removeFromFavorites(item.packageId, item.id)}
                  disabled={removingId === item.id}
                  className="hover:bg-red-500/10 disabled:opacity-50 p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition"
                  title="حذف از علاقه‌مندی‌ها"
                >
                  <DeleteOutline className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* محتوای کارت */}
            <div className="mb-4">
              <p className="font-bold text-cyan-300 text-xl">
                {item.package.price === "0" ? "یرای خرید تماس بگیرید ." : formatPrice(item.package.price)} 
              </p>
              <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                {item.package.description}
              </p>
            </div>
            
            {/* دکمه‌های عملیات */}
            <div className="flex items-center gap-4">
              <Link 
                href={`/packages/${item.package.slugId}`} 
                className="flex bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg text-sm text-center transition"
              >
                مشاهده جزئیات
              </Link>
              <AddToCartButton packageId={item.package.id}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}