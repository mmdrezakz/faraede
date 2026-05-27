'use client'
import React, { useState, useEffect } from 'react'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function CardNavbar() {

    const { data: session } = useSession();
    const [show, setShow] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // ✅ فقط در کلاینت رندر میشه
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && show && session?.user?.id) {
            fetchCart();
        }

        const handleCartUpdate = () => {
            if (show) fetchCart();
        };

        window.addEventListener('cartUpdate', handleCartUpdate);
        return () => window.removeEventListener('cartUpdate', handleCartUpdate);
    }, [mounted, show, session]);

    
    const fetchCart = async () => {
        setLoading(true);
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

    const removeItem = async (cartId) => {
        try {
            const res = await fetch(`/api/cart?cartId=${cartId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchCart();
                window.dispatchEvent(new CustomEvent('cartUpdate'));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
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
    const formatNumber = (price) => {
        const numPrice = parseInt(price?.toString().replace(/[^\d]/g, '')) || 0;
        return new Intl.NumberFormat('fa-IR').format(numPrice);
    };
    function showHandler() {
        setShow(!show);
    }

    return (
        <div className='relative mx-1'>
            <div onClick={showHandler} className="relative flex justify-center items-center bg-gray-300 rounded-full ring-3 ring-gray-600 w-7 md:w-9 h-7 md:h-9 hover:cursor-pointer">
                <ShoppingCartTwoToneIcon fontSize='small' color='action' />
                {cartItems.length > 0 && !loading && (
                    <span className="-top-1 -right-1 absolute flex justify-center items-center bg-orange-400 rounded-full ring-2 ring-white w-4 md:w-5 h-4 md:h-5 text-[10px] text-white md:text-xs">
                        {cartItems.length}
                    </span>
                )}
            </div>
            
            <div className={`top-12 right-5 w-64 md:w-80 text-xs md:text-sm absolute transition-all ease-in-out duration-75 bg-gray-300 px-3 py-2 ring-3 ring-gray-600 rounded-b-sm rounded-l-sm ${show ? "block" : "hidden"}`} style={{ zIndex: 9999 }}>
                
                {/* هدر */}
                <div className="flex justify-between items-center mb-3 pb-2 border-gray-400 border-b">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">سبد خرید</h3>
                    <button onClick={showHandler}>
                        <CloseTwoToneIcon fontSize='small' color='error' sx={{ border: "2px solid #4a5565", borderRadius: "10px", cursor: "pointer" }} />
                    </button>
                </div>

                {/* محتوای سبد خرید */}
                {!session ? (
                    <div className="py-6 text-center">
                        <p className="mb-3 text-gray-700">برای مشاهده سبد خرید وارد شوید</p>
                        <Link 
                            href="/login" 
                            className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition"
                            onClick={showHandler}
                        >
                            ورود به حساب
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-6">
                        <div className="border-2 border-blue-600 border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="py-6">
                        <p className='flex justify-center items-center gap-4 w-full text-gray-700'>
                            سبد خرید خالی است .
                            <SentimentDissatisfiedTwoToneIcon fontSize='small' />
                        </p>
                    </div>
                ) : (
<>
    {/* لیست محصولات - ریسپانسیو کامل */}
    <div className="space-y-2 md:space-y-3 px-1 max-h-48 md:max-h-64 overflow-y-auto custom-scrollbar">
        {cartItems.map((item) => (
            <div 
                key={item.id} 
                className="flex md:flex-row flex-col gap-2 md:gap-3 md:hover:bg-gray-400/30 hover:bg-gray-400/20 p-2 md:p-3 pb-2 md:pb-3 border-gray-300 md:border-gray-400 last:border-0 border-b rounded-lg transition-colors"
            >
                {/* تصویر محصول - ریسپانسیو */}
                <div className="md:hidden flex justify-center mb-2 w-full">
                    <div className="relative w-16 h-16">
                        <Image 
                            src={item.package.image} 
                            alt={item.package.title}
                            fill
                            className="rounded-lg ring-2 ring-gray-400 object-cover"
                        />
                    </div>
                </div>
                
                {/* اطلاعات محصول */}
                <div className="flex flex-row md:flex-col gap-3 md:gap-2 w-full">
                    {/* تصویر برای دسکتاپ - فقط در md به بالا */}
                    <div className="hidden md:block relative w-16 h-16 shrink-0">
                        <Image 
                            src={item.package.image} 
                            alt={item.package.title}
                            fill
                            className="rounded-lg ring-2 ring-gray-400 object-cover"
                        />
                    </div>
                    
                    {/* محتوای اصلی */}
                    <div className="flex md:flex-row flex-col flex-1 md:justify-between md:items-center gap-2 md:gap-3">
                        {/* عنوان و قیمت */}
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm md:text-sm line-clamp-2 md:line-clamp-1">
                                {item.package.title}
                            </h4>
                            <p className="mt-1 font-bold text-blue-700 text-sm md:text-sm">
                                {formatPrice(item.package.price)}
                            </p>
                        </div>
                        
                        {/* کنترل تعداد و حذف - ریسپانسیو */}
                        <div className="flex justify-between md:justify-end items-center gap-2 mt-1 md:mt-0">
                            <div className="flex items-center gap-1 md:gap-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="flex justify-center items-center bg-gray-500 hover:bg-gray-600 rounded-lg w-7 md:w-6 h-7 md:h-6 text-white md:text-xs text-sm md:hover:scale-100 hover:scale-105 transition-all"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="w-6 md:w-5 font-medium text-gray-800 text-xs md:text-sm text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="flex justify-center items-center bg-gray-500 hover:bg-gray-600 rounded-lg w-7 md:w-6 h-7 md:h-6 text-white md:text-xs text-sm md:hover:scale-100 hover:scale-105 transition-all"
                                >
                                    +
                                </button>
                            </div>
                            
                            <button
                                onClick={() => removeItem(item.id)}
                                className="flex justify-center items-center bg-red-500 hover:bg-red-600 shadow-md rounded-full w-7 md:w-6 h-7 md:h-6 text-white md:hover:scale-100 hover:scale-110 transition-all"
                                title="حذف کالا"
                            >
                                <DeleteTwoToneIcon sx={{ fontSize: { xs: 18, md: 16 } }} />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* قیمت کل محصول - فقط در موبایل */}
                <div className="md:hidden flex justify-between items-center mt-1 pt-1 border-gray-300 border-t">
                    <span className="text-[10px] text-gray-600">قیمت کل:</span>
                    <span className="font-bold text-blue-700 text-xs">
                        {formatPrice((parseInt(item.package.price.replace(/[^\d]/g, '')) * item.quantity).toString())}
                    </span>
                </div>
            </div>
        ))}
        
        {/* نمایش پیام در صورت خالی بودن */}
        {cartItems.length === 0 && (
            <div className="py-8 text-gray-500 text-sm text-center">
                سبد خرید شما خالی است
            </div>
        )}
    </div>

    {/* خلاصه سبد خرید - ریسپانسیو */}
    <div className="bottom-0 sticky bg-gray-300/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none mt-4 pt-3 md:pt-4 border-gray-400 border-t md:rounded-none rounded-b-lg">
        {/* محاسبه مجدد مجموع */}
        {cartItems.length > 0 && (
            <div className="space-y-2 md:space-y-3">
                {/* جزئیات قیمت برای موبایل */}
                <div className="flex justify-between items-center px-1">
                    <span className="text-gray-700 text-xs md:text-sm">
                        تعداد کالاها:
                    </span>
                    <span className="font-medium text-gray-800 text-sm md:text-base">
                        {formatNumber(cartItems.reduce((sum, item) => sum + item.quantity, 0))} عدد
                    </span>
                </div>
                
                <div className="flex justify-between items-center px-1">
                    <span className="font-medium text-gray-700 text-sm md:text-base">
                        مجموع سبد خرید:
                    </span>
                    <span className="font-bold text-blue-700 text-base md:text-lg">
                        {formatPrice(total.toString())}
                    </span>
                </div>
                

            </div>
        )}
        
        {/* دکمه‌های عملیات - ریسپانسیو */}
        <div className="flex md:flex-row flex-col gap-2 md:gap-3 mt-3 md:mt-4">
            <Link
                href="/user-dashboard"
                className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg md:shadow-md px-4 md:px-3 py-3 md:py-2.5 rounded-xl md:rounded-lg font-medium text-white text-sm md:text-sm text-center md:hover:scale-100 hover:scale-[1.02] transition-all"
                onClick={showHandler}
            >
                مشاهده سبد خرید
            </Link>
            <Link
                href="/"
                className="flex-1 bg-linear-to-r from-orange-500 hover:from-orange-600 to-orange-600 hover:to-orange-700 shadow-lg md:shadow-md px-4 md:px-3 py-3 md:py-2.5 rounded-xl md:rounded-lg font-medium text-white text-sm md:text-sm text-center md:hover:scale-100 hover:scale-[1.02] transition-all"
                onClick={showHandler}
            >
                تسویه حساب
            </Link>
        </div>
        

    </div>
</>
                )}
            </div>

            {/* استایل اسکرول سفارشی */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #6b7280;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #4b5563;
                }
            `}</style>
        </div>
    )
}