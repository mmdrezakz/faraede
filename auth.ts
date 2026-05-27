// auth.ts (v5)
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter })

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email as string
          }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role,        // ✅ role در user وجود دارد
          createdAt: user.createdAt // ✅ createdAt در user وجود دارد
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✅ ذخیره تمام اطلاعات مورد نیاز در token
        token.id = user.id;
        token.role = user.role;        // ذخیره role
        token.createdAt = user.createdAt; // ذخیره createdAt
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        // ✅ انتقال اطلاعات از token به session
        session.user.id = token.id as string;
        session.user.role = token.role as string; // اضافه کردن role
        session.user.createdAt = token.createdAt as Date; // اضافه کردن createdAt
        
        // اگر نیاز به اطلاعات بیشتر از دیتابیس دارید
        if (token.sub) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { 
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              image: true
            }
          });
          
          if (dbUser) {
            session.user = {
              ...session.user,
              ...dbUser,
              id: dbUser.id,
              role: dbUser.role,
              createdAt: dbUser.createdAt
            };
          }
        }
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // بررسی وجود کاربر در دیتابیس
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string }
        });
        
        if (!existingUser) {
          // ایجاد کاربر جدید با role پیش‌فرض
          await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              username: user.email?.split('@')[0] as string,
              role: "USER", // role پیش‌فرض
              provider: 'google',
              image: user.image,
              createdAt: new Date()
            }
          });
        }
      }
      return true;
    }
  },
  
  pages: {
    signIn: "/login",
  },
  
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt" // استفاده از استراتژی JWT
  }
});