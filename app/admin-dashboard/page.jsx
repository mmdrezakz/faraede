'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import Navbar from '../components/Navbar'
import Sidebar from './ui/Sidebar'
import StatsCards from './ui/StatsCards'
import UsersTable from './ui/UsersTable'
import OrdersTable from './ui/OrdersTable'
import PackagesList from './ui/PackagesList'
import { TotalComments } from './ui/TotalComments'
import { CommentManager } from './ui/CommentManager'

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    }
  })

  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // state برای آمار (با مقادیر پیش‌فرض صفر)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComments: 0,
    approvedComments: 0,
    pendingComments: 0,
    rejectedComments: 0,
    totalOrders: 0,
    totalLikes: 0,
    totalReviews: 0,
    totalPackages: 0,
    totalRevenue: 0
  })

  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [packages, setPackages] = useState([])

  // دریافت آمار واقعی
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('خطا در دریافت آمار')
      }
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('❌ خطا در دریافت آمار:', err)
    }
  }

  // دریافت کاربران واقعی
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('خطا در دریافت کاربران')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      console.error('❌ خطا در دریافت کاربران:', err)
    }
  }

  // دریافت سفارشات واقعی
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) {
        throw new Error('خطا در دریافت سفارشات')
      }
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('❌ خطا در دریافت سفارشات:', err)
    }
  }

  // دریافت پکیج‌ها
  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages')
      if (!response.ok) {
        throw new Error('خطا در دریافت پکیج‌ها')
      }
      const data = await response.json()
      setPackages(data)
    } catch (err) {
      console.error('❌ خطا در دریافت پکیج‌ها:', err)
    }
  }

  // دریافت همه داده‌ها
  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchOrders(),
      fetchPackages()
    ])
    setLoading(false)
  }

  useEffect(() => {
    if (session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR") {
      fetchAllData()
    }
  }, [session])

  // Handler functions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  useEffect(() => {
    if (session?.user?.role === "USER") {
      router.push("/user-dashboard")
    }
  }, [session, router])

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="border-blue-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <StatsCards stats={stats} packages={packages} />
            <main className='flex lg:flex-row flex-col justify-center items-center gap-4'>
              <section className='w-full md:w-1/2'>
                <UsersTable users={users} onViewAll={() => setActiveTab('users')} />
              </section>
              <section className='w-full md:w-1/2'>
                <TotalComments comments={stats.totalComments} />
              </section>
            </main>
          </div>
        )

      case 'orders':
        return (
          <OrdersTable 
            orders={orders} 
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )

      case 'packages':
        return <PackagesList />

      case 'comments':
        return <CommentManager />
      
      default:
        return null
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center bg-linear-to-b from-[#001122] to-[#002233] min-h-screen">
        <div className="border-blue-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-linear-to-b from-[#001122] to-[#002233] min-h-screen text-white">
      <header className="bg-[#1d2433]">
        <Navbar />
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex lg:flex-row flex-col gap-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="lg:w-3/4">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  )
}