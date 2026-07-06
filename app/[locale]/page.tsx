import StarField from '@/components/StarField/StarField';
import Aurora from '@/components/Aurora/Aurora';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Repertoire from '@/components/Repertoire/Repertoire';
import Videos from '@/components/Videos/Videos';
import Dedication from '@/components/Dedication/Dedication';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      {/* Fixed night sky behind everything */}
      <Aurora />
      <StarField />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Repertoire />
        <Videos />
        <Dedication />
      </main>
      <Footer />
    </>
  );
}
