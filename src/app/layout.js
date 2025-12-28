import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });
const env = process.env;

// --- KONFIGURASI SEO GLOBAL ---
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), // Ganti dengan domain aslimu nanti (misal: https://komikcast.com)
  title: {
    default: `${process.env.SITE_NAME || 'Doujindesu'}`,
    template: `%s | ${process.env.SITE_NAME || 'Doujindesu'}`,
  },
  description: 'Baca Manga, Manhwa, dan Manhua Bahasa Indonesia terlengkap dan terupdate. Gratis dan tanpa iklan yang mengganggu.',
  keywords: ['baca komik', 'manga indonesia', 'manhwa sub indo', 'komikcast', 'komik gratis'],
  openGraph: {
    title: `${process.env.SITE_NAME || 'Doujindesu'} - Baca Komik Bahasa Indonesia`,
    description: 'Baca Manga, Manhwa, dan Manhua Bahasa Indonesia terlengkap.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    siteName: `${process.env.SITE_NAME || 'Doujindesu'}`,
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-dark text-white flex flex-col min-h-screen`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}