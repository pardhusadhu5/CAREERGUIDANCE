import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Decision Simulator - AI-Powered Career Planning",
  description: "Explore career paths with AI predictions on salary growth, job demand, and automation risks. Compare careers, visualize projections, and make informed decisions.",
  keywords: "career simulator, AI career planning, salary prediction, job market analysis, career comparison",
  openGraph: {
    title: "Career Decision Simulator",
    description: "AI-powered career planning tool with salary projections and market insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4">Empower your career decisions with data-driven insights</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-indigo-400 transition-colors">About</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Methodology</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
            </div>
            <p className="mt-4 text-sm text-gray-400">© 2026 Career Decision Simulator. Built for the future of work.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}