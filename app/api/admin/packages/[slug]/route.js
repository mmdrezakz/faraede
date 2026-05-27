import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;
const pool = globalForPrisma.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

// PUT - ویرایش پکیج با slug
export async function PUT(request, props) {
  try {
    const params = await props.params;
    const slugId = params.slug;
    const body = await request.json();
    
    console.log('📥 PUT request for slugId:', slugId);
    console.log('📦 body:', body);

    if (!slugId) {
      return NextResponse.json(
        { error: "slugId الزامی است" },
        { status: 400 }
      );
    }

    // اول پکیج رو پیدا کن با slugId
    const existingPackage = await prisma.package.findUnique({
      where: { slugId: slugId }
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "پکیج یافت نشد" },
        { status: 404 }
      );
    }

    // تعیین تصویر مناسب
    const newSlugId = body.slugId || slugId;
    const imagePath = body.image || imageMap[newSlugId] || imageMap[slugId] || `/package/default.png`;

    // آپدیت با استفاده از id
    const updatedPackage = await prisma.package.update({
      where: { 
        id: existingPackage.id
      },
      data: {
        slugId: newSlugId,
        title: body.title,
        price: body.price,
        description: body.description,
        image: imagePath,
        features: body.features || [],
      }
    });

    return NextResponse.json({
      id: updatedPackage.id,
      slugId: updatedPackage.slugId,
      title: updatedPackage.title,
      price: updatedPackage.price,
      description: updatedPackage.description,
      image: updatedPackage.image,
      features: updatedPackage.features,
      status: 'active',
      createdDate: new Date(updatedPackage.createdAt).toLocaleDateString('fa-IR')
    });
    
  } catch (error) {
    console.error("❌ Error updating package:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش پکیج", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - حذف پکیج با slug
export async function DELETE(request, props) {
  try {
    const params = await props.params;
    const slugId = params.slug;
    
    if (!slugId) {
      return NextResponse.json(
        { error: "slugId الزامی است" },
        { status: 400 }
      );
    }

    const existingPackage = await prisma.package.findUnique({
      where: { slugId: slugId }
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "پکیج یافت نشد" },
        { status: 404 }
      );
    }

    await prisma.package.delete({
      where: { 
        id: existingPackage.id 
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "پکیج با موفقیت حذف شد" 
    });
    
  } catch (error) {
    console.error("❌ Error deleting package:", error);
    return NextResponse.json(
      { error: "خطا در حذف پکیج", details: error.message },
      { status: 500 }
    );
  }
}