import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="section-container" id="privacy">
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/499537240.sd.mp4?s=b98bc9c69c5439024e518dd9238f4c5c765c91f5&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-7xl mx-auto px-4">
        <div className="glass rounded-lg p-8 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Lock className="w-8 h-8 text-red-500 mr-4" />
            <h2 className="text-3xl font-bold">Privacy Policy</h2>
          </div>

          <div className="text-sm text-gray-400 mb-8">Last Updated: April 26, 2025</div>
          
          <div className="space-y-8 text-gray-300">
            <p>Welcome to Arkham Archives ("we," "our," or "us"). We value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (the "Services"). By using Arkham Archives, you consent to the practices described in this policy.</p>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h3>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Personal Information: Name, email address, phone number, account login details, and other information you voluntarily provide when registering or contacting us.</li>
                <li>Payment Information: If you make purchases through our platform, we collect billing details (handled through secure third-party payment processors).</li>
                <li>Usage Data: Information about your device, browsing actions, pages visited, time spent on pages, and other diagnostic data.</li>
                <li>Cookies and Tracking Technologies: We may use cookies, web beacons, and similar technologies to improve your experience.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions</li>
                <li>Communicate with you, including customer support responses</li>
                <li>Send administrative information like updates to our terms or policies</li>
                <li>Monitor and analyze usage trends and preferences</li>
                <li>Protect the security and integrity of our platform</li>
                <li>Enforce our Terms and Conditions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">3. Sharing of Information</h3>
              <p>We do not sell, rent, or share your personal information with third parties for their direct marketing purposes.</p>
              <p className="mt-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Service Providers: Trusted third parties who perform services on our behalf (e.g., payment processors, hosting providers)</li>
                <li>Compliance with Laws: If required to do so by law or in response to valid requests (e.g., court orders)</li>
                <li>Business Transfers: In the event of a merger, acquisition, or asset sale, your information may be transferred.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">4. Data Security</h3>
              <p>We take reasonable measures to protect your information from unauthorized access, loss, misuse, disclosure, alteration, or destruction.</p>
              <p className="mt-4">However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">5. Your Rights</h3>
              <p>Depending on your location, you may have rights regarding your personal data, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access to your personal information</li>
                <li>Request correction of your information</li>
                <li>Request deletion of your information</li>
                <li>Object to or restrict certain types of processing</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us at knight@arkhamarchives.net.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">6. Data Retention</h3>
              <p>We retain your information as long as necessary to provide the Services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">7. Children's Privacy</h3>
              <p>Arkham Archives is not intended for children under the age of 13.</p>
              <p className="mt-4">We do not knowingly collect personal information from children. If we learn we have collected information from a child under 13, we will delete it promptly.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">8. Changes to This Privacy Policy</h3>
              <p>We may update this Privacy Policy from time to time.</p>
              <p className="mt-4">When we do, we will revise the "Last Updated" date. We encourage you to review the policy periodically for any changes.</p>
              <p className="mt-4">Your continued use of the Services after any changes signifies your acceptance of the revised policy.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">9. Contact Us</h3>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
              <div className="mt-4">
                <p>📧 Email: knight@arkhamarchives.net</p>
                <p>📞 Phone: +91-6360210029</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;