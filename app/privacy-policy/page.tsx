import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm text-brand-600 uppercase tracking-[0.2em]">
            Privacy Policy
          </p>

          <h1 className="text-4xl font-semibold text-gray-900">
            How Car Readers Handles Your Data
          </h1>

          <p className="text-base text-gray-600">
            A transparent overview of the data we collect, why we collect it, and how we keep it secure.
          </p>

          <p className="text-sm text-gray-500">Last Updated: 31 March 2026</p>
        </div>

        <section className="prose prose-slate max-w-none text-gray-700">
          <p>
            Car Readers is committed to protecting your privacy.
            This policy explains what information we collect and how we use it to deliver vehicle condition reports.
          </p>

          <h2>Key Points</h2>
          <ul>
            <li>We only gather the data needed to deliver our services.</li>
            <li>We never sell your personal details.</li>
          </ul>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Car Readers is not intended for users under 18. We do not knowingly collect personal information from minors.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on local law, you may request access, correction, or deletion of your personal information.
          </p>

          <h2>Contact Us</h2>
          <p>
            Car Readers<br />
            Email: support@carreaders.ai<br />
            Website: https://carreaders.ai
          </p>

          <p>
            This Privacy Policy is effective as of 1 January 2026.
          </p>
        </section>
      </div>
    </main>
  );
}