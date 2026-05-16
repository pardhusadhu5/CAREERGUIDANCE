'use client';

import { useEffect, useState } from 'react';
import CareerSelector from '../components/CareerSelector';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('careerSimulatorVerifiedEmail');
    if (savedEmail) {
      setVerifiedEmail(savedEmail);
    }
  }, []);

  const handleVerified = (email: string) => {
    localStorage.setItem('careerSimulatorVerifiedEmail', email);
    setVerifiedEmail(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
            <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Career Decision Simulator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your future with AI-powered career insights. Explore salary projections, job demand trends, and automation risks to make informed decisions about your professional path.
          </p>
        </div>
        {!verifiedEmail ? (
          <LoginForm onVerified={handleVerified} />
        ) : (
          <>
            <div className="mb-8 rounded-3xl bg-white/80 border border-green-200 p-6 text-center shadow-lg">
              <p className="text-sm text-green-700">
                Logged in as <span className="font-semibold">{verifiedEmail}</span>. You can now use the simulator.
              </p>
            </div>
            <CareerSelector />
          </>
        )}
      </div>
    </div>
  );
}