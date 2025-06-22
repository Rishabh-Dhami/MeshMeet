import { Roboto } from 'next/font/google';
import "./globals.css";

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
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
