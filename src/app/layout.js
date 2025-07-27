// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers'; // Optional - wrap Jotai/Query here
import '../styles/globals.css'; // Make sure path is correct

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Issues Tracker',
  description: 'Track and manage issues easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
