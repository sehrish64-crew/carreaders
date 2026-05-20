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
    <div className="min-h-screen pt-20 sm:pt-24 bg-brand-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >

          {/* Success Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-brand-700" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Payment Successful!
          </h1>

          <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto">
            Your vehicle inspection report is being assembled and will be sent to your inbox shortly.
          </p>

          {/* Report Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl sm:rounded-[2rem] border border-gray-200 bg-white p-5 sm:p-8 shadow-sm mb-5 sm:mb-8"
          >
            {!reportReady ? (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Generating Your Report
                  </h3>
                  <p className="text-sm text-gray-600">This may take a few moments...</p>
                </div>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-brand-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand-700" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Report Ready!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
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
            className="rounded-2xl sm:rounded-[2rem] border border-gray-200 bg-white p-4 sm:p-6 mb-5 sm:mb-8 shadow-sm text-left"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
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
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{item.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
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
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-gray-500">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-700 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Secure • Professional • AI-Powered</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-2xl transition-colors hover:bg-gray-800"
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