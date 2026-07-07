import { readdir } from 'fs/promises';
import path from 'path';
import { useTranslations } from 'next-intl';
import Ornament from '@/components/Ornament/Ornament';
import Reveal from '@/components/Reveal/Reveal';
import GalleryFlipWall from './GalleryFlipWall';

const GALLERY_DIR = path.join(process.cwd(), 'public', 'images', 'gallery');
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

/** Drop any photo into public/images/gallery/ and it appears in the slider. */
async function listGalleryImages(): Promise<string[]> {
  try {
    const files = await readdir(GALLERY_DIR);
    return files
      .filter((f) => IMAGE_EXT.test(f))
      .sort()
      .map((f) => `/images/gallery/${f}`);
  } catch {
    return [];
  }
}

function GalleryHeading() {
  const t = useTranslations('gallery');
  return (
    <Reveal className="text-center">
      <p className="font-display text-sm font-semibold tracking-[0.35em] text-aurora-teal uppercase">
        {t('kicker')}
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold text-gold-gradient sm:text-5xl">
        {t('heading')}
      </h2>
      <Ornament className="my-8" />
      <p className="mx-auto max-w-2xl text-lg text-parchment-dim">
        {t('intro')}
      </p>
    </Reveal>
  );
}

export default async function Gallery() {
  const images = await listGalleryImages();
  if (images.length === 0) return null;

  return (
    <section
      id="gallery"
      className="relative z-10 scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <GalleryHeading />
        <Reveal delay={100} className="mt-12">
          <GalleryFlipWall images={images} />
        </Reveal>
      </div>
    </section>
  );
}
