import { auth } from "../../../auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// تایپ برای آیتم سبد خرید
interface CartItem {
  id: number;
  userId: string;
  packageId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  package: {
    id: number;
    slugId: string;
    title: string;
    price: string;
    description: string;
    image: string;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

// تایپ برای پاسخ GET
interface CartResponse {
  items: CartItem[];
  total: number;
}

// تایپ برای خطا
interface ErrorResponse {
  error: string;
}

// تایپ برای درخواست POST
interface AddToCartRequest {
  packageId: number;
  quantity?: number;
}

// تایپ برای درخواست PUT
interface UpdateCartRequest {
  cartId: number;
  quantity: number;
}

// GET: دریافت سبد خرید کاربر
export async function GET(
  request: NextRequest
): Promise<NextResponse<CartResponse | ErrorResponse>> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفا وارد شوید" }, 
        { status: 401 }
      );
    }

    const cartItems = await prisma.cart.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        package: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // محاسبه مجموع قیمت
    const total = cartItems.reduce((sum: number, item) => {
        // حذف تمام کاراکترهای غیرعددی به جز اعداد
  const priceString = item.package.price || '0';
  
  // حذف "از" و "تومان" و هر چی غیر از عدد
  const numericString = priceString.replace(/[^\d]/g, '');
  
  // تبدیل به عدد
  const price = parseInt(numericString) || 0;
      return sum + (price * item.quantity);
    }, 0);

    return NextResponse.json({ items: cartItems, total });
    
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سبد خرید" }, 
      { status: 500 }
    );
  }
}

// POST: افزودن به سبد خرید
export async function POST(
  request: NextRequest
): Promise<NextResponse<{ item: CartItem; added: boolean } | ErrorResponse>> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفا وارد شوید" }, 
        { status: 401 }
      );
    }

    const body = await request.json() as AddToCartRequest;
    let  { packageId, quantity = 1 } = body;
    packageId = Number(packageId);
    // بررسی وجود پکیج
    const packageItem = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!packageItem) {
      return NextResponse.json(
        { error: "پکیج یافت نشد" }, 
        { status: 404 }
      );
    }

    // بررسی وجود در سبد خرید
    const existing = await prisma.cart.findUnique({
      where: {
        userId_packageId: {
          userId: session.user.id,
          packageId: packageId
        }
      }
    });

    if (existing) {
      // اگه وجود داشت، تعداد رو افزایش بده
      const updated = await prisma.cart.update({
        where: {
          userId_packageId: {
            userId: session.user.id,
            packageId: packageId
          }
        },
        data: {
          quantity: existing.quantity + quantity
        },
        include: {
          package: true
        }
      });
      return NextResponse.json({ item: updated, added: true });
    } else {
      // اگه وجود نداشت، اضافه کن
      const newItem = await prisma.cart.create({
        data: {
          userId: session.user.id,
          packageId: packageId,
          quantity: quantity
        },
        include: {
          package: true
        }
      });
      return NextResponse.json({ item: newItem, added: true });
    }
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "خطا در افزودن به سبد خرید" }, 
      { status: 500 }
    );
  }
}

// DELETE: حذف از سبد خرید
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفا وارد شوید" }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const cartIdParam = searchParams.get('cartId');
    
    if (!cartIdParam) {
      return NextResponse.json(
        { error: "شناسه سبد خرید یافت نشد" }, 
        { status: 400 }
      );
    }
    
    const cartId = parseInt(cartIdParam);

    await prisma.cart.delete({
      where: {
        id: cartId
      }
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "خطا در حذف از سبد خرید" }, 
      { status: 500 }
    );
  }
}

// PUT: بروزرسانی تعداد
export async function PUT(
  request: NextRequest
): Promise<NextResponse<{ item: CartItem; deleted?: boolean } | ErrorResponse>> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفا وارد شوید" }, 
        { status: 401 }
      );
    }

    const body = await request.json() as UpdateCartRequest;
    const { cartId, quantity } = body;

    if (quantity <= 0) {
      // اگه تعداد صفر یا منفی بود، حذفش کن
      await prisma.cart.delete({
        where: { id: cartId }
      });
      return NextResponse.json({ item: {} as CartItem, deleted: true });
    }

    const updated = await prisma.cart.update({
      where: { id: cartId },
      data: { quantity },
      include: { package: true }
    });

    return NextResponse.json({ item: updated });
    
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی سبد خرید" }, 
      { status: 500 }
    );
  }
}