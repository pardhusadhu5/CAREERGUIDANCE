'use client';

import { FormEvent, useState } from 'react';

interface LoginFormProps {
  onVerified: (email: string) => void;
}

export default function LoginForm({ onVerified }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter-email' | 'verify-otp'>('enter-email');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result?.error || 'Unable to send OTP.');
        return;
      }

      setTargetEmail(email.trim());
      setStep('verify-otp');
      setStatus('OTP sent. Please check your Gmail inbox and enter the code here.');
    } catch (err) {
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail || email, otp }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result?.message || 'OTP verification failed.');
        return;
      }

      onVerified(targetEmail || email.trim());
    } catch (err) {
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Secure Email Login</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email and verify with the OTP sent to your Gmail address. This must complete before you can use the career simulator.
      </p>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">{error}</div>}
      {status && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3">{status}</div>}

      {step === 'enter-email' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Gmail Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full inline-flex justify-center items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
              placeholder="6-digit code"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !otp}
            className="w-full inline-flex justify-center items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('enter-email');
              setStatus(null);
              setError(null);
            }}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            Change email address
          </button>
        </form>
      )}
    </div>
  );
}
