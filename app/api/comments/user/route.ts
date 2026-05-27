import { NextResponse } from 'next/server';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { auth } from '../../../../auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ comments: [] }, { status: 200 });
    }

    // 📥 گرفتن همه نظرات کاربر (هم کامنت‌های اصلی هم ریپلای‌ها)
    const comments = await prisma.comment.findMany({
      where: {
        authorId: session.user.id
      },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slugId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ comments:comments ||[] });
    
  } catch (error) {
    console.error('Error fetching user comments:', error);
    // ✅ همیشه JSON برگردون
    return NextResponse.json({ comments: [] }, { status: 200 });
  }
}