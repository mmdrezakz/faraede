// app/api/packages/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// ساده‌ترش کن - بدون adapter-pg

// ایجاد Prisma Client با adapter



export async function GET() {
  // console.log('API Route called');
  try {
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
    
    // ایجاد adapter
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "asc" },
        select: {
        id: true,
        slugId: true, // یا slugId
        title: true,
        price: true,
        description: true, // اگر می‌خواهید نمایش دهید
        features: true, // اگر آرایه فیچرها ذخیره می‌کنید
        createdAt: true,
      }
    });

    // console.log(`✅ API: Found ${packages.length} packages`);
    
    return NextResponse.json(packages);
    
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { 
        error: "خطا در دریافت اطلاعات",
        details: error.message 
      },
      { status: 500 }
    );
  }
}