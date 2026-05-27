'use client'

import { 
  People, 
  ShoppingBag, 
  Inventory, 
  ThumbUp 
} from '@mui/icons-material'

// تابع تبدیل عدد به فارسی
const toPersianNumber = (num) => {
  if (num === undefined || num === null) return '۰'
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, x => persianDigits[parseInt(x)])
}

export default function StatsCards({ stats, packages = [] }) {
  // محاسبه تعداد پکیج‌ها - همه پکیج‌ها فعال هستند چون فیلد status نداریم
  const totalPackages = packages?.length || stats.totalPackages || 0
  
  const cards = [
    {
      title: 'کل کاربران',
      value: stats.totalUsers || 0,
      subValue: '+۱۲ نسبت به ماه قبل',
      icon: <People className="w-8 h-8" />,
      gradient: 'from-blue-500 to-blue-600',
      textColor: 'blue'
    },
    {
      title: 'کل سفارشات',
      value: stats.totalOrders || 0,
      subValue: `درآمد: ${toPersianNumber(stats.totalRevenue || 0)} تومان`,
      icon: <ShoppingBag className="w-8 h-8" />,
      gradient: 'from-green-500 to-green-600',
      textColor: 'green'
    },
    {
      title: 'پکیج‌ها',
      value: totalPackages,
      subValue: `${toPersianNumber(totalPackages)} پکیج فعال`,
      icon: <Inventory className="w-8 h-8" />,
      gradient: 'from-purple-500 to-purple-600',
      textColor: 'purple'
    },
    {
      title: 'تعاملات',
      value: stats.totalLikes || 0,
      subValue: `${toPersianNumber(stats.totalComments || 0)} کامنت`,
      icon: <ThumbUp className="w-8 h-8" />,
      gradient: 'from-orange-500 to-orange-600',
      textColor: 'orange'
    }
  ]

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div key={index} className={`bg-linear-to-br ${card.gradient} shadow-lg p-6 rounded-2xl`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-${card.textColor}-100 text-sm`}>{card.title}</p>
              <p className="mt-2 font-bold text-3xl">{toPersianNumber(card.value)}</p>
              <p className={`mt-2 text-${card.textColor}-200 text-sm`}>{card.subValue}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}