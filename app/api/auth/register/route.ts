import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
import { PrismaPg } from '@prisma/adapter-pg'


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter })

export async function POST(request:Request){
    try{
        const {name, username,email,password,createdAt,role} = await request.json()
        // 1. چک کردن تکراری نبودن ایمیل و نام کاربری
        const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })
    if (existingUser) {
  return Response.json(
    { error: 'کاربر با این ایمیل یا نام کاربری از قبل وجود دارد' },
    { status: 400 }
  )
}
  // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 12)
    //ایجاد کاربر 
    const now = new Date()
    const user = await prisma.user.create({
        data:{
            name,
            username,
            email,
            role :"USER",
            password:hashedPassword,
            createdAt:now,
            provider:'credentials',
            
        }
    })
    // حذف پسورد از response
    const { password: _, ...userWithoutPassword } = user
    
    return Response.json({
      success: true,
      message: 'ثبت‌نام موفقیت‌آمیز بود',
      user: userWithoutPassword
    }, { status: 201 })


    }catch(error:any){
        console.error('Registration error:', error)
        return Response.json(
            {error: 'error in server'},
            {status:500}
        )
    }
    
}