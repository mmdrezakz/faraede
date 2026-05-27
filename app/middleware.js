// middleware.ts
import { NextResponse } from 'next/server'

import { auth } from '../auth'

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  

  // اگر می‌خواهید مطمئن شوید اجرا می‌شود
  if (pathname === '/user-dashboard') {
    console.log('✅ Middleware is working for /user-dashboard')
    
    const session = await auth()
    console.log('Session user:', session?.user?.email || 'No user')
    
    if (!session?.user) {
      console.log('❌ Redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}


export const config = {
  matcher: ['/user-dashboard', '/admin-dashboard']
}