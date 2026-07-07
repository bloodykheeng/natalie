import StarField from '@/components/StarField/StarField';
import Aurora from '@/components/Aurora/Aurora';
import Sparks from '@/components/Sparks/Sparks';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Repertoire from '@/components/Repertoire/Repertoire';
import Gallery from '@/components/Gallery/Gallery';
import Videos from '@/components/Videos/Videos';
import Dedication from '@/components/Dedication/Dedication';
import Footer from '@/components/Footer/Footer';
import MusicDock from '@/components/MusicDock/MusicDock';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

export default function Home() {
  return (
    <>
      {/* Fixed sky behind everything — plus its living inhabitants */}
      <Aurora />
      <StarField />
      <Sparks />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Repertoire />
        <Gallery />
        <Videos />
        <Dedication />
      </main>
      <Footer />
      <MusicDock />
      <ScrollToTop />
    </>
  );
}
