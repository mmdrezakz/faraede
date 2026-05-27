'use client'

import { useState, useEffect } from 'react'
import { Star } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'

export default function ReviewsTab({snackbar,handleCloseSnackbar,showSnackbar}) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState([])
  const [displayedReviews, setDisplayedReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [editContent, setEditContent] = useState('')
  
  // ✅ state برای Modal تایید حذف
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    reviewId: null
  })

  // 📥 گرفتن نظرات کاربر از دیتابیس
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!session?.user?.id) return
      
      try {
        setIsLoading(true)
        const res = await fetch('/api/comments/user')
        const data = await res.json()
        setReviews(data.comments || [])
        
        // ✅ پیشفرض: فقط ۳ کامنت اول رو نشون بده
        setDisplayedReviews((data.comments || []).slice(0, 3))
        setShowAll(false)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserReviews()
  }, [session])

  // ✏️ ویرایش نظر
  const handleEdit = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })

      if (res.ok) {
        setEditingReview(null)
        setEditContent('')

        showSnackbar("نظر شما با موفقیت ویرایش شد .")

        // رفرش نظرات
        const refresh = await fetch('/api/comments/user')
        const data = await refresh.json()
        setReviews(data.comments || [])
        
        // ✅ حفظ وضعیت نمایش
        if (showAll) {
          setDisplayedReviews(data.comments || [])
        } else {
          setDisplayedReviews((data.comments || []).slice(0, 3))
        }
      }
    } catch (error) {
      console.error('Error editing review:', error)
    }
  }

  // ✅ باز کردن Modal تایید حذف
  const openDeleteModal = (commentId) => {
    setDeleteModal({
      open: true,
      reviewId: commentId
    })
  }

  // ✅ بستن Modal
  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      reviewId: null
    })
  }

  // ✅ تایید حذف و اجرای عملیات
  const confirmDelete = async () => {
    const commentId = deleteModal.reviewId
    if (!commentId) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        const updatedReviews = reviews.filter(r => r.id !== commentId)
        setReviews(updatedReviews)
        showSnackbar("✅ نظر شما با موفقیت حذف شد .")
        
        // ✅ حفظ وضعیت نمایش بعد از حذف
        if (showAll) {
          setDisplayedReviews(updatedReviews)
        } else {
          setDisplayedReviews(updatedReviews.slice(0, 3))
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      showSnackbar("❌ خطا در حذف نظر", 'error')
    } finally {
      closeDeleteModal()
    }
  }

  // 👁️ نمایش همه نظرات
  const handleShowAll = () => {
    setDisplayedReviews(reviews)
    setShowAll(true)
  }

  // 🔽 نمایش کمتر (فقط ۳ تا)
  const handleShowLess = () => {
    setDisplayedReviews(reviews.slice(0, 3))
    setShowAll(false)
  }

  // 📅 فرمت تاریخ
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  // 🎨 وضعیت نظر
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-xs">تایید شده</span>
      case 'PENDING':
        return <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-400 text-xs">در انتظار تایید</span>
      case 'REJECTED':
        return <span className="bg-red-500/20 px-3 py-1 rounded-full text-red-400 text-xs">رد شده</span>
      default:
        return <span className="bg-gray-500/20 px-3 py-1 rounded-full text-gray-400 text-xs">نامشخص</span>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="mb-6 font-bold text-2xl">نظرات من</h1>
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 border-gray-300 border-t-2 rounded-full w-12 h-12 animate-spin" />
            <p className="text-gray-400">در حال بارگذاری نظرات...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-2xl">نظرات من</h1>
        <span className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-sm">
          {reviews.length} نظر
        </span>
      </div>
      
      {reviews.length === 0 ? (
        <div className="bg-gray-800/50 py-12 border border-gray-700 rounded-xl text-center">
          <p className="text-gray-400">شما هنوز نظری ثبت نکرده‌اید</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <div key={review.id} className="bg-gray-800/50 p-6 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="mb-1 font-bold text-lg">{review.package?.title || 'پکیج'}</h3>
                    <p className="text-gray-400 text-sm">{formatDate(review.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex ml-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={i < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-600'} 
                          fontSize="small" 
                        />
                      ))}
                    </div>
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                {editingReview === review.id ? (
                  <div className="mb-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="3"
                      className="bg-gray-700 px-4 py-2 border border-gray-600 rounded-lg w-full text-gray-200 text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(review.id)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-white text-sm"
                      >
                        ذخیره
                      </button>
                      <button
                        onClick={() => {
                          setEditingReview(null)
                          setEditContent('')
                        }}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded-lg text-white text-sm"
                      >
                        لغو
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-4 text-gray-300">{review.content}</p>
                )}

                <div className="flex gap-2">
                  {review.status === 'PENDING' && (
                    <button 
                      onClick={() => {
                        setEditingReview(review.id)
                        setEditContent(review.content)
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      ویرایش نظر
                    </button>
                  )}
                  <button 
                    onClick={() => openDeleteModal(review.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    حذف نظر
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Modal تایید حذف - جایگزین alert */}
          <Dialog
            open={deleteModal.open}
            onClose={closeDeleteModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              sx: {
                borderRadius: '16px',
                backgroundColor: '#1f2937',
                color: 'white',
                direction: 'rtl',
                padding: '8px',
                minWidth: '400px'
              }
            }}
          >
            <DialogTitle id="alert-dialog-title" sx={{ fontFamily: 'inherit', fontSize: '1.2rem', fontWeight: 'bold' }}>
              ❌ حذف نظر
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" sx={{ color: '#d1d5db', fontFamily: 'inherit' }}>
                آیا از حذف این نظر مطمئن هستید؟
                <br />
                این عمل قابل بازگشت نیست.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: '16px', gap: '8px' }}>
              <Button
                onClick={closeDeleteModal}
                variant="outlined"
                sx={{
                  fontFamily: 'inherit',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  borderColor: '#4b5563',
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
                  fontFamily: 'inherit',
                  borderRadius: '8px',
                  backgroundColor: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#dc2626'
                  }
                }}
                autoFocus
              >
                حذف
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
                top: '80px !important',
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
              severity={snackbar.severity || 'success'}
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
          
          {/* دکمه‌های نمایش بیشتر/کمتر */}
          {reviews.length > 3 && (
            <div className="flex justify-center mt-6">
              {!showAll ? (
                <button
                  onClick={handleShowAll}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white transition"
                >
                  <span>نمایش همه نظرات ({reviews.length})</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white transition"
                >
                  <span>نمایش کمتر</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}