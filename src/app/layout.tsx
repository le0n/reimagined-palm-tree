// src/app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';

import '../styles/globals.css';
import { Navbar } from '../components/Navbar';

const DEFAULT_THEME = 'datedash';
const THEME_STORAGE_KEY = 'datedash-theme';

const themeInitScript = `(() => {
  try {
    const storedTheme = window.localStorage.getItem('${THEME_STORAGE_KEY}');
    const theme = storedTheme === 'dark' || storedTheme === 'datedash' ? storedTheme : '${DEFAULT_THEME}';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    document.documentElement.setAttribute('data-theme', '${DEFAULT_THEME}');
    document.documentElement.style.colorScheme = 'light';
  }
})();`;

export const metadata: Metadata = {
  title: {
    default: 'DateDash',
    template: '%s · DateDash'
  },
  description:
    'DateDash makes date night decisions easy with playful filters, smart suggestions, and a map-first experience.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-content"
          >
            Skip to main content
          </a>
          <header>
            <Navbar />
          </header>
          <main id="main-content" className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <footer className="border-t border-base-200 bg-base-100 py-6 text-sm text-base-content/70">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <p>&copy; {new Date().getFullYear()} DateDash. Crafted for spontaneous adventures.</p>
              <p className="flex items-center gap-1">
                <span aria-hidden="true">💫</span>
                <span>Feeling indecisive? Let us spin the date wheel.</span>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
