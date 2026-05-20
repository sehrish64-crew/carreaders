import React from 'react';

export default function TermsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm text-brand-600 uppercase tracking-[0.2em]">
            Terms &amp; Conditions
          </p>

          <h1 className="text-4xl font-semibold text-gray-900">
            Terms of Use for Car Readers
          </h1>

          <p className="text-base text-gray-600">
            The terms that apply when you use Car Readers for vehicle condition analysis.
          </p>

          <p className="text-sm text-gray-500">Last Updated: March 31st, 2026</p>
        </div>

        <section className="prose prose-slate max-w-none text-gray-700">
          <p>
            Car Readers provides online vehicle inspection reports and condition summaries powered by automated analysis.
            By using this site, you agree to these terms.
          </p>

          <h2>1. Acceptance</h2>
          <p>When you access Car Readers, you accept these Terms of Use and agree to comply with them.</p>

          <h2>2. Our Service</h2>
          <p>
            Car Readers turns vehicle images into a guided condition assessment. The service is intended for informational use and not a substitute for a physical inspection.
          </p>

          <h2>4. User Responsibilities</h2>
          <ul>
            <li>Provide correct information</li>
            <li>Use the service lawfully</li>
            <li>Do not redistribute reports without approval</li>
          </ul>

          <h2>5. Report Accuracy Disclaimer</h2>
          <p>
            Information is gathered from multiple sources and may not always be completely precise.
          </p>

          <h2>6. Contact Information</h2>
          <p>
            Car Readers<br />
            Email: support@carreaders.ai<br />
            Website: https://carreaders.ai
          </p>
        </section>
      </div>
    </main>
  );
}