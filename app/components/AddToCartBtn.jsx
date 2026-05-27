'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CallSharpIcon from '@mui/icons-material/CallSharp';
export default function AddToCartButton({ packageId, className = '' ,children,pricePackage}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  
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

  const addToCart = async () => {
    // اعتبارسنجی در کلاینت
    if (!packageId) {
      showSnackbar('شناسه پکیج یافت نشد', 'error');
      return;
    }
    
    if (!session) {
      showSnackbar('لطفاً ابتدا وارد حساب کاربری شوید', 'warning');
      const callbackUrl = encodeURIComponent(window.location.pathname);
      setTimeout(() => {
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
      }, 1500);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          packageId, 
          quantity: 1 
        }),
      });

      if (res.ok) {
        setAdded(true);
        
        // dispatch event برای آپدیت navbar
        window.dispatchEvent(new CustomEvent('cartUpdate'));
        window.dispatchEvent(new CustomEvent('addToCart'));
        
        // ✅ نمایش پیام موفقیت - وسط و بالا
        showSnackbar('✅ محصول  به سبد خرید اضافه شد', 'success');
        
        // بعد از ۲ ثانیه برمیگرده به حالت عادی
        setTimeout(() => setAdded(false), 2000);
      } else {
        const data = await res.json();
        showSnackbar(data.error || 'خطا در افزودن به سبد خرید', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showSnackbar('خطا در ارتباط با سرور', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={()=>{pricePackage !== 0 ? addToCart() : null}}
        disabled={loading || pricePackage === "0"}
        className={`relative overflow-hidden transition-all duration-300$ bg-[#0066ff] hover:bg-[#0251c7] shadow-lg hover:shadow-[#0066ff]/50 ${
          added ? 'bg-green-600 hover:bg-green-700' : ' '
        } shadow-lg  px-5 py-4 rounded-full font-bold text-white ${className}`}
      >
        {loading ? (
          <div className="mx-auto border-2 border-white border-t-transparent rounded-full w-6 h-6 animate-spin" />
        ) : added ? (
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2">
            {pricePackage === "0" ? <CallSharpIcon/> : <ShoppingCartIcon />}

            {children ? children : ""}
          </div>
        )}
      </button>

      {/* ✅ Snackbar وسط صفحه بالا */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        style={{ zIndex: 9999 }}
 sx={{
          // تنظیم موقعیت
          '&.MuiSnackbar-root': {
            top: '20px !important', // فاصله ۲۰ پیکسل از بالا
            position: 'fixed',
            zIndex: 9999,
            transform: 'translateX(-50%)',
            left: '50%',
            right: 'auto',
            width: 'auto',
            minWidth: '300px',
            maxWidth: '90%'
          },
          '& .MuiPaper-root': {
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            minWidth: '260px',
            maxWidth: '400px',
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)'
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