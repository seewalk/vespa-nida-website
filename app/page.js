import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FleetSection from '../components/FleetSection';
import ExploreSection from '../components/ExploreSection';
import ShopSection from '../components/ShopSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BookingForm from '../components/BookingForm';
import { LanguageProvider } from '@/components/context/LanguageContext';
import MobileLanguageSelector from '@/components/MobileLanguageSelector';
import FAQSection from '@/components/FAQSection';

export const metadata = {
  title: 'Vespa Nida | Luxury Vespa Rentals in Nida, Lithuania',
  description: 'Experience the beauty of Nida with our luxury Vespa scooter rentals. Explore the scenic coastline in style with Vespa Nida.',
}

export default function Home() {
  return (
    <main>
      <LanguageProvider>
       <MobileLanguageSelector />
       <HeroSection />
       <BookingForm />
       <AboutSection />
       <FleetSection />
       <ExploreSection />
       <ShopSection />
       <TestimonialsSection />
       <FAQSection />
       <BookingForm />
      </LanguageProvider>
    </main>
  );
}