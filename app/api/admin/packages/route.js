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

    
    const packages = await prisma.package.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        slugId: true,
        title: true,
        price: true,
        description: true,
        image: true,
        features: true,
        createdAt: true,
      }
    });



    // مپ slug به تصویر
    const imageMap = {
      'student': '/package/s1.png',
      'resume': '/package/s2.png',
      'landing': '/package/s3.png',
      'base': '/package/s4.png',
      'pro': '/package/s5.png',
      'proplus': '/package/s6.png',
      'shop': '/package/s7.png',
      'enterprise': '/package/s8.png',
    };

    const formattedPackages = packages.map(pkg => {
      let createdDate = 'تاریخ نامشخص';
      if (pkg.createdAt && pkg.createdAt.getFullYear() > 1970) {
        createdDate = new Date(pkg.createdAt).toLocaleDateString('fa-IR');
      }

      return {
        id: pkg.id,
        slugId: pkg.slugId,
        title: pkg.title,
        price: pkg.price,
        description: pkg.description,
        image: pkg.image || imageMap[pkg.slugId] || '',
        features: pkg.features || [],
        status: 'active',
        createdDate: createdDate
      };
    });

    return NextResponse.json(formattedPackages);
    
  } catch (error) {
    console.error("❌ Error fetching packages:", error);
    return NextResponse.json(
      { error: "خطا در دریافت پکیج‌ها", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();


    if (!body.slugId || !body.title || !body.price) {
      return NextResponse.json(
        { error: "فیلدهای اجباری را پر کنید" },
        { status: 400 }
      );
    }

    // چک کردن تکراری نبودن slugId
    const existingPackage = await prisma.package.findUnique({
      where: { slugId: body.slugId }
    });

    if (existingPackage) {
      return NextResponse.json(
        { error: "این slug قبلاً استفاده شده است" },
        { status: 400 }
      );
    }

    const newPackage = await prisma.package.create({
      data: {
        slugId: body.slugId,
        title: body.title,
        price: body.price,
        description: body.description || '',
        image: body.image || `/package/${body.slugId}.png`,
        features: body.features || [],
      }
    });



    return NextResponse.json({
      id: newPackage.id,
      slugId: newPackage.slugId,
      title: newPackage.title,
      price: newPackage.price,
      description: newPackage.description,
      image: newPackage.image,
      features: newPackage.features,
      status: 'active',
      createdDate: new Date(newPackage.createdAt).toLocaleDateString('fa-IR')
    });
    
  } catch (error) {
    console.error("❌ Error creating package:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد پکیج", details: error.message },
      { status: 500 }
    );
  }
}