import React from 'react';
import { FileText, Shield, Lock, Scale } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="section-container" id="terms">
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/499537240.sd.mp4?s=b98bc9c69c5439024e518dd9238f4c5c765c91f5&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-7xl mx-auto px-4">
        <div className="glass rounded-lg p-8 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-white mr-4" />
            <h2 className="text-3xl font-bold">Terms and Conditions</h2>
          </div>
          
          <div className="text-sm text-gray-400 mb-8">Last Updated: April 26, 2025</div>
          
          <div className="space-y-8 text-gray-300">
            <p>Welcome to Arkham Archives ("we," "our," "us")! These Terms and Conditions ("Terms") govern your use of our website, services, and products (the "Services"). By accessing or using our Services, you agree to these Terms. If you do not agree, please do not use Arkham Archives.</p>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">1. Use of Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 13 years old (or the minimum legal age in your jurisdiction) to use Arkham Archives.</li>
                <li>You agree to use our Services only for lawful purposes and in accordance with these Terms.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">2. Account Registration</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Certain features of Arkham Archives may require you to register an account.</li>
                <li>You agree to provide accurate, current, and complete information and to keep your account information updated.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">3. Privacy and Data Protection</h3>
              <div className="glass bg-black/40 p-6 mb-4">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-white mr-3" />
                  <h4 className="text-lg font-semibold">Data Collection and Usage</h4>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We collect and process personal data in accordance with our Privacy Policy.</li>
                  <li>Your data is encrypted and stored securely on our servers.</li>
                  <li>We implement industry-standard security measures to protect your information.</li>
                </ul>
              </div>
              
              <div className="glass bg-black/40 p-6 mb-4">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-white mr-3" />
                  <h4 className="text-lg font-semibold">Your Privacy Rights</h4>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to access your personal data</li>
                  <li>Right to request data correction or deletion</li>
                  <li>Right to restrict or object to data processing</li>
                  <li>Right to data portability</li>
                </ul>
              </div>
              
              <div className="glass bg-black/40 p-6">
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-white mr-3" />
                  <h4 className="text-lg font-semibold">Data Sharing and Third Parties</h4>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We do not sell your personal data to third parties.</li>
                  <li>Data sharing is limited to essential service providers and legal requirements.</li>
                  <li>Third-party services are bound by strict data protection agreements.</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">4. Payments and Billing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All payments made on Arkham Archives are final and non-refundable.</li>
                <li>By completing a purchase, you acknowledge and agree to this no-refund policy.</li>
                <li>If you have any billing questions or concerns, please contact our support team within a reasonable time frame.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">5. Customer Support</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are committed to assisting you.</li>
                <li>Response time for customer support inquiries is typically between 24 to 48 hours.</li>
                <li>Please contact us at 📧 knight@arkhamarchives.net or 📞 +91-6360210029.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">6. Prohibited Activities</h3>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws, regulations, or these Terms</li>
                <li>Infringe upon the rights of others</li>
                <li>Disrupt or interfere with the security or functionality of the Services</li>
                <li>Use the Services to distribute viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems, data, or other users' accounts</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">7. Intellectual Property Rights</h3>
              <p>All materials on Arkham Archives — including but not limited to text, graphics, logos, images, and software — are owned by Arkham Archives or our licensors and are protected by copyright, trademark, and other laws.</p>
              <p className="mt-4">You may not copy, reproduce, modify, republish, upload, post, transmit, or distribute any material from our Services without our prior written consent.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">8. Termination</h3>
              <p>We reserve the right to suspend or terminate your access to the Services at our sole discretion, without notice, if we believe you have violated these Terms or engaged in conduct that harms Arkham Archives, its users, or third parties.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">9. Disclaimer of Warranties</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Arkham Archives is provided on an "AS IS" and "AS AVAILABLE" basis.</li>
                <li>We make no warranties or representations about the accuracy, reliability, availability, or completeness of the Services.</li>
                <li>Your use of the Services is at your own risk.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">10. Limitation of Liability</h3>
              <p>To the fullest extent permitted by law, Arkham Archives and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Services.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">11. Changes to Terms</h3>
              <p>We may update these Terms at any time. Changes will be effective upon posting the revised Terms on our platform, with the "Last Updated" date reflecting the revision. Your continued use of the Services after changes have been posted constitutes your acceptance of the new Terms.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">12. Governing Law</h3>
              <p>These Terms and your use of the Services shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">13. Contact Us</h3>
              <p>If you have any questions or concerns about these Terms, please contact us:</p>
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

export default Terms;