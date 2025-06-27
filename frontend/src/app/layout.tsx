import { Roboto } from 'next/font/google';
import "./globals.css";
import Navbar from '@/components/Navbar';

// Initialize Roboto font
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
  variable: '--font-roboto',     
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      <body
        className={`${roboto.variable} antialiased bg-gradient-to-br from-[#1f1f1f] via-[#4b6cb7] to-[#000000]`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
