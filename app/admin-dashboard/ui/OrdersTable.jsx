'use client'

import { useState } from 'react'
import { Search, Visibility } from '@mui/icons-material'
import { toPersianNumber } from "../../components/comments/utils"

export default function OrdersTable({ orders, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || 
                         order.user.includes(searchTerm) || 
                         order.package.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusStyle = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-500',
      processing: 'bg-blue-500/20 text-blue-500',
      pending: 'bg-yellow-500/20 text-yellow-500',
      cancelled: 'bg-red-500/20 text-red-500'
    }
    return styles[status] || ''
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl">مدیریت سفارشات</h2>
        <div className="justify-center items-center gap-2 grid">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی سفارش..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700/50 py-2 pr-10 pl-4 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-64 text-sm"
            />
            <Search className="top-2.5 left-3 absolute w-4 h-4 text-gray-400" />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none text-sm"
          >
            <option value="all">همه سفارشات</option>
            <option value="completed">تکمیل شده</option>
            <option value="processing">در حال پردازش</option>
            <option value="pending">در انتظار</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
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
              <th className="pb-3 text-center">روش پرداخت</th>
              <th className="pb-3 text-center">وضعیت</th>
              <th className="pb-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-700/20 border-gray-700/50 border-b transition">
                <td className="py-3 font-medium text-sm">{order.id}</td>
                <td className="py-3 text-sm">{order.user}</td>
                <td className="py-3 text-sm">{order.package}</td>
                <td className="py-3 text-sm text-left">{toPersianNumber(order.amount.toLocaleString())} تومان</td>
                <td className="py-3 text-sm text-center">{order.date}</td>
                <td className="py-3 text-sm text-center">{order.paymentMethod}</td>
                <td className="py-3 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-xs border-0 focus:ring-1 ${getStatusStyle(order.status)}`}
                  >
                    <option value="completed" className="bg-gray-800">تکمیل شده</option>
                    <option value="processing" className="bg-gray-800">در حال پردازش</option>
                    <option value="pending" className="bg-gray-800">در انتظار</option>
                    <option value="cancelled" className="bg-gray-800">لغو شده</option>
                  </select>
                </td>
                <td className="py-3 text-center">
                  <button className="hover:bg-blue-500/20 p-1 rounded-lg text-blue-500 transition" title="مشاهده جزئیات">
                    <Visibility fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}