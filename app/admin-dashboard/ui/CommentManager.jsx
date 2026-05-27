// app/admin/ui/CommentManager.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function CommentManager() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // گرفتن کامنت‌ها
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/comments');
      
      if (!res.ok) {
        throw new Error('خطا در دریافت نظرات');
      }
      
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  // تغییر وضعیت کامنت (از PENDING به PUBLISHED یا برعکس)
  const handleStatusChange = async (commentId, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'PUBLISHED' : 'PENDING';
    
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, status: newStatus })
      });

      if (res.ok) {
        setComments(prev => 
          prev.map(c => c.id === commentId ? { ...c, status: newStatus } : c)
        );
      }
    } catch (error) {
      console.error('خطا در تغییر وضعیت:', error);
      alert('خطا در تغییر وضعیت نظر');
    }
  };

  // حذف کامنت
  const handleDelete = async (commentId) => {
    if (!confirm('آیا از حذف این نظر مطمئن هستید؟')) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${commentId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('خطا در حذف نظر:', error);
      alert('خطا در حذف نظر');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="border-blue-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 p-6 border border-red-500 rounded-lg text-center">
        <p className="mb-4 text-red-500">خطا: {error}</p>
        <button 
          onClick={fetchComments}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* لیست کامنت‌ها */}
      <div className="bg-[#1d2433] rounded-lg overflow-hidden">
        {comments.length === 0 ? (
          <div className="py-12 text-gray-400 text-center">
            <p className="text-lg">نظری یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {comments.map(comment => (
              <CommentRow 
                key={comment.id}
                comment={comment}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت هر ردیف کامنت
function CommentRow({ comment, onStatusChange, onDelete }) {
  return (
    <div className="hover:bg-[#252f3f] p-6 transition-colors">
      <div className="flex lg:flex-row flex-col lg:justify-center lg:items-center gap-2 lg:gap-10">
        {/* اطلاعات کاربر */}
        <div className="lg:w-1/4">
          <div className="flex items-center gap-3">
            {comment.author ? (
              <Image
                src={comment.author.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                alt={comment.author.name || ''}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="flex justify-center items-center bg-gray-600 rounded-full w-12 h-12">
                <span className="font-bold text-white text-lg">
                  {comment.author?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-white">{comment.author?.name || 'کاربر ناشناس'}</p>
              <p className="text-gray-400 text-sm">{comment.author?.email || 'ایمیل ندارد'}</p>
            </div>
          </div>
        </div>

        {/* اطلاعات پکیج و کامنت */}
        <div className="mx-4 lg:w-2/4">
          <Link 
            href={`/packages/${comment.package?.slugId}`}
            target="_blank"
            className="text-blue-400 text-sm hover:underline"
          >
            🎁 {comment.package?.title}
          </Link>
          
          <p className="mt-2 text-gray-300">{comment.content}</p>
          
          {comment.rating && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-300 text-sm">{comment.rating}</span>
            </div>
          )}
        </div>

        {/* وضعیت و عملیات */}
        <div className="lg:w-1/4">
          <div className="flex flex-col items-end gap-3">
            {/* نمایش وضعیت فعلی */}
            <span className={`px-3 py-1 rounded-full text-sm ${
              comment.status === 'PENDING' 
                ? 'bg-yellow-900/30 text-yellow-400' 
                : 'bg-green-900/30 text-green-400'
            }`}>
              {comment.status === 'PENDING' ? '⏳ در انتظار' : '✅ منتشر شده'}
            </span>
            
            <span className="text-gray-400 text-sm">
              {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
            </span>

            {/* دکمه‌های عملیات */}
            <div className="flex gap-2 mt-2">
              {/* دکمه تغییر وضعیت */}
              <button 
                onClick={() => onStatusChange(comment.id, comment.status)}
                className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
                  comment.status === 'PENDING' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
                title={comment.status === 'PENDING' ? 'تأیید نظر' : 'لغو تأیید'}
              >
                {comment.status === 'PENDING' ? '✅ تأیید' : '⏳ لغو تأیید'}
              </button>
              
              {/* دکمه حذف */}
              <button 
                onClick={() => onDelete(comment.id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                title="حذف نظر"
              >
                 حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}