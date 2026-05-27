// app/sitemap.js
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';

const BASE_URL = "https://faraede.vercel.app";

// یه تابع کوچیک برای تشخیص تاریخ معتبر (بزرگتر از سال ۲۰۰۰)
function getValidDate(updatedAt, createdAt) {
  const minValidYear = 2000;

  if (updatedAt && updatedAt instanceof Date && updatedAt.getFullYear() > minValidYear) {
    return updatedAt;
  }
  if (createdAt && createdAt instanceof Date && createdAt.getFullYear() > minValidYear) {
    return createdAt;
  }
  return new Date();
}

export default async function sitemap() {
  let prisma;
  
  try {
    // ایجاد اتصال دیتابیس
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });

    // گرفتن همه پکیج‌ها
    const packages = await prisma.package.findMany({
      select: {
        slugId: true,
        updatedAt: true,
        createdAt: true
      }
    });

    console.log("تعداد پکیج‌های پیدا شده برای sitemap:", packages.length);

    // ساخت URL برای هر پکیج
    const packageUrls = packages.map((pkg) => ({
      url: `${BASE_URL}/packages/${pkg.slugId}`,
      lastModified: getValidDate(pkg.updatedAt, pkg.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // برگردوندن همه URLها
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...packageUrls,
    ];
    
  } catch (error) {
    console.error("خطا در ساخت sitemap:", error);
    // اگه خطا داشت، فقط صفحه اصلی رو برگردون
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}