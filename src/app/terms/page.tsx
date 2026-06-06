"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, RefreshCw, Truck, CreditCard, AlertCircle, Mail } from "lucide-react";
import { usePublicSettings } from "@/hooks/usePublicSettings";

const sections = [
  {
    icon: ShieldCheck,
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using our website and placing orders, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.",
  },
  {
    icon: FileText,
    title: "2. Products & Availability",
    content:
      "We strive to keep all product listings accurate and up to date. However, product availability, prices, and specifications may change without prior notice. We reserve the right to limit quantities or discontinue any product at any time.",
  },
  {
    icon: CreditCard,
    title: "3. Orders & Payments",
    content:
      "All orders are subject to acceptance and availability. We accept cash on delivery (COD) and online payment methods. Once an order is confirmed, you will receive a confirmation via phone or email. We reserve the right to cancel any order in case of pricing errors or stock unavailability.",
  },
  {
    icon: Truck,
    title: "4. Shipping & Delivery",
    content:
      "We deliver across all 64 districts of Bangladesh. Delivery times may vary depending on your location. We are not responsible for delays caused by courier services, natural disasters, or other circumstances beyond our control. Shipping charges, if any, will be clearly shown at checkout.",
  },
  {
    icon: RefreshCw,
    title: "5. Returns & Refunds",
    content:
      "We accept returns within 7 days of delivery for defective or damaged products. The item must be unused, in its original packaging, and accompanied by proof of purchase. Refunds will be processed within 5–7 business days after the returned item is received and inspected. We do not accept returns for change of mind.",
  },
  {
    icon: AlertCircle,
    title: "6. Limitation of Liability",
    content:
      "We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific product in question.",
  },
  {
    icon: ShieldCheck,
    title: "7. Privacy",
    content:
      "Your personal information is collected solely for order processing and customer support purposes. We do not sell or share your data with third parties. By using our site, you consent to our data practices as described in our Privacy Policy.",
  },
  {
    icon: FileText,
    title: "8. Changes to Terms",
    content:
      "We reserve the right to update or modify these Terms of Service at any time without prior notice. Continued use of our website after any changes constitutes your acceptance of the new terms. Please review this page periodically.",
  },
];

export default function TermsPage() {
  const { siteName } = usePublicSettings();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50 text-[#167389]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#167389] to-cyan-700 text-white text-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-cyan-200" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-cyan-100 text-sm sm:text-base">
            Please read these terms carefully before using <strong className="text-white">{siteName}</strong>.
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </motion.div>
      </section>

      {/* Sections */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map(({ icon: Icon, title, content }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-cyan-600 shrink-0" />
                <h2 className="text-lg font-bold text-[#167389]">{title}</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-12 bg-white text-center">
        <Mail className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#167389] mb-2">Have Questions?</h2>
        <p className="text-gray-600 text-sm mb-6">
          If you have any questions about these terms, feel free to contact us.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-[#167389] text-white font-semibold rounded-xl hover:bg-cyan-700 transition-all"
        >
          Contact Us
        </Link>
      </section>

      <footer className="bg-[#167389] text-white text-center py-6">
        <p className="text-sm">© {new Date().getFullYear()} {siteName} — All rights reserved.</p>
      </footer>
    </main>
  );
}
