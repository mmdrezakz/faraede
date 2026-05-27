'use client'

import { toPersianNumber } from "../../components/comments/utils"

export default function TopUsersTable({ users, onViewAll }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">کاربران برتر</h3>
        <button onClick={onViewAll} className="text-blue-400 hover:text-blue-300 text-sm">
          مشاهده همه
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-gray-700 border-b">
              <th className="pb-3 text-right">کاربر</th>
              <th className="pb-3 text-right">ایمیل</th>
              <th className="pb-3 text-center">سفارشات</th>
              <th className="pb-3 text-center">کامنت‌ها</th>
              <th className="pb-3 text-center">لایک‌ها</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((user) => (
              <tr key={user.id} className="border-gray-700/50 border-b">
                <td className="py-3 font-medium">{user.name}</td>
                <td className="py-3 text-gray-300 text-sm">{user.email}</td>
                <td className="py-3 text-center">{toPersianNumber(user.orders)}</td>
                <td className="py-3 text-center">{toPersianNumber(user.comments)}</td>
                <td className="py-3 text-center">{toPersianNumber(user.likes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}