import { Cormorant_Garamond, EB_Garamond, Great_Vibes } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Locale } from "@/i18n/routing";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap"
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "cyrillic"],
  display: "swap"
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"], // Latin-only script font — used for the "Northern Sky" wordmark
  weight: "400",
  display: "swap"
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${cormorant.variable} ${garamond.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <head>
        {/* Apply the stored theme before first paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();`
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-midnight-900 text-parchment">
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <ThemeProvider>{children}</ThemeProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
