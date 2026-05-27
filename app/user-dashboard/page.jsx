'use client'
import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  CreditCard, 
  FavoriteBorder,
  Star,
  ChatBubbleOutline,
  Settings,
  Logout,
  Notifications,
  Edit,
  Timeline
} from '@mui/icons-material'
import { redirect, useRouter } from 'next/navigation'
import Image from 'next/image'
import { signOut, useSession } from "next-auth/react"
import OverviewTab from './over-view/overView'
import SettingsTab from './setting-tab/setting-tab'
import CardTab from './packages-tab/CardTab'
import OrdersTab from './orders-tab/orders-tabs'
import ReviewsTab from './reviews-tab/reviews-tab'
import FavoritesTab from './favorites-tab/favorites-tab'

import Navbar from '../components/Navbar'






export default function UserDashboard() {

  
  const { data: session,status } = useSession({    required: true,
    onUnauthenticated() {
      // این به صورت خودکار کنترل می‌شود
    }})

    const [favorites, setFavorites] = useState([])
    const [loading,setLoading] = useState(false)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  // console.log(session);


  // ✅ state برای Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ باز کردن Snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // ✅ بستن Snackbar
  const handleCloseSnackbar = (event, reason) => {
    
    setSnackbar({ ...snackbar, open: false });
  };




  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    }
    if(session?.user?.role === "ADMIN"){
      router.push("admin-dashboard")
    }
  }, [session]);

  async function fetchFavorites(){
    try {
      const res = await fetch('/api/favorites')
      const data = await res.json()
      setFavorites(data)
      console.log('Favorites:', data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  
useEffect(() => {
  console.log('Current status:', status); // اینجا لاگ بگیرید
  console.log(session);
  
  if (session === null) {
    console.log('User is not authenticated, redirecting to login...');
    router.push('/login');
  } else if (status === 'authenticated') {
    console.log('User is authenticated');
    setLoading(false);
  }
}, [status, router]);




 function displayName() {
  if (!session?.user) {
    return 'کاربر'
  }
  return session?.user?.name || 'کاربر'
}


  // تابع خروج
  const handleLogout = async () => {
    await signOut({
      redirectTo: "/",
      redirect: true,
    })
  }

  // رندر محتوای تب فعال
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab favorites={favorites}/>
      case 'packages':
        return <CardTab />
      case 'orders':
        return <OrdersTab/>
      case 'favorites':
        return <FavoritesTab fetchFavorites={fetchFavorites} session={session} loading={loading} setLoading={setLoading} favorites={favorites} setFavorites={setFavorites}/>
      case 'reviews':
        return <ReviewsTab snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} showSnackbar={showSnackbar}/>
      case 'settings':
        return <SettingsTab user={session?.user} />
      default:
        return <OverviewTab/>
    }
  }

  return (


    <div className="bg-linear-to-b from-[#001122] to-[#002233] min-h-screen text-white">
      {/* Header */}
      <header className="bg-[#1d2433]">

<Navbar/>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex lg:flex-row flex-col gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
              {/* User Info Card */}
              <div className="mb-8 text-center">
                <div className="relative mx-auto mb-4 w-24 h-24">
                  {session?.user?.image ? (
                                      <Image
                    src= {"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                    alt="Profile"
                    fill
                    className="border-4 border-blue-500/30 rounded-full object-cover"
                  />)
                  :
                  (
                                            <Image
                                                className="shadow-2xs shadow-gray-200 rounded-full"
                                                src={'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                                                }
                                                width={100}
                                                height={100}
                                                alt="placeholder"
                                                />
                  )
                  }
                  <button className="right-0 bottom-0 absolute bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition">
                    <Edit fontSize="small" />
                  </button>
                </div>
                <h2 className="mb-1 font-bold text-xl">{displayName()}</h2>

                <p className="text-gray-400 text-sm">
                 {session?.user?.email}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'دید کلی', icon: <Timeline /> },
                  { id: 'packages', label: 'سبد خرید', icon: <ShoppingBag /> },
                  { id: 'orders', label: 'سفارشات', icon: <CreditCard /> },
                  { id: 'favorites', label: 'علاقه‌مندی‌ها', icon: <FavoriteBorder /> },
                  { id: 'reviews', label: 'نظرات من', icon: <ChatBubbleOutline /> },
                  { id: 'settings', label: 'تنظیمات', icon: <Settings /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition ${activeTab === item.id 
                      ? 'bg-linear-to-l from-blue-600/30 to-cyan-600/30 border border-blue-500/30' 
                      : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <span className={`${activeTab === item.id ? 'text-blue-400' : 'text-gray-400'}`}>
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

          {/* Main Content */}
          <main className="lg:w-3/4">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>

  )
}