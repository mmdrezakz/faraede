import StarIcon from '@mui/icons-material/Star';

// توابع فرمت تاریخ
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
  } catch (error) {
    return dateString;
  }
};

// تبدیل اعداد به فارسی
export const toPersianNumber = (num) => {
  if (!num && num !== 0) return '۰';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

// رندر ستاره‌ها
export const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <StarIcon 
      key={i} 
      className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      fontSize="small"
    />
  ));
};

// محاسبه آمار
export const calculateStats = (comments) => {
  const totalComments = comments.filter(c => !c.parentId).length;
  const avgRating = comments.length 
    ? (comments.reduce((acc, c) => acc + (c.rating || 0), 0) / comments.length).toFixed(1)
    : 0;
  const totalLikes = comments.reduce((acc, c) => acc + (c.likes || 0), 0);
  const totalReplies = comments.filter(c => c.parentId).length;
  return { totalComments, avgRating, totalLikes, totalReplies };
};


  // ✅ فقط یکبار تابع رو تعریف کن (اینجا)
  export const formatPrice = (price) => {
    if (price === "0"){

      
      return 'با ما تماس بگیرید '
      };
    const amount = Number(price);
    if (isNaN(amount) || amount === 0) return '۰ تومان';
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };