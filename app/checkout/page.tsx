'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Shield,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { PRICING_PLANS } from '@/lib/mock-data';

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const router = useRouter();

  const [paymentData, setPaymentData] = useState<{
    customerName: string;
    customerEmail: string;
    selectedPlan: string;
    vin?: string;
    category?: string;
    vehicleId?: string;
  } | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('paymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
    }
  }, []);

  const selectedPlan = paymentData
    ? PRICING_PLANS.find((p) => p.id === paymentData.selectedPlan)
    : null;

  const handlePayment = async () => {
    if (!paymentData) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (paymentData.vehicleId) {
        const response = await fetch('/api/payments/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleId: paymentData.vehicleId, status: 'Completed' }),
        });
        if (!response.ok) throw new Error('Payment update failed');
      }
      setPaymentComplete(true);
      localStorage.removeItem('paymentData');
      setTimeout(() => router.push('/analysis/success'), 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  /* ── Not found state ── */
  if (!paymentData) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 bg-brand-50 flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl sm:rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-10 shadow-xl shadow-brand-100 text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Unable to retrieve order details</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Please return to the pricing page and choose a plan.</p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-2.5 sm:py-3 gradient-brand-button text-white font-semibold rounded-2xl transition-colors text-sm sm:text-base"
          >
            View Pricing Plans
          </button>
        </div>
      </div>
    );
  }

  /* ── Payment complete state ── */
  if (paymentComplete) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 bg-brand-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-2xl sm:rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-10 shadow-xl shadow-brand-100 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-brand-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Payment Complete!</h1>
          <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-6">
            Your inspection report is being prepared.
          </p>
          <p className="text-sm text-gray-500">You will be redirected shortly.</p>
        </motion.div>
      </div>
    );
  }

  /* ── Main checkout ── */
  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-brand-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Secure Your Vehicle Report
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600">
            Secure payment to unlock your vehicle analysis report.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl sm:rounded-[2rem] border border-gray-200 bg-white p-4 sm:p-6 shadow-sm"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

            {selectedPlan && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-200 bg-brand-50">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-brand-700 ml-3 flex-shrink-0">
                    £{selectedPlan.price}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-lg text-gray-900 font-medium">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-brand-700">
                      £{selectedPlan.price}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-brand-200 bg-brand-50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-700 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-brand-700 font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Your payment details are encrypted and kept secure.
              </p>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl sm:rounded-[2rem] border border-gray-200 bg-white p-4 sm:p-6 shadow-sm"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Payment Details</h2>

            <div className="space-y-4 sm:space-y-6">

              {/* Customer Info */}
              <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-200 bg-brand-50">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                  Customer Information
                </h3>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-sm text-gray-900">{paymentData.customerName}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{paymentData.customerEmail}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Payment Method
                </label>
                <div className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-2xl sm:rounded-3xl bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    defaultChecked
                    className="w-4 h-4 text-brand-700 bg-white border-gray-300 focus:ring-brand-500"
                  />
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-brand-700" />
                  <span className="text-sm sm:text-base text-gray-900 font-medium">Credit/Debit Card</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 gradient-brand-button disabled:bg-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Pay £{selectedPlan?.price} Now
                  </>
                )}
              </button>

              <p className="text-[11px] sm:text-xs text-gray-400 text-center leading-relaxed">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}