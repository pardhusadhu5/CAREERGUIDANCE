import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOtpForEmail } from '../../../../lib/otpStore';

const {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PASS,
  EMAIL_FROM,
} = process.env;

function validateEmail(email: unknown) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!EMAIL_SMTP_HOST || !EMAIL_SMTP_USER || !EMAIL_SMTP_PASS || !EMAIL_FROM) {
      return NextResponse.json(
        { error: 'Email sending is not configured. Set EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS, and EMAIL_FROM.' },
        { status: 500 }
      );
    }

    const otp = generateOtpForEmail(email);
    const transporter = nodemailer.createTransport({
      host: EMAIL_SMTP_HOST,
      port: Number(EMAIL_SMTP_PORT || 587),
      secure: EMAIL_SMTP_SECURE === 'true',
      auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Your Career Simulator OTP',
      text: `Your one-time verification code is ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your one-time verification code is <strong>${otp}</strong>.</p><p>It is valid for 5 minutes.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('send-otp error', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}
