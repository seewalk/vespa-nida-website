// app/layout.js
import './globals.css';
import { Inter, Syne, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { LanguageProvider } from '../components/context/LanguageContext';
import MobileLanguageSelector from '../components/MobileLanguageSelector';
import { headers } from 'next/headers';

const geist = localFont({
  src: [
    {
      path: '../public/fonts/Geist-Regular.woff2',  // Updated path
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Medium.woff2',  // Updated path
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Bold.woff2',  // Updated path
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-geist',
})

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

// Function to detect language from hostname
function getLanguageFromHost(host) {
  if (!host) return 'lt';
  
  if (host.includes('en.vespanida.lt')) return 'en';
  if (host.includes('de.vespanida.lt')) return 'de';
  if (host.includes('pl.vespanida.lt')) return 'pl';
  return 'lt'; // default
}

// Language-specific metadata
const getMetadataByLanguage = (lang) => {
  const baseUrl = {
    'lt': 'https://vespanida.lt',
    'en': 'https://en.vespanida.lt',
    'de': 'https://de.vespanida.lt',
    'pl': 'https://pl.vespanida.lt'
  };

  const metadata = {
    lt: {
      title: 'Vespa Nida | Prabangūs Vespa motoroleriai nuomai Nidoje, Lietuvoje',
      description: 'Patirkite Nidos grožį su mūsų prabangių Vespa motorolerių nuomos paslaugomis. Tyrinėkite kuršių nerijos pakrantę stilingai su Vespa Nida.',
      locale: 'lt_LT',
      lang: 'lt'
    },
    en: {
      title: 'Vespa Nida | Luxury Vespa scooters Rental in Nida, Lithuania',
      description: 'Experience the beauty of Nida with our luxury Vespa scooter rentals. Explore the scenic coastline in style with Vespa Nida.',
      locale: 'en_GB',
      lang: 'en'
    },
    de: {
      title: 'Vespa Nida | Luxuriöse Vespa-Vermietung in Nida, Litauen',
      description: 'Erleben Sie die Schönheit von Nida mit unseren luxuriösen Vespa-Roller-Vermietungen. Erkunden Sie die malerische Küste stilvoll mit Vespa Nida.',
      locale: 'de_DE',
      lang: 'de'
    },
    pl: {
      title: 'Vespa Nida | Luksusowe wypożyczenie Vespa w Nidzie, Litwa',
      description: 'Odkryj piękno Nidy z naszymi luksusowymi wypożyczeniami skuterów Vespa. Zwiedzaj malownicze wybrzeże w stylu z Vespa Nida.',
      locale: 'pl_PL',
      lang: 'pl'
    }
  };

  return {
    ...metadata[lang],
    baseUrl: baseUrl[lang]
  };
};

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get('host') || 'vespanida.lt';
  const currentLang = getLanguageFromHost(host);
  const langMeta = getMetadataByLanguage(currentLang);

  return {
    metadataBase: new URL(langMeta.baseUrl),
    title: {
      default: langMeta.title,
      template: `%s | Vespa Nida`
    },
    description: langMeta.description,
    keywords: ['vespa rental', 'nida', 'lithuania', 'scooter rental', 'luxury travel', 'baltic coast', 'curonian spit'],
    authors: [{ name: 'Vespa Nida Team' }],
    creator: 'Vespa Nida',
    publisher: 'Vespa Nida',
    // 🛵 FAVICON CONFIGURATION
    icons: {
      icon: [
        { url: '/images/badge.jpg', sizes: '32x32', type: 'image/jpeg' },
        { url: '/images/badge.jpg', sizes: '16x16', type: 'image/jpeg' },
      ],
      shortcut: '/images/badge.jpg',
      apple: [
        { url: '/images/badge.jpg', sizes: '180x180', type: 'image/jpeg' },
      ],
    },
    alternates: {
      canonical: langMeta.baseUrl,
      languages: {
        'lt': 'https://vespanida.lt',
        'en': 'https://en.vespanida.lt',
        'de': 'https://de.vespanida.lt',
        'pl': 'https://pl.vespanida.lt',
      },
    },
    formatDetection: {
      email: false,
      telephone: false,
    },
    openGraph: {
      title: langMeta.title,
      description: langMeta.description,
      url: langMeta.baseUrl,
      siteName: 'Vespa Nida',
      locale: langMeta.locale,
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
      title: langMeta.title,
      description: langMeta.description,
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="lt" className={`${inter.variable} ${syne.variable} ${playfair.variable} ${geist.variable}`}>
      <body className="bg-[#F9F7F1] text-[#2B2B2B]">
        <LanguageProvider>
          <MobileLanguageSelector />
          <Header />
          {children}
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}