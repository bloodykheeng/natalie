import { useTranslations } from 'next-intl';

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@Northern_skyy',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/_northern__sky_',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2a3.9 3.9 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1Zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.5.2-1.8.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.3.7-.3 1.8-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.5.3 1.8.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.7.3 1.8.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.5-.2 1.8-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.3-.7.3-1.8.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.5-.3-1.8a2 2 0 0 0-.7-1.1 2 2 0 0 0-1.1-.7c-.3-.1-.7-.3-1.8-.3-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a5.1 5.1 0 1 1 0 10.3 5.1 5.1 0 0 1 0-10.3Zm0 8.4a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
      </svg>
    )
  }
] as const;

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative z-10 border-t border-gold-500/15 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="font-script text-3xl text-gold-gradient">Northern Sky</p>

        <div className="flex items-center gap-4">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gold-500/30 text-gold-400 transition-all duration-200 hover:border-gold-400 hover:text-gold-300 hover:shadow-[0_0_18px_rgba(212,175,55,0.25)]"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <p className="text-sm text-parchment-dim">
          © {new Date().getFullYear()} Northern Sky · {t('tagline')}
        </p>
      </div>
    </footer>
  );
}
