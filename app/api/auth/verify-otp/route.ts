import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpForEmail } from '../../../../lib/otpStore';

function validateEmail(email: unknown) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

function validateOtp(otp: unknown) {
  return typeof otp === 'string' && /^\d{6}$/.test(otp.trim());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;
    const otp = body?.otp;

    if (!validateEmail(email) || !validateOtp(otp)) {
      return NextResponse.json({ success: false, message: 'Invalid email or OTP.' }, { status: 400 });
    }

    const result = verifyOtpForEmail(email, otp);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('verify-otp error', error);
    return NextResponse.json({ success: false, message: 'OTP verification failed.' }, { status: 500 });
  }
}
