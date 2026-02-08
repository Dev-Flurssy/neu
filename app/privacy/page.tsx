import Link from "next/link";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: February 8, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to NEU Notes. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect and process the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Account Information:</strong> Name, email address, and password when you register</li>
              <li><strong>Note Content:</strong> The notes and documents you create and store on our platform</li>
              <li><strong>Usage Data:</strong> Information about how you use our service, including access times and features used</li>
              <li><strong>Authentication Data:</strong> OAuth tokens if you sign in with Google or other providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide and maintain our note-taking service</li>
              <li>Authenticate your account and ensure security</li>
              <li>Generate AI-assisted content when you use our AI features</li>
              <li>Export your notes to various formats (PDF, DOCX, PPTX)</li>
              <li>Improve our services and develop new features</li>
              <li>Communicate with you about service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Storage and Security</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data is stored securely in our database. We implement appropriate technical and organizational 
              measures to protect your personal information against unauthorized access, alteration, disclosure, 
              or destruction. Your passwords are encrypted, and we use secure connections (HTTPS) for all data transmission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Authentication Providers:</strong> Google OAuth for sign-in functionality</li>
              <li><strong>AI Services:</strong> OpenAI API for AI-assisted content generation</li>
              <li><strong>Hosting Services:</strong> Cloud infrastructure providers for data storage and processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your notes and data</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data only for as long as necessary to provide our services and fulfill 
              the purposes outlined in this privacy policy. When you delete your account, we will delete or 
              anonymize your personal information within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies to maintain your session and authentication state. These cookies are 
              necessary for the website to function properly. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this privacy policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@neunotes.com<br />
                <strong>Address:</strong> NEU Notes Privacy Team
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
