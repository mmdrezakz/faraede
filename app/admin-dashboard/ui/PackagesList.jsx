'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Add, Edit, Delete, Image as ImageIcon } from '@mui/icons-material'
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import PackageModal from './PackageModal'
import { toPersianNumber } from '../../components/comments/utils'

export default function PackagesList() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  
  // دیالوگ حذف
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    package: null
  })

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // دریافت پکیج‌ها از API
  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/packages')
      if (!response.ok) {
        throw new Error('خطا در دریافت پکیج‌ها')
      }
      const data = await response.json()
      setPackages(data)
      
    } catch (err) {
      console.error('❌ خطا:', err);
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات')
      showSnackbar(err.message || 'خطا در دریافت اطلاعات', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
  }

  // باز کردن دیالوگ تایید حذف
  const openDeleteDialog = (pkg) => {
    setDeleteDialog({
      open: true,
      package: pkg
    })
  }

  // بستن دیالوگ حذف
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      package: null
    })
  }

  // اجرای حذف
  const confirmDelete = async () => {
    const pkg = deleteDialog.package
    if (!pkg) return

    try {
      const response = await fetch(`/api/admin/packages/${pkg.slugId}`, {
        method: 'DELETE',
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'خطا در حذف پکیج')
      }

      setPackages(packages.filter(item => item.id !== pkg.id))
      showSnackbar(`پکیج "${pkg.title}" با موفقیت حذف شد`, 'success')
      closeDeleteDialog()
      
    } catch (err) {
      console.error('❌ خطا:', err)
      showSnackbar(err.message || 'خطا در حذف پکیج', 'error')
      closeDeleteDialog()
    }
  }

  const handleSave = async (packageData) => {
    try {
      const method = editingPackage ? 'PUT' : 'POST'
      const url = editingPackage 
        ? `/api/admin/packages/${editingPackage.slugId}`
        : '/api/admin/packages'

      // مپ slug به تصویر
      const imageMap = {
        'student': '/package/s1.png',
        'resume': '/package/s2.png',
        'landing': '/package/s3.png',
        'base': '/package/s4.png',
        'pro': '/package/s5.png',
        'proplus': '/package/s6.png',
        'shop': '/package/s7.png',
        'enterprise': '/package/s8.png',
      }

      // آماده‌سازی داده برای ارسال
      const apiData = {
        slugId: packageData.slugId,
        title: packageData.title,
        price: packageData.price,
        description: packageData.description,
        image: packageData.image || imageMap[packageData.slugId] || '',
        features: packageData.features || [],
      }



      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const responseData = await response.json()
      

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'خطا در ذخیره پکیج')
      }

      // بروزرسانی لیست
      if (editingPackage) {
        setPackages(packages.map(pkg => 
          pkg.id === editingPackage.id ? responseData : pkg
        ))
        showSnackbar(`پکیج "${packageData.title}" با موفقیت ویرایش شد`, 'success')
      } else {
        setPackages([responseData, ...packages])
        showSnackbar(`پکیج "${packageData.title}" با موفقیت اضافه شد`, 'success')
      }

      handleCloseModal()
      
    } catch (err) {
      console.error('❌ خطا:', err)
      showSnackbar(err.message || 'خطا در ذخیره پکیج', 'error')
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingPackage(null)
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="border-blue-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
        <div className="bg-red-500/20 p-4 border border-red-500 rounded-lg text-red-500 text-center">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 border border-gray-700 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl">مدیریت پکیج‌ها</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-blue-600 hover:from-blue-700 to-cyan-600 hover:to-cyan-700 px-4 py-2 rounded-lg text-white transition"
        >
          <Add fontSize="small" />
          افزودن پکیج جدید
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="bg-gray-700/30 p-8 rounded-lg text-center">
          <p className="text-gray-400">هیچ پکیجی یافت نشد</p>
        </div>
      ) : (
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-700/30 p-4 border border-gray-600 rounded-xl">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="bg-gray-600 rounded-lg w-24 h-24 overflow-hidden">
                    {pkg.image ? (
                      <>
                        
                        <Image 
                          src={pkg.image.startsWith('/') ? pkg.image : `/${pkg.image}`} 
                          alt={pkg.title} 
                          width={96} 
                          height={96} 
                          className="w-full h-full object-cover"
                        />
                      </>
                    ) : (
                      <div className="flex justify-center items-center w-full h-full">
                        <ImageIcon className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div>
                    <h3 className="font-bold text-lg">{pkg.title}</h3>
                    <p className="text-blue-400 text-sm">
                      {toPersianNumber(pkg.price)} تومان
                    </p>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm line-clamp-2">{pkg.description}</p>
                  <div className="flex justify-end items-center gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="hover:bg-blue-500/20 p-1.5 rounded-lg text-blue-500 transition"
                      title="ویرایش"
                    >
                      <Edit fontSize="small" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(pkg)}
                      className="hover:bg-red-500/20 p-1.5 rounded-lg text-red-500 transition"
                      title="حذف"
                    >
                      <Delete fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAddModal || editingPackage) && (
        <PackageModal
          package={editingPackage}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {/* دیالوگ تایید حذف */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '1rem',
          }
        }}
      >
        <DialogTitle className="font-bold text-white text-xl">
          تایید حذف
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-300">
            آیا از حذف پکیج "{deleteDialog.package?.title}" اطمینان دارید؟
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            این عملیات غیرقابل بازگشت است.
          </p>
        </DialogContent>
        <DialogActions className="gap-2 p-4">
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            style={{
              color: '#9ca3af',
              borderColor: '#4b5563',
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
            }}
            autoFocus
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar برای نمایش پیام‌ها */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontSize: '0.9rem',
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}