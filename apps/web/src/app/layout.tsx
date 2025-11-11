import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dollar City - Recruitment System',
  description: 'Intelligent candidate screening for Dollar City retail operations'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 text-center text-xs text-gray-500">
          AI-assisted insights — human review required
        </footer>
      </body>
    </html>
  );
}
