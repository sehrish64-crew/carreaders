'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, ShieldCheck, AlertCircle, ChevronDown } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/mock-data';

const VEHICLE_CATEGORIES = [
  'Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe',
  'Convertible', 'Wagon', 'Van', 'Motorcycle', 'Campervan', 'Motorhome', 'RV', 'Car', 'Bike', 'Caravan',
];

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', vin: '', category: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) setSelectedPlan(savedPlan);
  }, []);

  const selectedPlanData = PRICING_PLANS.find((plan) => plan.id === selectedPlan);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    localStorage.setItem('selectedPlan', planId);
    setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlan || !formData.name || !formData.email || !formData.phone || !formData.vin || !formData.category) {
      setErrorMessage('Please choose a plan and fill in every required field.');
      return;
    }
    if (!confirmed) {
      setErrorMessage('Please confirm that you understand the purchase before proceeding.');
      return;
    }
    setStatus('saving');
    setErrorMessage('');
    localStorage.setItem(
      'paymentData',
      JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        selectedPlan,
        vin: formData.vin,
        category: formData.category,
      }),
    );
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-slate-950 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 sm:px-4 sm:py-2 text-cyan-200 mb-4 sm:mb-5 border border-slate-800">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
            <span className="text-xs sm:text-sm font-medium">Start your AI vehicle condition review</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-100">
            Plans & Checkout
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto px-2">
            Pick the plan that matches your needs, then share your details to continue to checkout.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr]">

          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">

            {/* Plan Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 sm:gap-6 sm:grid-cols-2"
            >
              {PRICING_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 text-left transition-all ${
                    selectedPlan === plan.id
                      ? 'border-cyan-400 bg-slate-900/80 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-800 bg-slate-900/70 hover:border-cyan-400 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div>
                      <h2 className="text-base sm:text-xl font-semibold text-slate-100">{plan.name}</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{plan.description}</p>
                    </div>
                    {selectedPlan === plan.id && (
                      <span className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 ml-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    )}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-100">£{plan.price}</div>
                  <div className="text-xs sm:text-sm text-slate-400">/ report</div>
                </button>
              ))}
            </motion.div>

            {/* Secure Checkout Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl sm:rounded-3xl glass border border-slate-800 bg-slate-950/80 p-4 sm:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-cyan-200 font-medium">Secure checkout</span>
              </div>
              <p className="text-xs sm:text-base text-slate-400">
                Your order is protected and your information is used only to generate the inspection report.
              </p>
            </motion.div>
          </div>

          {/* Right Column — Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <div className="mb-5 sm:mb-8">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.24em] text-cyan-300">
                Order summary
              </p>
              <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-semibold text-slate-100">
                Your Report Purchase
              </h2>
            </div>

            {selectedPlanData ? (
              <div className="space-y-4 sm:space-y-6">

                {/* Selected Plan Summary */}
                <div className="rounded-2xl sm:rounded-3xl glass p-4 sm:p-6 border border-slate-800">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Selected plan</p>
                      <p className="text-base sm:text-lg font-semibold text-slate-100">{selectedPlanData.name}</p>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-cyan-300 ml-2 flex-shrink-0">
                      £{selectedPlanData.price}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">{selectedPlanData.description}</p>
                </div>

                {/* Form */}
                <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>

                  {/* Text / email fields */}
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Doe' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'jane@example.com' },
                    { label: 'VIN Number', key: 'vin', type: 'text', placeholder: '1HGCM82633A004352' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs sm:text-sm font-medium text-slate-300">{label}</label>
                      <input
                        type={type}
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [key]: key === 'vin' ? e.target.value.toUpperCase() : e.target.value,
                          }))
                        }
                        placeholder={placeholder}
                        className="mt-1.5 sm:mt-2 w-full rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                  ))}

                  {/* UK Phone Number */}
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-300">Phone Number</label>
                    <div className="mt-1.5 sm:mt-2 flex rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 transition">
                      <span className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-r border-slate-800 text-sm text-slate-400 font-medium select-none flex-shrink-0">
                       +44
                      </span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/[^\d\s]/g, '');
                          setFormData((prev) => ({ ...prev, phone: digits }));
                        }}
                        placeholder="7911 123456"
                        maxLength={13}
                        className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-100 outline-none bg-transparent"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">Enter without the leading 0 — e.g. 7911 123456</p>
                  </div>

                  {/* Styled Category Dropdown */}
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-300">Vehicle Category</label>
                    <div className="mt-1.5 sm:mt-2 relative">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full appearance-none rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition cursor-pointer"
                      >
                        <option value="" disabled>Choose a category</option>
                        {VEHICLE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-xs sm:text-sm text-cyan-300">{errorMessage}</p>
                  )}

                  {/* Confirmation Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded-md border-2 border-slate-700 bg-slate-950 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                        {confirmed && <Check className="w-3 h-3 text-slate-950" />}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      I confirm I understand this package and agree to continue to payment.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!confirmed || status === 'saving'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-cyan-500 px-5 py-3 sm:py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                  >
                    {status === 'saving' ? 'Proceeding to Checkout...' : 'Proceed to Checkout'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl sm:rounded-3xl glass border border-slate-800 bg-slate-950/80 p-6 sm:p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <AlertCircle className="mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-cyan-300" />
                <p className="text-sm sm:text-base text-slate-300">
                  Select a plan to reveal the checkout form.
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
} 