// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar border-b border-base-200 bg-base-100/95 backdrop-blur supports-backdrop-blur:bg-base-100/80">
      <div className="navbar-start">
        <Link
          href="/"
          className="btn btn-ghost text-lg font-bold uppercase tracking-wide"
          aria-label="DateDash home"
        >
          DateDash
        </Link>
      </div>
      <div className="navbar-center hidden gap-1 md:flex">
        {navLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`btn btn-ghost btn-sm ${isActive ? 'btn-active text-primary' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="navbar-end flex items-center gap-2">
        <ThemeToggle />
        <Link href="/explore" className="btn btn-primary btn-sm" aria-label="Start exploring dates">
          Start Exploring
        </Link>
      </div>
    </nav>
  );
}
