import { auth } from "../../../../auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request) {
  try {
    const session = await auth();
    
    // اگه کاربر لاگین نکرده، false برگردون
    if (!session?.user?.id) {
      return Response.json({ isFavorite: false });
    }

    const { searchParams } = new URL(request.url);
    const packageId = parseInt(searchParams.get('packageId'));

    // اگه packageId نداریم، false برگردون
    if (!packageId) {
      return Response.json({ isFavorite: false });
    }

    // بررسی وجود در علاقه‌مندی‌ها
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_packageId: {
          userId: session.user.id,
          packageId: packageId
        }
      }
    });

    return Response.json({ isFavorite: !!favorite });
    
  } catch (error) {
    console.error("Error checking favorite:", error);
    return Response.json({ isFavorite: false });
  }
}