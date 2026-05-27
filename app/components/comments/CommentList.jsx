// components/comments/CommentList.jsx
'use client';

import CommentItem from './CommentItem';
import CommentSkeleton from './CommentSkeleton';

export default function CommentList({ 
  comments,
  displayedComments,
  onLike,
  onReply,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  isLoading,
  hasMore,
  fetchComments,
  currentPage
}) {
  

  
  // ✅ فیلتر کردن ریپلای‌ها برای هر کامنت
  const mainComments = displayedComments.filter(c => !c.parentId) || [];
  

  console.log('📋 Main comments:', mainComments.length);
  if (mainComments.length === 0 && !isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
          <p className="font-medium text-gray-600 dark:text-gray-400">
            هنوز نظری ثبت نشده است
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 xs:space-y-6">
      {mainComments.map((comment) => {
        // ✅ پیدا کردن ریپلای‌های این کامنت
        const commentReplies = comments.filter(c => c?.parentId === comment?.id) || [];
        const isReplying = replyingTo === comment.id;

                console.log(`🎯 Comment ${comment.id}: ${commentReplies.length} replies`);
        console.log('🎯 Replies data:', commentReplies);
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={comment.replies || []}  
            onLike={onLike}
            onReply={onReply}
            isReplying={isReplying}
            setReplyingTo={setReplyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
          />
        );
      })}

      {isLoading && <CommentSkeleton />}
      
      {!isLoading && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchComments(currentPage)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white"
          >
            بارگذاری نظرات بیشتر
          </button>
        </div>
      )}
    </div>
  );
}