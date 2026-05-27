import { NextRequest, NextResponse } from 'next/server';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { auth } from '../../../../auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 🗑️ DELETE - حذف کامنت
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. چک کردن احراز هویت
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفاً ابتدا وارد حساب کاربری شوید' },
        { status: 401 }
      );
    }

    // 2. گرفتن آیدی کامنت
    const { id } = await params;
    const commentId = parseInt(id);
    
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'شناسه کامنت نامعتبر است' },
        { status: 400 }
      );
    }


    // 3. چک کردن وجود کامنت و مالکیت
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: session.user.id
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'کامنت پیدا نشد یا شما اجازه حذف آن را ندارید' },
        { status: 404 }
      );
    }

    // 4. حذف کامنت (ریپلای‌ها خودکار حذف میشن چون onDelete: Cascade)
    await prisma.comment.delete({
      where: { id: commentId }
    });

    console.log('✅ Comment deleted successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'کامنت با موفقیت حذف شد' 
    });
    
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    return NextResponse.json(
      { error: 'خطا در حذف کامنت' },
      { status: 500 }
    );
  }
}

// ✏️ PATCH - ویرایش کامنت
export async function PATCH(
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

    const { id } = await params;
    const commentId = parseInt(id);
    const { content } = await req.json();

    // چک کردن وجود کامنت و مالکیت
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: session.user.id
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'کامنت پیدا نشد' },
        { status: 404 }
      );
    }

    // فقط کامنت‌های در انتظار تایید قابل ویرایش هستند
    if (comment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'فقط کامنت‌های در انتظار تایید قابل ویرایش هستند' },
        { status: 400 }
      );
    }

    // ویرایش کامنت
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      comment: updatedComment 
    });
    
  } catch (error) {
    console.error('❌ Error updating comment:', error);
    return NextResponse.json(
      { error: 'خطا در ویرایش کامنت' },
      { status: 500 }
    );
  }
}