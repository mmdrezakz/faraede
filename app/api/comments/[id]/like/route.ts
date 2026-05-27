import { NextRequest, NextResponse } from 'next/server';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { auth } from '../../../../../auth';  // ✅ 1. مسیر رو اصلاح کن

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ✅ در Next.js 16، params باید await بشه - این درسته
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفاً ابتدا وارد حساب کاربری شوید' },
        { status: 401 }
      );
    }

    // ✅ 2. await params - اینم درسته
    const { id } = await params;
    
    const commentId = parseInt(id);
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'شناسه کامنت نامعتبر است' },
        { status: 400 }
      );
    }

    // ✅ 3. چک کردن لایک قبلی
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: commentId
        }
      }
    });

    if (existingLike) {
      // ✅ اگه لایک کرده بود، حذفش کن
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      });
      
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true }
      });
      
      return NextResponse.json({ 
        liked: false, 
        likes: updatedComment.likeCount || 0 
      });
      
    } else {
      // ✅ اگه لایک نکرده بود، اضافه کن
      await prisma.commentLike.create({
        data: {
          userId: session.user.id,
          commentId: commentId
        }
      });
      
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } },
        select: { likeCount: true }
      });
      
      return NextResponse.json({ 
        liked: true, 
        likes: updatedComment.likeCount || 0 
      });
    }
    
  } catch (error) {
    console.error('❌ Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}