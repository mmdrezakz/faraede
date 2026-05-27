import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const globalForPrisma = globalThis;
const pool = globalForPrisma.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {


    // دریافت آمار واقعی از دیتابیس
    const [
      totalUsers,        // واقعی
      totalPackages,     // واقعی
      totalComments,     // واقعی
      totalLikes,        // واقعی
    ] = await Promise.all([
      prisma.user.count(),                          // تعداد واقعی کاربران
      prisma.package.count(),                       // تعداد واقعی پکیج‌ها
      prisma.comment.count(),                        // تعداد واقعی کامنت‌ها
      prisma.commentLike.count(),                     // تعداد واقعی لایک‌ها
    ]);

    // محاسبات اضافی برای کامنت‌ها
    const [
      approvedComments,
      pendingComments,
      rejectedComments
    ] = await Promise.all([
      prisma.comment.count({ where: { status: 'PUBLISHED' } }),
      prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.comment.count({ where: { status: 'HIDDEN' } })
    ]);

    // آمار سفارشات به صورت ثابت و نمایشی
    const totalOrders = 156; // عدد نمایشی
    const totalRevenue = 45678000; // عدد نمایشی

    const stats = {
      totalUsers,           // واقعی
      totalPackages,        // واقعی
      totalComments,        // واقعی
      approvedComments,     // واقعی
      pendingComments,      // واقعی
      rejectedComments,     // واقعی
      totalOrders,          // نمایشی (ثابت)
      totalLikes,           // واقعی
      totalRevenue,         // نمایشی (ثابت)
      totalReviews: totalComments // واقعی (همون تعداد کامنت‌ها)
    };

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آمار", details: error.message },
      { status: 500 }
    );
  }
}