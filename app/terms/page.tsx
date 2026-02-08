import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: February 8, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using NEU Notes, you agree to be bound by these Terms of Service and all applicable 
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using 
              or accessing this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NEU Notes provides a cloud-based note-taking platform with the following features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Rich text editing and formatting</li>
              <li>AI-assisted content generation</li>
              <li>Export to PDF, DOCX, and PPTX formats</li>
              <li>Cloud storage and synchronization</li>
              <li>User authentication and account management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Maintaining the security of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use NEU Notes to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Harass, abuse, or harm others</li>
              <li>Spam or send unsolicited communications</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Ownership</h2>
            <p className="text-gray-700 leading-relaxed">
              You retain all rights to the content you create and store on NEU Notes. By using our service, 
              you grant us a limited license to store, process, and display your content solely for the purpose 
              of providing the service to you. We do not claim ownership of your notes or documents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed">
              When using our AI features, you acknowledge that AI-generated content may not always be accurate 
              or appropriate. You are responsible for reviewing and verifying any AI-generated content before 
              use. We are not liable for any errors, inaccuracies, or consequences resulting from AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide reliable service but do not guarantee uninterrupted access. We may modify, 
              suspend, or discontinue any part of the service at any time. We are not liable for any 
              modification, suspension, or discontinuation of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Backup</h2>
            <p className="text-gray-700 leading-relaxed">
              While we implement backup procedures, you are responsible for maintaining your own backups of 
              important content. We recommend regularly exporting your notes to ensure you have local copies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              NEU Notes and its affiliates shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use or inability to use the service. 
              This includes loss of data, profits, or business opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend your account immediately, without prior notice, 
              for conduct that we believe violates these Terms of Service or is harmful to other users, 
              us, or third parties, or for any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material 
              changes by posting the new Terms of Service on this page and updating the "Last updated" date. 
              Your continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without 
              regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> support@neunotes.com<br />
                <strong>Address:</strong> NEU Notes Legal Team
              </p>
            </div>
          </section>

          <section className="pt-6 border-t">
            <p className="text-sm text-gray-600">
              By using NEU Notes, you acknowledge that you have read, understood, and agree to be bound by 
              these Terms of Service and our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
