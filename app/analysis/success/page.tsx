'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, FileText, ArrowRight, Shield } from 'lucide-react';

export default function AnalysisSuccessPage() {
  const [reportReady, setReportReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setReportReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >

          {/* Success Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-3 sm:mb-4">
            Payment Successful!
          </h1>

          <p className="text-sm sm:text-base lg:text-xl text-slate-400 mb-6 sm:mb-8 max-w-lg mx-auto">
            Your vehicle inspection report is being assembled and will be sent to your inbox shortly.
          </p>

          {/* Report Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl sm:rounded-[2rem] border border-slate-700/20 bg-slate-900/95 p-5 sm:p-8 shadow-[0_20px_60px_rgba(8,18,35,0.35)] mb-5 sm:mb-8"
          >
            {!reportReady ? (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1 sm:mb-2">
                    Generating Your Report
                  </h3>
                  <p className="text-sm text-slate-400">This may take a few moments...</p>
                </div>
                <div className="w-full max-w-xs bg-slate-800 rounded-full h-2">
                  <motion.div
                    className="bg-cyan-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1 sm:mb-2">
                    Report Ready!
                  </h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Your full inspection summary is ready and will arrive by email within one business day.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl sm:rounded-[2rem] border border-slate-700/20 bg-slate-900/95 p-4 sm:p-6 mb-5 sm:mb-8 shadow-[0_20px_60px_rgba(8,18,35,0.35)] text-left"
          >
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-3 sm:mb-4">
              What&apos;s Included in Your Report
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

              {[
                {
                  title: 'Complete Issue Analysis',
                  desc: 'All detected problems with repair estimates',
                },
                {
                  title: 'Health Score',
                  desc: 'Overall condition assessment',
                },
                {
                  title: 'Repair Recommendations',
                  desc: 'Prioritized action items',
                },
                {
                  title: 'Professional Insights',
                  desc: 'Expert analysis and advice',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium">{item.title}</p>
                    <p className="text-xs sm:text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-slate-400">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Secure • Professional • AI-Powered</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-cyan-600 text-white text-sm sm:text-base font-semibold rounded-2xl transition-colors hover:bg-cyan-500"
              >
                Back to Home
              </button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
