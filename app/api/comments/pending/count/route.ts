import { NextResponse } from 'next/server';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { auth } from '../../../../../auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    // ✅ شمارش نظرات کاربر که در انتظار تایید هستند
    const count = await prisma.comment.count({
      where: {
        authorId: session.user.id,
        status: 'PENDING',
        parentId: null // فقط کامنت‌های اصلی (نه ریپلای)
      }
    });

    return NextResponse.json({ count });
    
  } catch (error) {
    console.error('Error counting pending comments:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}