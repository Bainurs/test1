import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import News from '@/components/sections/News';
import Newsletter from '@/components/sections/Newsletter';
import ContactForm from '@/components/sections/ContactForm';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <News />
        <Newsletter />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
