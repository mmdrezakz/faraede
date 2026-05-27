'use client'

import { toPersianNumber } from "../../components/comments/utils"

export default function RecentOrdersTable({ orders, onViewAll }) {
  const getStatusStyle = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-500',
      processing: 'bg-blue-500/20 text-blue-500',
      pending: 'bg-yellow-500/20 text-yellow-500',
      cancelled: 'bg-red-500/20 text-red-500'
    }
    return styles[status] || ''
  }

  const getStatusText = (status) => {
    const texts = {
      completed: 'تکمیل شده',
      processing: 'در حال پردازش',
      pending: 'در انتظار',
      cancelled: 'لغو شده'
    }
    return texts[status] || status
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">آخرین سفارشات</h3>
        <button onClick={onViewAll} className="text-blue-400 hover:text-blue-300 text-sm">
          مشاهده همه
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-gray-700 border-b">
              <th className="pb-3 text-right">شناسه</th>
              <th className="pb-3 text-right">کاربر</th>
              <th className="pb-3 text-right">پکیج</th>
              <th className="pb-3 text-left">مبلغ</th>
              <th className="pb-3 text-center">تاریخ</th>
              <th className="pb-3 text-center">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="border-gray-700/50 border-b">
                <td className="py-3 font-medium text-sm">{order.id}</td>
                <td className="py-3 text-sm">{order.user}</td>
                <td className="py-3 text-sm">{order.package}</td>
                <td className="py-3 text-sm text-left">{toPersianNumber(order.amount)} تومان</td>
                <td className="py-3 text-sm text-center">{order.date}</td>
                <td className="py-3 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}