'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 flex items-center justify-center shadow-[0_18px_90px_rgba(29,161,255,0.25)]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-100 leading-tight">Car Readers</span>
                <span className="text-[10px] text-cyan-300 font-medium tracking-wider uppercase">Smart AI Inspection</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-4">
              AI-driven vehicle condition analysis with fast reports, advanced damage detection, and premium insights.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/analysis', label: 'Vehicle Health Analysis' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-4">AI Reports</h3>
            <ul className="space-y-2.5">
              {['Basic Health Scan', 'Advanced Condition Report', 'Complete Inspection Summary', 'Enterprise Solutions'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-cyan-300" />
                support@carreaders.ai
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-cyan-300" />
                +44 20 1234 5678
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-300 mt-0.5" />
                 NA, 286 Nakhlath, Haji Malak Goth Gadap Town, Karachi
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 Car Readers. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-cyan-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cyan-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-cyan-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
