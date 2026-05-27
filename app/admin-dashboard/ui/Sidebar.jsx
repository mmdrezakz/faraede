'use client'

import { 
  Dashboard,
  Comment,
  ShoppingBag,
  Inventory,
  Logout,
  AdminPanelSettings
} from '@mui/icons-material'
import { signOut } from "next-auth/react"

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: <Dashboard /> },
    { id: 'orders', label: 'سفارشات', icon: <ShoppingBag /> },
    { id: 'packages', label: 'مدیریت پکیج‌ها', icon: <Inventory /> },
    { id: 'comments', label: 'مدیریت کامنت‌ها', icon: <Comment /> },
  ]

  const handleLogout = async () => {
    await signOut({ redirectTo: "/", redirect: true })
  }

  return (
    <aside className="lg:w-1/4">
      <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
        {/* پنل ادمین */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-4 w-24 h-24">
            <div className="flex justify-center items-center bg-linear-to-br from-blue-500 to-cyan-500 rounded-full w-24 h-24">
              <AdminPanelSettings className="w-12 h-12" />
            </div>
          </div>
          <h2 className="mb-1 font-bold text-xl">پنل مدیریت</h2>
          <p className="text-gray-400 text-sm">فراایده</p>
        </div>

        {/* منوی ادمین */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition ${
                activeTab === item.id 
                  ? 'bg-linear-to-l from-blue-600/30 to-cyan-600/30 border border-blue-500/30' 
                  : 'hover:bg-gray-700/50'
              }`}
            >
              <span className={activeTab === item.id ? 'text-blue-400' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 space-x-reverse hover:bg-red-500/10 mt-8 p-3 rounded-xl w-full text-red-400 hover:text-red-300 transition"
          >
            <Logout />
            <span>خروج از حساب</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}