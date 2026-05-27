'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Alert, Snackbar } from '@mui/material';

export default function FavoriteButton({ 
  packageId, 
  userId: propUserId, 
  className = '', 
  showTooltip = true,
  size = 'md'
}) {
  const { data: session, status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
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
  // تعیین سایز دکمه
  const sizeClasses = {
    sm: 'p-1.5 w-8 h-8',
    md: 'p-2 w-10 h-10',
    lg: 'p-2.5 w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // اولویت با userId که از prop اومده، بعد session
  const effectiveUserId = propUserId || session?.user?.id;

  useEffect(() => {
    if (effectiveUserId && mounted) {
      checkFavoriteStatus();
    }
  }, [effectiveUserId, packageId, mounted]);

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/favorites/check?packageId=${packageId}`);
      const data = await res.json();
      setIsFavorite(data.isFavorite || false);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    // اگه userId نداره، ببر صفحه لاگین
    if (!effectiveUserId) {
      const callbackUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?callbackUrl=${callbackUrl}`;
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setIsFavorite(data.liked || false);
      if(isFavorite){
        showSnackbar("از لیست با موفقیت حذف شد")

      }else{
        showSnackbar("به لیست علاقه مندی ها اضافه شد .")

      }
        // dispatch event برای آپدیت همزمان در کامپوننت‌های دیگه
        const event = new CustomEvent('favoriteUpdate', {
          detail: { packageId, liked: data.liked }
        });
        window.dispatchEvent(event);
      } else {
        console.error('Error:', data.error);
        // اگه خطای 401 باشه (نشست منقضی شده)
        if (res.status === 401) {
          const callbackUrl = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?callbackUrl=${callbackUrl}`;
        } else {
          alert(data.error || 'خطا در عملیات');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // برای جلوگیری از hydration mismatch
  if (!mounted) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className={`${iconSizes[size]} opacity-0`} />
      </div>
    );
  }

  return (
    <>
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`group relative ${sizeClasses[size]} rounded-full transition-all duration-300 ${
        isFavorite 
        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-500' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
      }  ${ className } `}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      >
      {loading ? (
        <div className={`${iconSizes[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
      ) : isFavorite ? (
        <HeartSolid className={`${iconSizes[size]} text-red-600 transition-transform group-hover:scale-110 dark:text-red-500`} />
      ) : (
        <HeartOutline className={`${iconSizes[size]} transition-transform group-hover:scale-110`} />
      )}
      
      {/* Tooltip */}
      {showTooltip && (
        <span className="-bottom-8 left-1/2 z-50 absolute bg-gray-800 dark:bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-white text-xs whitespace-nowrap transition-opacity -translate-x-1/2 pointer-events-none transform">
          {isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        </span>
      )}
    </button>

                                <Snackbar
                                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                  open={snackbar.open}
                                  autoHideDuration={3000}
                                  onClose={handleCloseSnackbar}
                                  sx={{
                                    '& .MuiSnackbar-root': {
                                      top: '80px !important', // فاصله از بالای صفحه
                                    },
                                    '& .MuiPaper-root': {
                                      borderRadius: '14px',
                                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                      minWidth: '260px',
                                      maxWidth: '400px',
                                      display:"flex",
                                      alignItems:"center",
                                      gap:"10px"
                                    }
                                  }}
                                >
                                  <Alert
                                    onClose={handleCloseSnackbar}
                                    severity={snackbar.severity}
                                    variant="filled"
                                    sx={{
                                      width: '100%',
                                      direction: 'rtl',
                                      fontFamily: 'inherit',
                                      fontSize: '0.95rem',
                                      fontWeight: 500,
                                      alignItems: 'center',
                                      '& .MuiAlert-message': {
                                        padding: '8px 0',
                                        textAlign: 'center',
                                        flex: 1
                                      },
                                      '& .MuiAlert-icon': {
                                        marginRight: '0',
                                        marginLeft: '12px'
                                      }
                                    }}
                                  >
                                    {snackbar.message}
                                  </Alert>
                                </Snackbar>
      </>
  );
}