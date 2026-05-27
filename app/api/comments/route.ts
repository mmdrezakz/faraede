import { NextRequest, NextResponse } from 'next/server';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { auth } from '../../../auth';  
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ✅ GET - دریافت کامنت‌ها (همین که داری)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const packageId = url.searchParams.get('packageId');
    
    if (!packageId) {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }

    const pkgId = parseInt(packageId);
    
    // ✅ همه کامنت‌های پکیج رو بگیر (هم اصلی هم ریپلای)
    const allComments = await prisma.comment.findMany({
      where: {
        packageId: pkgId,
        status: 'PUBLISHED'
      },
      include: {
        author: { 
          select: { 
            id: true,
            name: true, 
            image: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });



    // ✅ 2. جدا کردن کامنت‌های اصلی از ریپلای‌ها
    const mainComments = allComments.filter(c => c.parentId === null);
    const replies = allComments.filter(c => c.parentId !== null);

    // ✅ 3. چسبوندن ریپلای‌ها به کامنت‌های اصلی
    const commentsWithReplies = mainComments.map(mainComment => ({
      ...mainComment,
      replies: replies.filter(r => r.parentId === mainComment.id)
    }));



    return NextResponse.json({
      comments: commentsWithReplies,
      total: mainComments.length,
      hasMore: false
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// ✅ POST - ثبت کامنت جدید (اینو اضافه کن)
export async function POST(req: NextRequest) {

  
  try {
    // 1. چک کردن احراز هویت
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفاً ابتدا وارد حساب کاربری شوید' },
        { status: 401 }
      );
    }

    // 2. گرفتن داده از body
    const body = await req.json();
    const { content, rating, packageId, parentId } = body;

 

    // 3. اعتبارسنجی
    if (!content || !packageId) {
      return NextResponse.json(
        { error: 'متن نظر و شناسه پکیج الزامی است' },
        { status: 400 }
      );
    }

    // 4. ذخیره در دیتابیس
    const comment = await prisma.comment.create({
      data: {
        content,
        rating: rating || null,
        status: 'PENDING',  // در انتظار تایید
        authorId: session.user.id,
        packageId: parseInt(packageId),
        parentId: parentId || null
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });



    // 5. برگرداندن پاسخ
    return NextResponse.json({
      success: true,
      comment
    });

  } catch (error: any) {
    console.error('❌ Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}