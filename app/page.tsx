'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Scan, FileText, Wrench, TrendingUp, Upload, Cpu, Eye, Lock, ArrowRight, Car, Activity, ChartBar as BarChart3, Brain, ShieldCheck, Users, ThumbsUp, Clock, CircleCheck as CheckCircle2, Zap } from 'lucide-react';

const FEATURES = [
  { icon: Scan, title: 'Intelligent Issue Recognition', desc: 'Our advanced system examines vehicle photos to identify surface defects, structural damage, corrosion, and mechanical complications with remarkable accuracy.' },
  { icon: BarChart3, title: 'Comprehensive Health Rating', desc: 'Receive a numerical evaluation from 0-100 that instantly conveys the overall condition status of your automobile.' },
  { icon: FileText, title: 'In-Depth Assessment Documentation', desc: 'Produce a thorough professional analysis powered by cutting-edge AI with step-by-step insights, priority classifications, and actionable recommendations.' },
  { icon: Activity, title: 'Real-Time Inspection Overview', desc: 'Watch as our system processes each photo in real-time, pinpointing and visualizing all identified concerns as they occur.' },
  { icon: Wrench, title: 'Cost Projection Information', desc: 'Obtain professional estimates for repairs based on the identified issues and present vehicle state.' },
  { icon: TrendingUp, title: 'Predictive Maintenance Alerts', desc: 'Our algorithms forecast potential mechanical failures, enabling proactive maintenance decisions before problems manifest.' },
];

const STEPS = [
  { num: '01', icon: Upload, title: 'Share Your Vehicle Images', desc: 'Provide photographs from multiple angles including the front, back, sides, interior, and engine compartment for thorough evaluation.' },
  { num: '02', icon: Cpu, title: 'Machine Learning Analysis', desc: 'Our intelligent platform examines all submitted images, searching for damage indicators, deterioration levels, and concealed mechanical concerns.' },
  { num: '03', icon: Eye, title: 'Examine Detection Results', desc: 'Explore the preliminary findings with confidence levels and impact severity for each identified item.' },
  { num: '04', icon: Lock, title: 'Access Complete Assessment', desc: 'Retrieve the full diagnostic analysis with comprehensive information and detailed guidance for recommended repairs.' },
];

const TRUST_STATS = [
  { icon: ThumbsUp, value: '99%', label: 'User Approval Rating' },
  { icon: Car, value: '150+', label: 'Vehicles Evaluated Daily' },
  { icon: Users, value: '5,000+', label: 'Active Platform Members' },
  { icon: Clock, value: '2min', label: 'Typical Evaluation Duration' },
];

const FLOATING_LABELS = [
  { text: 'Front Bumper Scratch', severity: 'Medium', x: '10%', y: '25%' },
  { text: 'Tire Wear Detected', severity: 'High', x: '75%', y: '20%' },
  { text: 'Paint Condition: Good', severity: 'Low', x: '65%', y: '70%' },
  { text: 'Engine Bay: Clean', severity: 'Low', x: '15%', y: '72%' },
];

export default function Home() {
  const featureSliderRef = useRef<HTMLDivElement | null>(null);
  const stepSliderRef = useRef<HTMLDivElement | null>(null);
  const [featureScrollPos, setFeatureScrollPos] = useState(0);
  const [stepScrollPos, setStepScrollPos] = useState(0);

  const scrollFeature = (direction: 'left' | 'right') => {
    if (!featureSliderRef.current) return;
    const container = featureSliderRef.current;
    const step = container.clientWidth * 0.8;
    const newPos = direction === 'left'
      ? Math.max(0, featureScrollPos - step)
      : Math.min(container.scrollWidth - container.clientWidth, featureScrollPos + step);
    container.scrollTo({ left: newPos, behavior: 'smooth' });
    setFeatureScrollPos(newPos);
  };

  const scrollStep = (direction: 'left' | 'right') => {
    if (!stepSliderRef.current) return;
    const container = stepSliderRef.current;
    const step = container.clientWidth * 0.8;
    const newPos = direction === 'left'
      ? Math.max(0, stepScrollPos - step)
      : Math.min(container.scrollWidth - container.clientWidth, stepScrollPos + step);
    container.scrollTo({ left: newPos, behavior: 'smooth' });
    setStepScrollPos(newPos);
  };

  useEffect(() => {
    const updateScrollPos = () => {
      if (featureSliderRef.current) {
        setFeatureScrollPos(featureSliderRef.current.scrollLeft);
      }
      if (stepSliderRef.current) {
        setStepScrollPos(stepSliderRef.current.scrollLeft);
      }
    };

    const autoScrollContainer = (container: HTMLDivElement | null, setScrollPos: (pos: number) => void) => {
      if (!container) return;
      const step = container.clientWidth * 0.8;
      const intervalId = window.setInterval(() => {
        const nextPosition = container.scrollLeft + step;
        if (nextPosition >= container.scrollWidth - container.clientWidth - 2) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setScrollPos(0);
        } else {
          container.scrollTo({ left: nextPosition, behavior: 'smooth' });
          setScrollPos(nextPosition);
        }
      }, 4000);
      return intervalId;
    };

    const featureContainer = featureSliderRef.current;
    const stepContainer = stepSliderRef.current;

    if (featureContainer) {
      featureContainer.addEventListener('scroll', updateScrollPos);
    }
    if (stepContainer) {
      stepContainer.addEventListener('scroll', updateScrollPos);
    }

    // Auto-scroll functionality
    const featureInterval = autoScrollContainer(featureSliderRef.current, setFeatureScrollPos);
    const stepInterval = autoScrollContainer(stepSliderRef.current, setStepScrollPos);

    return () => {
      if (featureContainer) {
        featureContainer.removeEventListener('scroll', updateScrollPos);
      }
      if (stepContainer) {
        stepContainer.removeEventListener('scroll', updateScrollPos);
      }
      if (featureInterval) window.clearInterval(featureInterval);
      if (stepInterval) window.clearInterval(stepInterval);
    };
  }, []);

  const whatsappPhone = '919999999999'; // Replace with your WhatsApp number in international format (no +)
  const whatsappText = 'Hello%2C%20I%20would%20like%20AI%20health%20analysis.';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-24 overflow-hidden bg-brand-50">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(101,76,79,0.16),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(101,76,79,0.08),transparent_40%)]" />

        {/* Blur Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-brand-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-200/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-brand-100 shadow-sm mb-6">
                <Brain className="w-4 h-4 text-brand-700" />

                <span className="text-sm text-brand-700 font-semibold">
                  Advanced Automotive Assessment
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-6">

                Smart Vehicle <br />

                <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300 bg-clip-text text-transparent">
                  Condition Insight
                </span>

                <br />

                Delivered Fast

              </h1>

              {/* Paragraph */}
              <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed mb-8">
                Upload a few vehicle images and receive a fast AI-powered condition review.
                Discover hidden issues, wear, and repair guidance without waiting for a manual inspection.
              </p>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-10 text-sm">

                <Link
                  href="/analysis"
                  className="group w-full px-4 py-3 rounded-2xl gradient-brand-button text-white font-semibold transition-all shadow-[0_10px_30px_rgba(101,76,79,0.25)] flex items-center justify-center gap-2 text-center"
                >
                  Start Assessment

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/pricing"
                  className="w-full px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-brand-100 text-gray-700 font-semibold hover:bg-white transition-all shadow-sm text-center"
                >
                  Pricing
                </Link>

              </div>

              {/* Bottom Points */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>No account setup needed</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Results ready in about two minutes</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Clear AI inspection guidance</span>
                </div>

              </div>

            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >

              {/* Main Card */}
              <div className="relative rounded-[24px] sm:rounded-[32px] border border-brand-100 bg-white/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_80px_rgba(101,76,79,0.1)]">

                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between gap-2 p-3 sm:p-5">

                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-100 shadow-sm flex-shrink-0">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-brand-600 animate-pulse" />
                    <span className="text-[9px] sm:text-xs font-semibold text-gray-700">
                      Scan Active
                    </span>
                  </div>

                  <div className="px-2 py-1 sm:px-2.5 rounded-full bg-brand-50 border border-brand-100 text-[9px] sm:text-xs font-bold text-brand-700 shadow-sm flex-shrink-0">
                    LIVE ANALYSIS
                  </div>

                </div>

                {/* Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden">

                  {/* HD Car Image */}
                  <Image
                    src="/ai-2.jpg"
                    alt="AI vehicle inspection"
                    fill
                    priority
                    className="object-cover"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  {/* AI Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(101,76,79,0.18),transparent_60%)]" />

                  {/* Scan Line */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_20px_rgba(101,76,79,0.8)]"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Detection Labels */}
                  {[
                    {
                      positionClass: 'top-[10%] right-[3%] sm:top-[24%] sm:right-[6%]',
                      text: 'Rust Risk 12%',
                      bgClass: 'bg-yellow-500/90',
                      textClass: 'text-white',
                      widthClass: 'max-w-[42%] sm:max-w-[32%]',
                      iconClass: 'text-white',
                    },
                    {
                      positionClass: 'bottom-[10%] right-[3%] sm:bottom-[12%] sm:right-[8%]',
                      text: 'Engine Healthy',
                      bgClass: 'bg-brand-500/90',
                      textClass: 'text-white',
                      widthClass: 'max-w-[42%] sm:max-w-[32%]',
                      iconClass: 'text-white',
                    },
                  ].map((label, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: [0, -6, 0] }}
                      transition={{ duration: 3 + i, repeat: Infinity }}
                      className={`absolute ${label.positionClass} ${label.widthClass} flex px-2 py-1 rounded-2xl ${label.bgClass} ${label.textClass} backdrop-blur-md shadow-2xl text-[8px] sm:text-[10px] font-semibold border border-white/20 whitespace-nowrap`}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Zap className={`w-2 h-2 sm:w-2.5 sm:h-2.5 flex-shrink-0 ${label.iconClass}`} />
                        {label.text}
                      </div>
                    </motion.div>
                  ))}

                  {/* AI Focus Points */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-[35%] left-[28%] w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 border-brand-400 shadow-[0_0_20px_rgba(101,76,79,0.8)]"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute bottom-[30%] right-[24%] w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]"
                  />

                </div>

                {/* Bottom Stats */}
                <div className="relative bg-white/80 backdrop-blur-md border-t border-brand-100 p-3 sm:p-6">

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">

                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-brand-700">96%</div>
                      <div className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-tight">
                        Detection Accuracy
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-brand-600">2m</div>
                      <div className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-tight">
                        Scan Duration
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">AI</div>
                      <div className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-tight">
                        Neural Engine
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>
        </div>
      </section>



      {/* Trust Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* AI Intelligence Section */}
      <section className="py-20 lg:py-28 bg-brand-50 relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(101,76,79,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(101,76,79,0.08),transparent_40%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-200 mb-6">
                <Brain className="w-4 h-4 text-brand-600" />
                <span className="text-sm text-brand-700 font-semibold">
                  Neural AI Intelligence
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Next-Generation AI <br />
                <span className="text-brand-600">
                  Vehicle Diagnostics
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-[12px] lg:text-2xl leading-relaxed mb-8 max-w-xl">
                Our system combines deep learning and computer vision to uncover hidden damage,
                paint defects, and structural concerns from your vehicle photos.
              </p>

              {/* Progress Stats */}
              <div className="space-y-6">

                {[
                  ['Damage Detection Accuracy', '96%'],
                  ['AI Confidence Score', '98%'],
                  ['Repair Prediction Accuracy', '93%'],
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 text-sm font-medium">
                        {item[0]}
                      </span>

                      <span className="text-brand-600 text-sm font-bold">
                        {item[1]}
                      </span>
                    </div>

                    <div className="h-2.5 rounded-full bg-brand-100 overflow-hidden">

                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: item[1] }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.2,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >

              {/* Main Card */}
              <div className="relative rounded-3xl border border-brand-100 bg-white/70 backdrop-blur-xl p-4 sm:p-8 overflow-hidden shadow-[0_10px_60px_rgba(101,76,79,0.08)]">

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-500/5" />

                {/* AI Circle */}
                <div className="relative flex items-center justify-center h-[280px] sm:h-[400px]">

                  {/* Outer Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-brand-200"
                  />

                  {/* Middle Ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-36 h-36 sm:w-56 sm:h-56 rounded-full border border-brand-300 border-dashed"
                  />

                  {/* Core */}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center shadow-[0_0_60px_rgba(101,76,79,0.35)]"
                  >
                    <Brain className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
                  </motion.div>

                  {/* Floating Cards */}
                  {[
                    { top: '18%', right: '4%', text: 'Rust Risk 12%' },
                    { bottom: '15%', left: '2%', text: 'Scan Active' },
                    { bottom: '10%', right: '4%', text: 'Engine Healthy' },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3 + i, repeat: Infinity }}
                      className="absolute px-2 py-1 sm:px-4 sm:py-2 rounded-xl bg-white/90 border border-brand-100 shadow-lg backdrop-blur-md text-xs sm:text-sm text-brand-700 font-medium whitespace-nowrap"
                      style={card}
                    >
                      {card.text}
                    </motion.div>
                  ))}

                </div>

                {/* Bottom Status */}
                <div className="relative mt-4 flex items-center justify-between border-t border-brand-100 pt-5">

                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse flex-shrink-0" />
                    <span className="text-gray-600 text-[10px] sm:text-sm font-medium">
                      Neural AI Processing
                    </span>
                  </div>

                  <span className="text-brand-600 font-mono text-[11px] sm:text-sm font-semibold">
                    STATUS: ONLINE
                  </span>

                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Intelligent <span className="gradient-text">AI Features</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Powered by advanced neural networks trained on millions of imagery samples for health analysis
            </p>
          </motion.div>

          <div className="relative group">

            {/* Feature Slider */}
            <div
              ref={featureSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth"
            >
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-shrink-0 w-[calc(100vw-2rem)] xs:w-[80vw] sm:w-[260px] lg:w-[280px] snap-center group p-5 sm:p-6 lg:p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-100 transition-all duration-300 card-shine"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-brand-100 transition-colors">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Left Arrow — always visible on mobile, hover-only on desktop */}
            <button
              onClick={() => scrollFeature('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-brand-100 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10 disabled:opacity-30"
              disabled={featureScrollPos <= 0}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 rotate-180" />
            </button>

            {/* Right Arrow — always visible on mobile, hover-only on desktop */}
            <button
              onClick={() => scrollFeature('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-brand-100 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10 disabled:opacity-30"
              disabled={featureScrollPos >= (featureSliderRef.current?.scrollWidth || 0) - (featureSliderRef.current?.clientWidth || 0)}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
            </button>

          </div>

          {/* Mobile swipe hint */}
          <p className="mt-3 text-center text-[11px] text-gray-400 sm:hidden">Swipe to explore</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-brand-50 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(101,76,79,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(101,76,79,0.08),transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-brand-100 backdrop-blur-md mb-5">
              <Cpu className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">
                AI Workflow Process
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="text-brand-600">Works</span>
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              A four-step workflow converts your uploads into a concise, easy-to-understand inspection summary.
            </p>
          </motion.div>

          {/* Steps with Arrows */}
          <div className="relative group">
            <div ref={stepSliderRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 lg:pb-0 px-4 sm:px-6 snap-x snap-mandatory">

              {/* Connecting Line (desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />

              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] relative group snap-center"
                >

                  {/* Card */}
                  <div className="relative p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-brand-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                    {/* Step Number */}
                    {/* <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold shadow-lg text-sm z-10">
                      {step.num}
                    </div> */}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition">
                      <step.icon className="w-5 h-5 text-brand-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-100/0 to-brand-100/0 group-hover:from-brand-100/40 group-hover:to-transparent transition-all duration-500" />

                  </div>

                  {/* Arrow connector */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-brand-300" />
                    </div>
                  )}

                </motion.div>
              ))}
            </div>

            {/* Step Navigation Arrows */}
            <button
              onClick={() => scrollStep('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-brand-100 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
              disabled={stepScrollPos <= 0}
            >
              <ArrowRight className="w-5 h-5 text-brand-600 rotate-180" />
            </button>
            <button
              onClick={() => scrollStep('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-brand-100 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
              disabled={stepScrollPos >= (stepSliderRef.current?.scrollWidth || 0) - (stepSliderRef.current?.clientWidth || 0)}
            >
              <ArrowRight className="w-5 h-5 text-brand-600" />
            </button>
          </div>

        </div>
      </section>

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-50">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(101,76,79,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(101,76,79,0.08),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-brand-100 backdrop-blur-md mb-6">
                <Brain className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-semibold text-brand-700">
                  AI Inspection Engine
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Instant Condition
                <span className="text-brand-600"> Evaluation</span>
              </h1>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                The AI engine evaluates condition, identifies issues, and delivers clear findings fast.
              </p>

              <div className="grid grid-cols-2 gap-4">

                <Link
                  href="/analysis"
                  className="w-full px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition shadow-lg text-center"
                >
                  Start Scan
                </Link>

                <Link
                  href="/pricing"
                  className="w-full px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition text-center"
                >
                  View Pricing
                </Link>

              </div>

              {/* small stats */}
              <div className="mt-8 flex gap-6 text-sm text-gray-600">
                <div>⚡ 2 min processing</div>
                <div>🎯 96% accuracy</div>
                <div>🔒 Secure AI system</div>
              </div>

            </motion.div>

            {/* RIGHT VIDEO SECTION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >

              {/* Video Card */}
              <div className="relative rounded-3xl overflow-hidden border border-brand-100 shadow-2xl">

                <Image
                  src="/ai.jpg"
                  alt="AI vehicle inspection"
                  width={600}
                  height={420}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* AI Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 text-brand-700 text-xs font-semibold backdrop-blur-md">
                  LIVE VEHICLE SCAN
                </div>

                {/* Animated Scan Line */}
                <motion.div
                  className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-400 to-transparent"
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                />

              </div>

              <div className="absolute -top-6 -left-6 px-4 py-2 bg-white/80 backdrop-blur-md border border-brand-100 rounded-xl shadow-md text-xs text-brand-700 animate-bounce">
                Detecting Damage...
              </div>

              <div className="absolute bottom-6 -right-6 px-4 py-2 bg-white/80 backdrop-blur-md border border-brand-100 rounded-xl shadow-md text-xs text-brand-700 animate-bounce">
                AI Processing Active
              </div>

            </motion.div>

          </div>

        </div>
      </section>
      <section className="py-20 lg:py-32 bg-brand-50 relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(101,76,79,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(101,76,79,0.08),transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-brand-100 backdrop-blur-md mb-5">
              <Cpu className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">
                AI Processing Pipeline
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              How AI <span className="text-brand-600">Thinks</span>
            </h2>

            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Every image goes through a deep neural decision flow before generating health analysis results.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-brand-200 pl-6 md:ml-6">

            {[
              {
                title: "Image Ingestion",
                desc: "Uploaded images are converted into AI-readable tensors for health analysis",
              },
              {
                title: "Feature Extraction",
                desc: "AI detects edges, textures, scratches & structural patterns",
              },
              {
                title: "Damage Classification",
                desc: "Neural network identifies severity: low, medium, high",
              },
              {
                title: "Prediction Engine",
                desc: "Future risk, repair cost & maintenance prediction generated",
              },
            ].map((step, i) => (
              <div key={i} className="mb-10 lg:pl-6 pl-0 md:ml-6 relative">

                {/* Dot */}
                <div className="absolute -left-[33px] top-1 lg:-left-[57px] w-4 h-4 rounded-full bg-brand-500 shadow-[0_0_20px_rgba(101,76,79,0.6)] animate-pulse" />

                {/* Card */}
                <div className="p-6 rounded-2xl bg-white/70 border border-brand-100 backdrop-blur-md shadow-sm hover:shadow-lg transition-all">

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-700 font-semibold">
                      Step {i + 1}
                    </span>

                    <div className="h-[1px] flex-1 bg-brand-100" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {step.desc}
                  </p>

                </div>

              </div>
            ))}

          </div>

          {/* Bottom highlight */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/70 border border-brand-100 backdrop-blur-md whitespace-nowrap">
              <Zap className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-gray-700 font-medium">
                Fully automated AI decision system.
              </span>
            </div>
          </div>

        </div>
      </section>




      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to confirm your vehicle's condition?
            </h2>
            <p className="text-brand-100 mb-8 max-w-xl mx-auto leading-relaxed">
              Begin your scan instantly and receive a precise condition overview with no extra setup.
            </p>
            <Link
              href="/analysis"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-700 font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:bg-brand-50"
            >
              <Car className="w-5 h-5" />
              Start Vehicle Scan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <a
        href={`https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full text-white transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
      >
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
              fill="#BFC8D0"
            />{" "}
            <path
              d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
              fill="url(#paint0_linear_87_7264)"
            />{" "}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
              fill="white"
            />{" "}
            <path
              d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
              fill="white"
            />{" "}
            <defs>
              {" "}
              <linearGradient
                id="paint0_linear_87_7264"
                x1="26.5"
                y1={7}
                x2={4}
                y2={28}
                gradientUnits="userSpaceOnUse"
              >
                {" "}
                <stop stopColor="#5BD066" /> <stop offset={1} stopColor="#5BD066" />{" "}
              </linearGradient>{" "}
            </defs>{" "}
          </g>
        </svg>

      </a>
    </div>
  );
}
