// src/components/ThemeToggle.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type ThemeChoice = 'datedash' | 'dark';

const STORAGE_KEY = 'datedash-theme';
const DEFAULT_THEME: ThemeChoice = 'datedash';

const THEME_LABELS: Record<ThemeChoice, string> = {
  datedash: 'Sunset Glow',
  dark: 'Midnight Muse'
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
    if (storedTheme === 'datedash' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const nextTheme = useMemo<ThemeChoice>(() => (theme === 'dark' ? 'datedash' : 'dark'), [theme]);

  const handleToggle = () => {
    setTheme((current) => (current === 'dark' ? 'datedash' : 'dark'));
  };

  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle"
      onClick={handleToggle}
      aria-label={`Switch to ${THEME_LABELS[nextTheme]} theme`}
      aria-pressed={theme === 'dark'}
      title={`Current theme: ${THEME_LABELS[theme]}`}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="inline-flex h-5 w-5 items-center justify-center">
        {mounted ? (
          theme === 'dark' ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 5.25a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-1.5 0V4.5a.75.75 0 0 0 .75.75Zm6.364 1.886 1.272-1.272a.75.75 0 0 0-1.06-1.06l-1.273 1.27a.75.75 0 0 0 1.06 1.062ZM12 18.75a.75.75 0 0 0-.75.75v2.25a.75.75 0 0 0 1.5 0V19.5a.75.75 0 0 0-.75-.75Zm7.5-6.75a.75.75 0 0 0 0-1.5h-2.25a.75.75 0 0 0 0 1.5h2.25ZM6.75 12a.75.75 0 0 0-.75-.75H3.75a.75.75 0 0 0 0 1.5H6a.75.75 0 0 0 .75-.75Zm10.364 6.864 1.273 1.272a.75.75 0 0 0 1.06-1.06l-1.272-1.272a.75.75 0 0 0-1.061 1.06Zm-12.728 0-1.272 1.272a.75.75 0 0 0 1.06 1.06l1.273-1.272a.75.75 0 1 0-1.061-1.06ZM6.75 5.636 5.477 4.363a.75.75 0 1 0-1.06 1.06l1.272 1.273a.75.75 0 1 0 1.061-1.06ZM12 7.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5Zm0 7.5A3 3 0 1 1 15 12a3 3 0 0 1-3 3Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.752 15.002a.75.75 0 0 0-.835-.232 7.5 7.5 0 0 1-9.687-9.686.75.75 0 0 0-.967-.967A9 9 0 1 0 21.984 15.84a.75.75 0 0 0-.232-.838ZM12 21a7.5 7.5 0 0 1-6.712-10.871 9.002 9.002 0 0 0 10.583 10.583A7.46 7.46 0 0 1 12 21Z" />
    </svg>
  );
}
