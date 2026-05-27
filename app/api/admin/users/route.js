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

    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        orders: {
          select: { id: true }
        },
        comments: {
          select: { id: true }
        },
        commentLikes: {
          select: { id: true }
        }
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'کاربر',
      email: user.email || '',
      phone: user.phone || '',
      orders: user.orders.length,
      comments: user.comments.length,
      likes: user.commentLikes.length,
      joinDate: new Date(user.createdAt).toLocaleDateString('fa-IR'),
      status: 'active',
      lastLogin: new Date(user.createdAt).toLocaleDateString('fa-IR')
    }));

    return NextResponse.json(formattedUsers);
    
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { error: "خطا در دریافت کاربران", details: error.message },
      { status: 500 }
    );
  }
}