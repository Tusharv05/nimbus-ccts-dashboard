import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nimbus Cement | CCTS Carbon-Cost Exposure Dashboard',
  description: 'Auditable transition-risk assessment for India’s Carbon Credit Trading Scheme (FY27–FY40)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] antialiased">
        {children}
      </body>
    </html>
  );
}
