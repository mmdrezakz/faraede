import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const count = await prisma.user.count();
    return Response.json({ count });
  } catch (error) {
    console.error("Error fetching users count:", error);
    return Response.json({ count: 0 });
  }
}