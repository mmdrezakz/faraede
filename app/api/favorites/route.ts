
import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../auth"
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });


export async function GET(request:NextRequest) {
    try {
        const session = await auth()

        if(!session?.user?.id){
            return NextResponse.json(
                {error:"لطفا اول وارد شوید."},
                {status:401}
            );
        }
        const favorites =await prisma.favorite.findMany({
            where:{
                userId:session.user.id
            },
            include:{
                package:true
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return NextResponse.json(favorites)

    } catch (error) {
        console.log("Error fetching favorites :" ,error);

        return NextResponse.json(
            {error:"خطا در دریافت علاقه مندی ها"},
            {status:500}
        );
        
    }
}

export async function POST(request:NextRequest) {
    try {
        const session = await auth()

        if(!session?.user?.id){
            return NextResponse.json(
                {error:"لطفا اول وارد شوید."},
                {status:401}
            );
        }

        const body = await request.json()
        const {packageId} = body as {packageId:number}
        const packageItem = await prisma.package.findUnique({
            where:{id:packageId}
        })
        if(!packageItem){
            return NextResponse.json(
                { error: "پکیج یافت نشد" }, 
                { status: 404 }
            );
        }

            const existing = await prisma.favorite.findUnique({
      where: {
        userId_packageId: {
          userId: session.user.id,
          packageId: packageId
        }
      }
    });
        if (existing) {
      await prisma.favorite.delete({
        where: {
          userId_packageId: {
            userId: session.user.id,
            packageId: packageId
          }
        }
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          packageId: packageId
        }
      });
      return NextResponse.json({ liked: true });
    }
    } catch (error) {
            console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "خطا در افزودن به علاقه‌مندی‌ها" }, 
      { status: 500 }
    );
    }
}