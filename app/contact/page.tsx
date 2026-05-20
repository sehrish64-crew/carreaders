'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        throw new Error(
          text
            ? `Server returned invalid response: ${text.slice(0, 200)}`
            : 'Server returned invalid response.'
        );
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to submit contact message.');
      }

      setSubmitted(true);
    } catch (submitError: any) {
      setError(
        submitError?.message?.includes('Unexpected token')
          ? 'Server returned an unexpected response. Please try again or check the live API logs.'
          : submitError?.message || 'Submission failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 mb-6">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span className="text-sm text-brand-700 font-medium">Get In Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Need help with a report, scan, or pricing question? Our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { icon: Mail, label: 'Email', value: 'support@carreaders.ai' },
              { icon: Phone, label: 'Phone', value: '+44 20 1234 5678' },
              { icon: MapPin, label: 'Office', value: 'Remote support hub' },
              { icon: Clock, label: 'Hours', value: 'Mon-Fri 9:00 - 18:00 GMT' },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm text-gray-900 font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="report">AI Report Question</option>
                      <option value="enterprise">Enterprise Solutions</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  {error && <p className="text-sm text-brand-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400 text-white font-semibold transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent</h3>
                  <p className="text-gray-500 text-sm">We will get back to you within 24 hours.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
