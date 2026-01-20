import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { FileText, Scale, AlertCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Terms of <span className="text-primary">Service</span>
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
                  <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using the OffbeatTrips website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Use of Services</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use our services in any way that violates applicable laws or regulations</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Interfere with or disrupt the operation of our website or services</li>
                  <li>Attempt to gain unauthorized access to any part of our systems</li>
                  <li>Use automated systems to access our website without permission</li>
                  <li>Transmit any viruses, malware, or harmful code</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Bookings and Reservations</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Booking Process</h3>
                  <p className="leading-relaxed">
                    When you make a booking through our platform, you enter into a contract with us. All bookings are subject to availability and confirmation. We reserve the right to refuse or cancel any booking at our discretion.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pricing and Payment</h3>
                  <p className="leading-relaxed">
                    All prices are displayed in the currency specified and are subject to change without notice until booking is confirmed. Payment must be made in full or as per the payment schedule specified at the time of booking. We accept various payment methods including credit/debit cards, UPI, and digital wallets.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Booking Confirmation</h3>
                  <p className="leading-relaxed">
                    Your booking is confirmed only after we receive full payment and send you a confirmation email. Please review all booking details carefully and contact us immediately if you notice any errors.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">4. Cancellation and Refund Policy</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      Cancellation policies vary by package type and are clearly stated at the time of booking. General terms:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Cancellations made 30+ days before travel: Full refund minus processing fees</li>
                      <li>Cancellations made 15-30 days before travel: 70% refund</li>
                      <li>Cancellations made 7-15 days before travel: 50% refund</li>
                      <li>Cancellations made less than 7 days before travel: Non-refundable</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      Refunds are processed within 7-10 business days. Some bookings may be non-refundable as specified. Please refer to our Refund Policy for detailed information.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Travel Documents and Requirements</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  It is your responsibility to ensure you have:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Valid passport and necessary visas for international travel</li>
                  <li>Required vaccinations and health certificates</li>
                  <li>Travel insurance (highly recommended)</li>
                  <li>All necessary travel documents</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  We are not responsible for any issues arising from missing or invalid travel documents. We recommend checking entry requirements well in advance of your travel date.
                </p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Travel Insurance</h2>
              <p className="text-muted-foreground leading-relaxed">
                Travel insurance is highly recommended for all trips. We offer travel insurance options, but you may also purchase insurance from third-party providers. We are not responsible for any losses, damages, or expenses incurred due to lack of travel insurance.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We act as an intermediary between you and service providers (hotels, airlines, tour operators)</li>
                  <li>We are not liable for any acts, omissions, or defaults of third-party service providers</li>
                  <li>Our liability is limited to the amount paid for the specific service</li>
                  <li>We are not responsible for delays, cancellations, or changes due to circumstances beyond our control (force majeure)</li>
                  <li>We are not liable for personal injury, property damage, or other losses during travel</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on our website, including text, graphics, logos, images, and software, is the property of OffbeatTrips or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our written permission.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. User Accounts</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  If you create an account with us, you are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Force Majeure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are not liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, pandemics, government actions, or other force majeure events. In such cases, we will work with you to find reasonable solutions, but refunds are subject to the policies of our service providers.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed">
                Any disputes arising from these Terms or our services shall be resolved through good faith negotiation. If negotiation fails, disputes shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction], and shall be governed by the laws of [Your Country/State].
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
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
