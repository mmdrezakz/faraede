'use client';

import { useState } from 'react';
import Image from 'next/image';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SmsIcon from '@mui/icons-material/Sms';
import { formatDate, toPersianNumber, renderStars } from './utils';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import { useSession } from 'next-auth/react';
export default function CommentItem({ 
  comment, 
  replies, 
  onLike, 
  onReply,
  isReplying,
  setReplyingTo,
  replyText,
  setReplyText
}) {
  
  const {data:session} = useSession()
const [showReplay,setShowReplay] = useState(false)
  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4 xs:p-6">
        {/* هدر کامنت */}
        <div className="flex xs:flex-row flex-col justify-between items-start gap-3 xs:gap-4 mb-4">
          <div className="flex items-center gap-3 w-full xs:w-auto">
            <div className="relative w-10 xs:w-12 h-10 xs:h-12 shrink-0">
              <Image
                src={comment.author?.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                alt={comment.author?.name || 'کاربر'}
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm xs:text-base truncate">
                  {comment.author?.name || 'کاربر'}
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex">
                  {renderStars(comment.rating || 5)}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-xs xs:text-sm">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onLike(comment.id)}
            className="left-1 md:left-5 absolute flex items-center self-end xs:self-start gap-1 mt-2 xs:mt-0 text-gray-500 hover:text-red-500 dark:hover:text-red-400 dark:text-gray-400 transition"
          >
            <FavoriteIcon fontSize="small" />
            <span className="text-sm">{toPersianNumber(comment.likes || 0)}</span>
          </button>
        </div>

        {/* متن کامنت */}
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-sm xs:text-base leading-relaxed">
          {comment.content}
        </p>

        {/* دکمه پاسخ */}
        <button
          onClick={() => setReplyingTo(isReplying ? null : comment.id)}
          className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:hover:text-blue-300 dark:text-blue-400 text-sm"
        >
          <SmsIcon fontSize="small" />

          {session?.user ? isReplying ? 'لغو پاسخ' : 'پاسخ دادن' : "برای پاسخ دادن ابتدا باید وارد حساب کاربری شوید ." }
        </button>

        {/* فرم پاسخ */}
        {isReplying && session?.user && (
          <div className="mt-4 pr-2 xs:pr-4 pl-2 xs:pl-4 border-blue-200 dark:border-blue-800 border-r-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="2"
              className="bg-white dark:bg-gray-700 px-4 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-800 dark:text-gray-200 text-sm"
              placeholder="پاسخ خود را بنویسید..."
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleReplySubmit}
                className="flex-1 xs:flex-none bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-white text-sm transition"
              >
                ارسال پاسخ
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="flex-1 xs:flex-none hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition"
              >
                لغو
              </button>
            </div>
          </div>
        )}

        {/* ✅ نمایش پاسخ‌ها - با کلاس‌های درست */}
        {replies && replies.length > 0 && (
          <div className="mt-6 pt-4 border-gray-200 dark:border-gray-700 border-t">
            <div className="flex items-center gap-2 mb-3">
              
            <button  onClick={() =>{setShowReplay(!showReplay)}}>
              <h5 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  {toPersianNumber(replies.length)} پاسخ
                  {showReplay ?<ExpandMoreSharpIcon/> :<KeyboardArrowLeftSharpIcon/>}
              </h5>
            </button>
            </div>


            <div  className={`${showReplay ? " block " : " hidden "} space-y-3`}>
              {replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className="bg-gray-50 dark:bg-gray-900/50 p-3 xs:p-4 border-blue-500 border-r-4 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="relative w-6 h-6">
                      <Image
                        src={reply.author?.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                        alt={reply.author?.name || 'کاربر'}
                        fill
                        sizes="24px"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 text-xs xs:text-sm">
                      {reply.author?.name || 'کاربر'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="pr-2 text-gray-600 dark:text-gray-300 text-xs xs:text-sm">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}