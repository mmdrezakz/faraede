import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg'
import { NextResponse } from 'next/server';



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


export async  function GET() {
    try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
            role: true,
            phone: true
          }
        },
        package: {
          select: {
            title: true,
            slugId: true,
            price: true
          }
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                name: true
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                email: true,
                image: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        likes: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    const stats = {
      total: comments.length,
      pending: comments.filter(c => c.status === 'PENDING').length,
      published: comments.filter(c => c.status === 'PUBLISHED').length,
      hidden: comments.filter(c => c.status === 'HIDDEN').length,
      replies: comments.filter(c => c.parentId).length,
      avgRating: comments.length > 0
        ? (comments.reduce((acc, c) => acc + (c.rating || 0), 0) / comments.length).toFixed(1)
        : 0
    };



    return NextResponse.json({
      comments,
      stats
    });


    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }finally {
    await prisma.$disconnect();
  }
}


// ✅ PUT - به‌روزرسانی وضعیت کامنت
export async function PUT(request) {
  try {

      
      const { commentId, status } = await request.json();
      
      const comment = await prisma.comment.update({
          where: { id: commentId },
          data: { status }
        });
        
        return NextResponse.json({ success: true, comment });
    
    } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'خطا در تغییر وضعیت' },
      { status: 500 }
    );
  }
}

// ✅ DELETE - حذف کامنت
export async function DELETE(request) {
  try {
      
    const { searchParams } = new URL(request.url);
    const commentId = parseInt(searchParams.get('id'));
    
    await prisma.comment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'خطا در حذف کامنت' },
      { status: 500 }
    );
  }
}
