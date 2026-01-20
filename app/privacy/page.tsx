import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: January 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At OffbeatTrips ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                      <p className="leading-relaxed">
                        When you book a trip, create an account, or contact us, we may collect:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Name, email address, and phone number</li>
                        <li>Billing and payment information</li>
                        <li>Travel preferences and special requirements</li>
                        <li>Passport and identification details (for international travel)</li>
                        <li>Emergency contact information</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Automatically Collected Information</h3>
                      <p className="leading-relaxed">
                        When you visit our website, we automatically collect:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>IP address and browser type</li>
                        <li>Device information and operating system</li>
                        <li>Pages visited and time spent on our site</li>
                        <li>Referring website addresses</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="leading-relaxed">We use your information to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Process and manage your bookings and reservations</li>
                      <li>Communicate with you about your trips, including confirmations and updates</li>
                      <li>Provide customer support and respond to your inquiries</li>
                      <li>Send you promotional materials and travel offers (with your consent)</li>
                      <li>Improve our website, services, and user experience</li>
                      <li>Detect and prevent fraud, security threats, and unauthorized access</li>
                      <li>Comply with legal obligations and enforce our terms of service</li>
                      <li>Analyze website usage and trends to enhance our services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Service Providers:</strong> We share information with trusted third-party service providers who assist us in operating our website, processing payments, managing bookings, and delivering services (e.g., hotels, airlines, tour operators).</li>
                  <li><strong className="text-white">Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation, or to protect our rights, property, or safety.</li>
                  <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
                  <li><strong className="text-white">With Your Consent:</strong> We may share your information with third parties when you explicitly consent to such sharing.</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Data portability (receive your data in a structured format)</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To exercise these rights, please contact us at <a href="mailto:happyholidaying@offbeattrips.in" className="text-primary hover:underline">happyholidaying@offbeattrips.in</a>
                </p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookies through your browser settings, though disabling cookies may affect website functionality.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-white">Email:</strong> <a href="mailto:happyholidaying@offbeattrips.in" className="text-primary hover:underline">happyholidaying@offbeattrips.in</a></p>
                <p><strong className="text-white">Phone:</strong> <a href="tel:+918588855935" className="text-primary hover:underline">+91 85888 55935</a></p>
                <p><strong className="text-white">Address:</strong> 123 Adventure Street, Travel City, TC 12345</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
