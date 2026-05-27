'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { renderStars, calculateStats, toPersianNumber } from './comments/utils';
import CommentForm from './comments/CommentForm';
import CommentList from './comments/CommentList';
import CommentStats from './comments/CommentStats';

const COMMENTS_PER_PAGE = 3;

export default function CommentSection({ packageId: propPackageId }) {
  const params = useParams();
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const packageId = propPackageId;

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


const fetchComments = useCallback(async (pageNum = 1) => {
  if (!packageId) return;
  setIsLoading(true);
  try {
    const res = await fetch(`/api/comments?packageId=${packageId}&page=${pageNum}&limit=${COMMENTS_PER_PAGE}`);
    const data = await res.json();
    

    
    // ✅ ساختار درست: هر کامنت باید replies داشته باشه
    const commentsWithReplies = data.comments || [];
    
  
    
    if (pageNum === 1) {
      setComments(commentsWithReplies);
      setDisplayedComments(commentsWithReplies);
    } else {
      setComments(prev => [...prev, ...commentsWithReplies]);
      setDisplayedComments(prev => [...prev, ...commentsWithReplies]);
    }
    
    setHasMore(data.hasMore || false);
    setCurrentPage(pageNum + 1);
  } catch (error) {
    console.error('Error fetching comments:', error);
  } finally {
    setIsLoading(false);
  }
}, [packageId]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleSubmitComment = async ({ content, rating }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, rating, packageId })
      });
      if (res.ok) {
        fetchComments(1);
        showSnackbar('نظر شما  ثبت شد و پس از تایید نمایش داده می‌شود');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId, text) => {

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, packageId, parentId: commentId })
    });
    if (res.ok) {
      setReplyingTo(null);
      setReplyText('');
      fetchComments(1);
    }
  };

  const handleLike = async (commentId) => {
    const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();

      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes: data.likes } : c
      ));
      setDisplayedComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes: data.likes } : c
      ));
    }
  };

  const stats = calculateStats(comments);

  return (
    <div className='mx-auto px-3 xs:px-4 py-6 xs:py-8 border-t-2 max-w-[95%] sm:max-w-[90%] md:max-w-2xl'>
      {/* هدر */}
      <div className="mb-6 xs:mb-8">
        <h2 className="mb-2 font-bold text-gray-200 text-xl xs:text-2xl">نظرات کاربران</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base">
          تجربیات دیگران را بخوانید و نظر خود را به اشتراک بگذارید
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
          <div className="flex">{renderStars(Math.round(stats.avgRating))}</div>
          <span className="font-medium text-sm xs:text-base">{stats.avgRating} از ۵</span>
          <span className="text-sm xs:text-base">({toPersianNumber(stats.totalComments)} نظر)</span>
        </div>
      </div>

      {/* فرم */}
      <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar}/>

      {/* لیست کامنت‌ها */}
      <CommentList
        comments={comments}
        displayedComments={displayedComments}
        onLike={handleLike}
        onReply={handleSubmitReply}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        replyText={replyText}
        setReplyText={setReplyText}
        isLoading={isLoading}
        hasMore={hasMore}
        fetchComments={fetchComments}
        currentPage={currentPage}
      />

      {/* آمار */}
      {displayedComments.length > 0 && <CommentStats stats={stats} />}
    </div>
  );
}