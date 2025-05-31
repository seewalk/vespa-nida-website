import './globals.css';
import { Inter, Syne, Playfair_Display } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata = {
  metadataBase: new URL('https://vespanida.com'),
  title: {
    default: 'Vespa Nida | Luxury Vespa Rentals in Nida, Lithuania',
    template: '%s | Vespa Nida'
  },
  description: 'Experience the beauty of Nida with our luxury Vespa scooter rentals. Explore the scenic coastline in style with Vespa Nida.',
  keywords: ['vespa rental', 'nida', 'lithuania', 'scooter rental', 'luxury travel', 'baltic coast', 'curonian spit'],
  authors: [{ name: 'Vespa Nida Team' }],
  creator: 'Vespa Nida',
  publisher: 'Vespa Nida',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: 'Vespa Nida | Luxury Vespa Rentals in Nida, Lithuania',
    description: 'Experience the beauty of Nida with our luxury Vespa scooter rentals. Explore the scenic coastline in style with Vespa Nida.',
    url: 'https://vespanida.com',
    siteName: 'Vespa Nida',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vespa Nida - Luxury Scooter Rentals',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vespa Nida | Luxury Vespa Rentals',
    description: 'Experience the beauty of Nida with our luxury Vespa scooter rentals.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${playfair.variable}`}>
      <body className="bg-[#F9F7F1] text-[#2B2B2B]">
        <Header />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}