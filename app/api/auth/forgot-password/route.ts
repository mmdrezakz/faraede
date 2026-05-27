import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // اعتبارسنجی ساده
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'ایمیل الزامی است' },
        { status: 400 }
      )
    }

    // تولید توکن تستی
    const resetToken = crypto.randomBytes(16).toString('hex')
    
    // ساخت لینک تستی
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // نمایش در کنسول برای تست
    console.log('\n🎯 تست بازیابی رمز عبور:')
    console.log(`📧 ایمیل: ${email}`)
    console.log(`🔗 لینک: ${resetLink}`)
    console.log(`🔐 توکن: ${resetToken}`)
    console.log('⏰ می‌توانید از این لینک در مرورگر استفاده کنید\n')

    return NextResponse.json(
      { 
        message: 'درخواست بازیابی رمز عبور ثبت شد (حالت تست)',
        testMode: true,
        resetLink,
        token: resetToken,
        instructions: 'این لینک را در مرورگر باز کنید تا صفحه تغییر رمز عبور نمایش داده شود'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    )
  }
}