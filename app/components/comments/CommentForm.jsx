'use client';

import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';
import { Alert, Snackbar } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CommentForm({ onSubmit, isSubmitting,snackbar,handleCloseSnackbar }) {
  const {data:session} = useSession()
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);


console.log("ssssss",session);



  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmit({ content: newComment, rating });
    setNewComment('');
    setRating(5);
  };
  if(session?.user){

    return (
      <div className="bg-white dark:bg-gray-800 shadow-md mb-8 p-6 rounded-xl">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-200 text-lg">
          نظر خود را بنویسید
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mx-auto my-auto h-full text-center">
            <label className="block mb-2 w-full font-medium text-gray-700 dark:text-gray-300 text-lg text-center">
              امتیاز شما
            </label>
            <div className="flex justify-center items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl hover:scale-110 transition"
                >
                  <StarIcon 
                    fontSize='large' 
                    className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <span className='flex justify-center items-center gap-2 bg-gray-500 mx-auto mt-6 px-2 py-0.5 rounded-2xl md:w-1/2 text-gray-200 text-xs text-center'>
            <WarningIcon fontSize='small' sx={{color:"yellowgreen"}}/> 
            نظر شما پس از تایید تیم پشتیبانی قابل مشاهده خواهد شد
          </span>
          
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              className="bg-white dark:bg-gray-700 px-4 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-800 dark:text-gray-200"
              placeholder="تجربه خود از این پکیج را به اشتراک بگذارید..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-2 rounded-lg font-medium text-white transition"
          >
            {isSubmitting ? 'در حال ارسال...' : 'ارسال نظر'}
          </button>
          
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
        </form>
      </div>
    );
  }
  return(
          <div className="bg-white dark:bg-gray-800 shadow-md mb-8 p-6 rounded-xl">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col justify-center items-center gap-4 mx-auto my-auto py-4 h-full text-center">

          

          <p>برای  گذاشتن کامنت ابتدا باید وارد حساب کاربری شوید .</p>  

          <Link className='bg-blue-600 hover:bg-blue-700 px-10 py-2 rounded-lg text-white text-sm text-center transition' href={"/login"}>
          ورود
          </Link>

        </div>
        </form>
      </div>
  )
}