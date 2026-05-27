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

    
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        package: { select: { title: true } }
      },
      take: 50 // محدودیت برای جلوگیری از سنگینی
    });

    const formattedOrders = orders.map(order => {
      // استخراج عدد از amount
      let amount = 0;
      if (order.amount) {
        const numericAmount = order.amount.replace(/[^\d]/g, '');
        amount = numericAmount ? parseInt(numericAmount) : 0;
      }

      return {
        id: order.id,
        user: order.user?.name || 'کاربر',
        email: order.user?.email || '',
        package: order.package?.title || 'پکیج',
        amount: amount,
        date: new Date(order.createdAt).toLocaleDateString('fa-IR'),
        status: order.status,
        paymentMethod: order.paymentMethod || 'آنلاین'
      };
    });


    return NextResponse.json(formattedOrders);
    
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سفارشات", details: error.message },
      { status: 500 }
    );
  }
}