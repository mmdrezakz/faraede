'use client'

import { 
  ShoppingBag, 
  AttachMoney, 
  FavoriteBorder,
  ChatBubbleOutline,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'
import CartTab from '../packages-tab/CardTab'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function OverviewTab({ favorites }) {
  const { data: session } = useSession()
  
  // ✅ 1. اول همه useStateها رو تعریف کن
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 📊 گرفتن تعداد نظرات در انتظار تایید
  useEffect(() => {
    const fetchPendingComments = async () => {
      if (!session?.user?.id) return
      
      try {
        setIsLoading(true)
        const res = await fetch('/api/comments/pending/count')
        const data = await res.json()
        setPendingCommentsCount(data.count || 0)
      } catch (error) {
        console.error('Error fetching pending comments:', error)
        setPendingCommentsCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingComments()
  }, [session])

  // ✅ 2. بعد از تعریف stateها، ازشون استفاده کن
  const stats = {
    totalOrders: 0,
    totalSpent: 0,
    pendingComments: pendingCommentsCount,
    favoritesCount: favorites?.length || 0
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { 
            title: 'مجموع سفارشات', 
            value: stats.totalOrders.toLocaleString('fa-IR'), 
            icon: <ShoppingBag />, 
            color: 'from-blue-500 to-cyan-500',

            isPositive: true
          },
          { 
            title: 'مجموع هزینه‌ها', 
            value: `${stats.totalSpent.toLocaleString('fa-IR')} تومان`, 
            icon: <AttachMoney />, 
            color: 'from-green-500 to-emerald-500',

            isPositive: true
          },
          { 
            title: 'پکیج‌های مورد علاقه', 
            value: stats.favoritesCount.toLocaleString('fa-IR'), 
            icon: <FavoriteBorder />, 
            color: 'from-pink-500 to-rose-500',

            isPositive: true
          },
          { 
            title: 'نظرات در انتظار', 
            value: isLoading ? '...' : stats.pendingComments.toLocaleString('fa-IR'), 
            icon: <ChatBubbleOutline />, 
            color: 'from-purple-500 to-violet-500',

            isPositive: stats.pendingComments === 0
          },
        ].map((card, index) => (
          <div 
            key={index}
            className={`bg-linear-to-br ${card.color} rounded-2xl p-6 transform hover:-translate-y-1 transition duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/10 p-3 rounded-xl">
                {card.icon}
              </div>
              <div className={`flex items-center ${card.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                
                <span className="mr-1 text-sm">{card.trend}</span>
              </div>
            </div>
            <h3 className="mb-1 font-bold text-2xl">{card.value}</h3>
            <p className="text-white/80 text-sm">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Packages Section */}
      <div className="bg-gray-800/30 backdrop-blur-lg mb-8 p-6 border border-gray-700 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">پکیج‌های من</h2>
        </div>
        <CartTab />
      </div>
    </div>
  )
}