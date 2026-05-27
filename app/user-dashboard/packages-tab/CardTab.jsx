'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert } from '@mui/material';

export default function CartTab() {
    const { data: session } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    
    // ✅ state برای Modal تایید حذف
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        cartId: null,
        packageTitle: ''
    });
    
    // تعداد محصولات برای نمایش در حالت پیش‌فرض
    const INITIAL_DISPLAY_COUNT = 3;

    useEffect(() => {
        if (session?.user?.id) {
            fetchCart();
        }
    }, [session]);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ باز کردن Modal تایید حذف
    const openDeleteModal = (cartId, packageTitle) => {
        setDeleteModal({
            open: true,
            cartId,
            packageTitle
        });
    };

    // ✅ بستن Modal
    const closeDeleteModal = () => {
        setDeleteModal({
            open: false,
            cartId: null,
            packageTitle: ''
        });
    };

    // ✅ تایید حذف و اجرای عملیات
    const confirmDelete = async () => {
        if (!deleteModal.cartId) return;
        
        try {
            const res = await fetch(`/api/cart?cartId=${deleteModal.cartId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchCart();
                window.dispatchEvent(new CustomEvent('cartUpdate'));
                showSnackbar('پکیج با موفقیت از سبد خرید پاک شد .')
            }
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            closeDeleteModal();
        }
    };
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

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId, quantity: newQuantity })
            });

            if (res.ok) {
                fetchCart();
                window.dispatchEvent(new CustomEvent('cartUpdate'));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const formatPrice = (price) => {
        const numPrice = parseInt(price?.toString().replace(/[^\d]/g, '')) || 0;
        return new Intl.NumberFormat('fa-IR').format(numPrice) + ' تومان';
    };

    // تعیین محصولات برای نمایش
    const displayedItems = showAll 
        ? cartItems 
        : cartItems.slice(0, INITIAL_DISPLAY_COUNT);
    
    const hasMoreItems = cartItems.length > INITIAL_DISPLAY_COUNT;
    const hiddenCount = cartItems.length - INITIAL_DISPLAY_COUNT;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex flex-col justify-center items-center bg-gray-800/50 p-12 rounded-xl h-64">
                <ShoppingCartIcon className="mb-4 w-16 h-16 text-gray-500" />
                <p className="mb-4 text-gray-400 text-lg">برای مشاهده سبد خرید وارد شوید</p>
                <Link 
                    href="/login" 
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
                >
                    ورود به حساب
                </Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center bg-gray-800/50 p-12 rounded-xl">
                <SentimentDissatisfiedTwoToneIcon className="mb-4 w-20 h-20 text-gray-500" />
                <p className="mb-2 text-gray-400 text-xl">سبد خرید شما خالی است</p>
                <p className="mb-6 text-gray-500">پکیج‌های مورد نظر خود را به سبد خرید اضافه کنید</p>
                <Link 
                    href="/#pkg"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
                >
                    مشاهده پکیج‌ها
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ✅ Modal تایید حذف */}
            <Dialog
                open={deleteModal.open}
                onClose={closeDeleteModal}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        direction: 'rtl',
                        padding: '12px',
                        minWidth: { xs: '300px', sm: '450px' },
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 30px rgba(0,0,0,0.3)'
                    }
                }}
            >
                <DialogTitle 
                    id="delete-dialog-title" 
                    sx={{ 
                        fontFamily: 'inherit', 
                        fontSize: '1.3rem', 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#ef4444',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        pb: 2
                    }}
                >
                    <DeleteTwoToneIcon sx={{ fontSize: '28px' }} />
                    حذف محصول از سبد خرید
                </DialogTitle>
                <DialogContent sx={{ mt: 3 }}>
                    <DialogContentText 
                        id="delete-dialog-description" 
                        sx={{ 
                            color: '#e5e7eb', 
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            lineHeight: 1.6
                        }}
                    >
                        آیا از حذف محصول 
                        <span style={{ 
                            color: '#fbbf24', 
                            fontWeight: 'bold', 
                            margin: '0 6px',
                            display: 'inline-block',
                            backgroundColor: 'rgba(251,191,36,0.1)',
                            padding: '2px 8px',
                            borderRadius: '6px'
                        }}>
                            {deleteModal.packageTitle}
                        </span>
                        از سبد خرید خود مطمئن هستید؟
                        <br />
                        <span style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
                            این عمل قابل بازگشت نیست.
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '20px 24px', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Button
                        onClick={closeDeleteModal}
                        variant="outlined"
                        sx={{
                            fontFamily: 'inherit',
                            borderRadius: '10px',
                            color: '#d1d5db',
                            borderColor: '#4b5563',
                            padding: '8px 20px',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            '&:hover': {
                                borderColor: '#6b7280',
                                backgroundColor: 'rgba(75,85,99,0.2)'
                            }
                        }}
                    >
                        انصراف
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        sx={{
                            display:"flex",
                            justifyContent:"center",
                            gap:"16px",
                            fontFamily: 'inherit',
                            borderRadius: '10px',
                            backgroundColor: '#ef4444',
                            padding: '12px 24px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                            '&:hover': {
                                backgroundColor: '#dc2626',
                                boxShadow: '0 6px 16px rgba(239,68,68,0.4)'
                            }
                        }}
                        autoFocus
                        startIcon={<DeleteTwoToneIcon />}
                    >
                      <p className='text-xs'>حذف</p>
                    </Button>
                </DialogActions>
            </Dialog>
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
            {/* بقیه کدهای JSX بدون تغییر */}
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-white text-2xl">سبد خرید</h1>
                <span className="bg-blue-500/20 px-4 py-2 rounded-lg text-blue-400 text-sm">
                    {cartItems.length} کالا
                </span>
            </div>
            
            {/* لیست محصولات */}
            <div className="space-y-4">
                {displayedItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-gray-800/50 p-4 md:p-6 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all duration-300"
                    >
                        <div className="flex md:flex-row flex-col gap-4 md:gap-6">
                            {/* تصویر محصول */}
                            <div className="relative w-full md:w-32 h-48 md:h-32">
                                <Image
                                    src={item.package.image || '/placeholder.jpg'}
                                    alt={item.package.title}
                                    fill
                                    className="rounded-lg object-center object-cover"
                                />
                            </div>
                            
                            {/* اطلاعات محصول */}
                            <div className="flex flex-col flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="mb-2 font-bold text-white text-lg md:text-xl">
                                            {item.package.title}
                                        </h3>
                                        <p className="mb-3 text-gray-400 text-sm line-clamp-2">
                                            {item.package.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => openDeleteModal(item.id, item.package.title)}
                                        className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg transition"
                                    >
                                        <DeleteTwoToneIcon className="text-red-500" />
                                    </button>
                                </div>
                                
                                <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mt-auto">
                                    {/* قیمت */}
                                    <div>
                                        <p className="mb-1 text-gray-400 text-sm">قیمت واحد</p>
                                        <p className="font-bold text-cyan-300 text-lg">
                                            {formatPrice(item.package.price)}
                                        </p>
                                    </div>
                                    
                                    {/* کنترل تعداد */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-sm">تعداد:</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-1 rounded-lg transition disabled:cursor-not-allowed"
                                            >
                                                <RemoveIcon className="w-4 h-4 text-white" />
                                            </button>
                                            <span className="w-8 font-medium text-white text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="bg-gray-700 hover:bg-gray-600 p-1 rounded-lg transition"
                                            >
                                                <AddIcon className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* قیمت کل */}
                                    <div>
                                        <p className="mb-1 text-gray-400 text-sm">قیمت کل</p>
                                        <p className="font-bold text-green-400 text-lg">
                                            {formatPrice((parseInt(item.package.price.replace(/[^\d]/g, '')) * item.quantity).toString())}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* دکمه مشاهده بیشتر/کمتر */}
                {hasMoreItems && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg text-white text-sm hover:scale-105 transition-all duration-300"
                        >
                            {showAll ? (
                                <>
                                    <ExpandLessIcon className="w-5 h-5" />
                                    <span>نمایش کمتر</span>
                                </>
                            ) : (
                                <>
                                    <ExpandMoreIcon className="w-5 h-5" />
                                    <span>مشاهده {hiddenCount} محصول دیگر</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            
            {/* خلاصه سبد خرید - همیشه نمایش داده میشه */}
            <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 border border-gray-700 rounded-xl">
                <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                    <div>
                        <p className="mb-2 text-gray-400 text-sm">مجموع سبد خرید</p>
                        <p className="font-bold text-white text-3xl">
                            {formatPrice(total.toString())}
                        </p>
                    </div>
                    
                    <div className="flex sm:flex-row flex-col gap-3 w-full md:w-auto">
                        <Link
                            href="/"
                            className="bg-linear-to-r from-blue-600 hover:from-blue-700 to-cyan-600 hover:to-cyan-700 px-6 py-3 rounded-lg font-bold text-white text-center transition"
                        >
                            تسویه حساب
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* نمایش تعداد کل محصولات در فوتر */}
            {cartItems.length > INITIAL_DISPLAY_COUNT && (
                <div className="text-gray-500 text-xs text-center">
                    {showAll 
                        ? `نمایش همه ${cartItems.length} محصول`
                        : `نمایش ${INITIAL_DISPLAY_COUNT} محصول از ${cartItems.length} محصول`
                    }
                </div>
            )}
        </div>
    );
}