import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          question: "How do I book a package?",
          answer: "You can book a package directly through our website by selecting your desired package and clicking 'Book Now'. Alternatively, you can contact us via phone, email, or WhatsApp for personalized assistance with your booking."
        },
        {
          question: "Can I customize my travel package?",
          answer: "Yes! We offer customizable packages to suit your preferences. Contact our travel experts, and we'll work with you to create a personalized itinerary that matches your interests, budget, and travel dates."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept multiple payment methods including credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our trusted payment partners: Airpay, Razorpay, and PhonePe."
        },
        {
          question: "When will I receive my booking confirmation?",
          answer: "You'll receive an instant booking confirmation via email and SMS immediately after completing your payment. This confirmation includes all booking details, itinerary, and contact information."
        }
      ]
    },
    {
      category: "Cancellation & Refunds",
      questions: [
        {
          question: "What is your cancellation policy?",
          answer: "Cancellation policies vary by package type and booking date. Generally, cancellations made 30+ days before travel receive a full refund (minus processing fees), 15-30 days receive 70% refund, 7-15 days receive 50% refund, and less than 7 days are non-refundable. Please check your specific package terms for details."
        },
        {
          question: "How long does it take to process a refund?",
          answer: "Refunds are typically processed within 7-10 business days after cancellation approval. The amount will be credited back to your original payment method. Processing times may vary depending on your bank or payment provider."
        },
        {
          question: "Can I reschedule my trip instead of canceling?",
          answer: "Yes, in most cases you can reschedule your trip. Rescheduling is subject to availability and may involve additional charges if the new dates have different pricing. Contact us as soon as possible to discuss rescheduling options."
        }
      ]
    },
    {
      category: "Travel & Documentation",
      questions: [
        {
          question: "Do you help with visa processing?",
          answer: "While we provide guidance on visa requirements for international destinations, we recommend consulting with official visa services or embassies for processing. We can provide necessary documentation like hotel confirmations and flight itineraries to support your visa application."
        },
        {
          question: "What documents do I need to carry?",
          answer: "Essential documents include a valid passport (for international travel), visa (if required), travel insurance, booking confirmations, and any health certificates required by your destination. We'll provide a detailed checklist before your departure."
        },
        {
          question: "Do you provide travel insurance?",
          answer: "Travel insurance is highly recommended and can be arranged through us. We offer comprehensive travel insurance plans that cover medical emergencies, trip cancellations, baggage loss, and other travel-related risks. Contact us for details."
        }
      ]
    },
    {
      category: "Packages & Pricing",
      questions: [
        {
          question: "What's included in the package price?",
          answer: "Package inclusions vary but typically include accommodation, some meals (as specified), transportation, guided tours, and activities mentioned in the itinerary. Detailed inclusions and exclusions are listed on each package page. Always review these before booking."
        },
        {
          question: "Are flights included in the package?",
          answer: "Flight inclusion depends on the specific package. Some packages include flights, while others are land-only. This information is clearly mentioned in each package description. We can also arrange flights separately if needed."
        },
        {
          question: "Do you offer group discounts?",
          answer: "Yes! We offer special discounts for group bookings. Discounts vary based on group size and package type. Contact us with your group size and travel dates for a customized quote."
        },
        {
          question: "Can I get a price match guarantee?",
          answer: "We strive to offer competitive pricing. If you find the same package at a lower price elsewhere, contact us and we'll review the offer. We may be able to match or beat the price, subject to terms and conditions."
        }
      ]
    },
    {
      category: "Support & Assistance",
      questions: [
        {
          question: "What kind of support do you provide during the trip?",
          answer: "We provide 24/7 support during your trip. Our emergency helpline is available round the clock. You'll also have access to local guides and our support team who can assist with any issues or questions during your journey."
        },
        {
          question: "How can I contact you in case of an emergency?",
          answer: "In case of emergencies, you can reach us through our 24/7 emergency helpline, WhatsApp, or email. Emergency contact numbers are provided in your booking confirmation and travel documents."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Currently, we operate through our website and WhatsApp support. However, you can access all booking information and support through our mobile-responsive website on any device."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about booking, travel, and our services
            </p>
          </div>

          {/* FAQs */}
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border-b border-border">
                      <AccordionTrigger className="text-left text-white hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Us
              </a>
              <a
                href="tel:+918588855935"
                className="inline-block border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
