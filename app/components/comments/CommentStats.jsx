'use client';

import { toPersianNumber } from './utils';

export default function CommentStats({ stats }) {
  return (
    <div className="bg-linear-to-r from-blue-50 dark:from-gray-800 to-indigo-50 dark:to-gray-900 mt-8 xs:mt-12 p-4 xs:p-6 rounded-2xl">
      <h3 className="mb-4 font-bold text-gray-800 dark:text-gray-200 text-lg xs:text-xl">آمار نظرات</h3>
      <div className="gap-3 xs:gap-4 grid grid-cols-2 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 shadow-sm p-3 xs:p-4 rounded-xl text-center">
          <div className="font-bold text-blue-600 dark:text-blue-400 text-xl xs:text-2xl">
            {toPersianNumber(stats.totalComments)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm">تعداد نظرات</div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm p-3 xs:p-4 rounded-xl text-center">
          <div className="font-bold text-green-600 dark:text-green-400 text-xl xs:text-2xl">
            {toPersianNumber(stats.avgRating)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm">میانگین امتیاز</div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm p-3 xs:p-4 rounded-xl text-center">
          <div className="font-bold text-purple-600 dark:text-purple-400 text-xl xs:text-2xl">
            {toPersianNumber(stats.totalLikes)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm">تعداد لایک‌ها</div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm p-3 xs:p-4 rounded-xl text-center">
          <div className="font-bold text-orange-600 dark:text-orange-400 text-xl xs:text-2xl">
            {toPersianNumber(stats.totalReplies)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm">تعداد پاسخ‌ها</div>
        </div>
      </div>
    </div>
  );
}