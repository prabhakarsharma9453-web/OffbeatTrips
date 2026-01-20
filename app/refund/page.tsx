import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { RefreshCw, Clock, AlertCircle, CheckCircle } from "lucide-react"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Refund <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: January 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                At OffbeatTrips, we understand that sometimes plans change. This Refund Policy outlines the terms and conditions for cancellations and refunds for our travel packages and services. Please read this policy carefully before making a booking, as refund eligibility depends on the timing of cancellation and the type of service booked.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Cancellation and Refund Timeline</h2>
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-white mb-2">30+ Days Before Travel</h3>
                      <p className="text-muted-foreground">
                        <strong className="text-primary">Full refund</strong> minus processing fees (typically 5-10% of the booking amount). Processing fees cover administrative costs and payment gateway charges.
                      </p>
                    </div>

                    <div className="border-l-2 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-white mb-2">15-30 Days Before Travel</h3>
                      <p className="text-muted-foreground">
                        <strong className="text-primary">70% refund</strong> of the total booking amount. This accounts for costs incurred in securing accommodations and services.
                      </p>
                    </div>

                    <div className="border-l-2 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-white mb-2">7-15 Days Before Travel</h3>
                      <p className="text-muted-foreground">
                        <strong className="text-primary">50% refund</strong> of the total booking amount. Significant costs have been committed at this stage.
                      </p>
                    </div>

                    <div className="border-l-2 border-red-500 pl-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Less Than 7 Days Before Travel</h3>
                      <p className="text-muted-foreground">
                        <strong className="text-red-400">Non-refundable</strong>. Full payment has been committed to service providers, and no refund can be processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Special Cases and Exceptions</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Non-Refundable Bookings</h3>
                      <p className="leading-relaxed">
                        Some bookings are explicitly marked as "Non-Refundable" at the time of purchase. These include:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Special promotional offers and discounted packages</li>
                        <li>Last-minute deals</li>
                        <li>Certain airline tickets and hotel bookings</li>
                        <li>Group bookings with special terms</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Force Majeure Events</h3>
                      <p className="leading-relaxed">
                        In cases of force majeure (natural disasters, pandemics, government restrictions, etc.), refund policies may be adjusted. We will work with service providers to secure the best possible outcome, which may include:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Full or partial refunds based on provider policies</li>
                        <li>Travel credits for future use</li>
                        <li>Rescheduling options without penalty</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Medical Emergencies</h3>
                      <p className="leading-relaxed">
                        Cancellations due to medical emergencies may be eligible for special consideration. Please contact us immediately with supporting documentation (medical certificates) for review. Each case will be evaluated individually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Refund Processing</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Processing Time</h3>
                      <p className="leading-relaxed">
                        Once your cancellation is approved, refunds are typically processed within <strong className="text-white">7-10 business days</strong>. The refund will be credited back to your original payment method.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Payment Method</h3>
                      <p className="leading-relaxed">
                        Refunds are processed to the same payment method used for the original transaction:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li><strong className="text-white">Credit/Debit Cards:</strong> 7-10 business days</li>
                        <li><strong className="text-white">UPI:</strong> 3-5 business days</li>
                        <li><strong className="text-white">Net Banking:</strong> 5-7 business days</li>
                        <li><strong className="text-white">Digital Wallets:</strong> 2-3 business days</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Processing Fees</h3>
                      <p className="leading-relaxed">
                        Processing fees (typically 5-10%) are deducted from refunds to cover administrative costs and payment gateway charges. These fees are non-refundable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">How to Request a Refund</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">To request a cancellation and refund:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Log into your account on our website or contact us directly</li>
                  <li>Provide your booking reference number</li>
                  <li>State your reason for cancellation</li>
                  <li>Submit your cancellation request</li>
                </ol>
                <p className="leading-relaxed mt-4">
                  You can contact us via:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email: <a href="mailto:happyholidaying@offbeattrips.in" className="text-primary hover:underline">happyholidaying@offbeattrips.in</a></li>
                  <li>Phone: <a href="tel:+918588855935" className="text-primary hover:underline">+91 85888 55935</a></li>
                  <li>WhatsApp: Available on our website</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Partial Cancellations</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you need to cancel only part of your booking (e.g., one person from a group booking), please contact us. Partial cancellations are subject to availability and may incur additional fees. Refunds for partial cancellations are calculated based on the remaining booking value and applicable cancellation terms.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">No-Show Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you fail to show up for your booked service without prior cancellation, no refund will be provided. This applies to all bookings including hotels, tours, and activities.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Travel Insurance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We strongly recommend purchasing travel insurance to protect against unexpected cancellations, medical emergencies, and other travel-related issues. Travel insurance may provide coverage beyond our refund policy terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you have travel insurance, please contact your insurance provider directly for claims. We can provide necessary documentation to support your insurance claim.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Disputes and Appeals</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you believe your refund request was incorrectly processed or denied, please contact us with your booking reference and details. We will review your case and respond within 5-7 business days. All disputes will be handled in good faith and in accordance with applicable laws.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about refunds or to request a cancellation, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-white">Email:</strong> <a href="mailto:happyholidaying@offbeattrips.in" className="text-primary hover:underline">happyholidaying@offbeattrips.in</a></p>
                <p><strong className="text-white">Phone:</strong> <a href="tel:+918588855935" className="text-primary hover:underline">+91 85888 55935</a></p>
                <p><strong className="text-white">Business Hours:</strong> Monday - Saturday, 9:00 AM - 7:00 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
