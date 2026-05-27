'use client'

import { useState } from 'react'
import { Save, Cancel as CancelIcon } from '@mui/icons-material'

export default function PackageModal({ package: pkg, onClose, onSave }) {
const [formData, setFormData] = useState({
  id: pkg?.id || null,
  slugId: pkg?.slugId || '',
  title: pkg?.title || '',
  price: pkg?.price || '',
  features: pkg?.features?.join('\n') || '',
  image: pkg?.image || '',  
  description: pkg?.description || '',
})

  const handleSubmit = (e) => {
    e.preventDefault()
    // تبدیل features به آرایه
    const featuresArray = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f !== '')
    
    onSave({
      ...formData,
      features: featuresArray
    })
  }

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="top-0 sticky bg-gray-800 p-6 border-gray-700 border-b">
          <h3 className="font-bold text-xl">
            {pkg ? 'ویرایش پکیج' : 'افزودن پکیج جدید'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="block mb-2 text-gray-300 text-sm">شناسه (slug)</label>
            <input
              type="text"
              value={formData.slugId}
              onChange={(e) => setFormData({...formData, slugId: e.target.value})}
              className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              required
              placeholder="مثال: student, professional, landing"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 text-sm">عنوان پکیج</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              required
              placeholder="مثال: پکیج دانشجویی"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 text-sm">قیمت (تومان)</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              required
              placeholder="مثال: ۵۹۹۰۰۰۰"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 text-sm">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 text-sm">امکانات (هر خط یک مورد)</label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              rows="5"
              className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              placeholder="طراحی ریسپانسیو&#10;تا ۳ صفحه&#10;دامنه و هاست یک‌ساله"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 text-sm">آدرس تصویر (اختیاری)</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="bg-gray-700/50 px-4 py-2 border border-gray-600 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              placeholder="/package/s1.png"
            />

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
            >
              <CancelIcon fontSize="small" />
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 hover:from-blue-700 to-cyan-600 hover:to-cyan-700 px-6 py-2 rounded-lg transition"
            >
              <Save fontSize="small" />
              {pkg ? 'به‌روزرسانی' : 'ذخیره'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}