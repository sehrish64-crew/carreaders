'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/analysis', label: 'Health Analysis' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 shadow-xl"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 flex items-center justify-center shadow-[0_18px_90px_rgba(29,161,255,0.25)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-100 leading-tight">Car Readers</span>
              <span className="text-[10px] text-cyan-300 font-medium tracking-wider uppercase">Smart AI Inspection</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-cyan-300 bg-slate-900/70'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/analysis"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 text-slate-950 transition-all shadow-[0_18px_70px_rgba(29,161,255,0.22)] hover:bg-cyan-400"
            >
              Start Analysis
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/70"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 border-t border-slate-800"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'text-cyan-300 bg-slate-900/70'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/analysis"
                onClick={() => setMobileOpen(false)}
                className="block px-5 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-cyan-500 text-slate-950 text-center shadow-[0_16px_50px_rgba(29,161,255,0.2)] hover:bg-cyan-400"
              >
                Start Analysis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
