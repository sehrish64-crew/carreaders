'use client';

import { motion } from 'framer-motion';
import { Brain, Shield, Target, Users, Globe, Cpu, ChartBar as BarChart3 } from 'lucide-react';

const VALUES = [
  { icon: Brain, title: 'AI-Led', desc: 'We rely on powerful machine learning to turn vehicle images into meaningful health insights.' },
  { icon: Shield, title: 'Reliable Results', desc: 'Our models are tuned for dependable performance and ongoing improvement.' },
  { icon: Target, title: 'Practical Guidance', desc: 'Reports focus on clear next steps rather than only raw diagnostics.' },
  { icon: Users, title: 'Built for Drivers', desc: 'Designed by vehicle experts and AI engineers who know what matters most.' },
];

const TEAM = [
  { name: 'Dr. Sarah Mitchell', role: 'Chief AI Officer', desc: 'Ex-Tesla AI researcher with over a decade in computer vision.' },
  { name: 'James Hartley', role: 'Head of Automotive', desc: 'Two decades of experience in automotive engineering and inspections.' },
  { name: 'Dr. Wei Zhang', role: 'Lead ML Engineer', desc: 'Deep learning specialist focused on image-based condition detection.' },
  { name: 'Emma Richardson', role: 'Product Director', desc: 'Former product leader for enterprise vehicle software solutions.' },
];

const METRICS = [
  { value: '50K+', label: 'Health Analyses Completed' },
  { value: '95%', label: 'Detection Accuracy' },
  { value: '2M+', label: 'Images Processed' },
  { value: '4.9/5', label: 'Customer Rating' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-slate-100">
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_20%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-slate-800 mb-6">
              <Globe className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-cyan-200 font-medium">About Car Readers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
              The Future of <span className="gradient-text">AI Vehicle Diagnostics</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Car Readers uses advanced computer vision to turn vehicle photos into fast, meaningful condition reports.
              We combine smart models with real-world automotive insight for dependable inspection results.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-24">
            {METRICS.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl glass border border-slate-800 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <div className="text-3xl font-bold text-cyan-200">{m.value}</div>
                <div className="text-sm text-slate-400 mt-1">{m.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Our <span className="gradient-text">Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl glass border border-slate-800 shadow-[0_20px_80px_rgba(0,0,0,0.45)] hover:shadow-[0_24px_90px_rgba(14,165,233,0.18)] transition-all card-shine">
                <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-400">{v.desc}</p>
              </motion.div>
            ))}
          </div>

        
        </div>
      </section>
    </div>
  );
}
