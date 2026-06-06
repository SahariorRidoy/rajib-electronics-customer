"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Truck, Headphones, Zap, Wrench, MapPin, Clock, Star, Users } from "lucide-react";
import { usePublicSettings } from "@/hooks/usePublicSettings";

export default function AboutPage() {
  const { siteName } = usePublicSettings();

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-cyan-50 text-[#167389]">

      {/* Hero Section */}
      <section className="px-6 py-16 sm:py-20 lg:py-24 bg-linear-to-br from-[#167389] to-cyan-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-cyan-200">{siteName}</span>
          </h1>
          <p className="text-cyan-100 text-base sm:text-lg leading-relaxed">
            Your trusted destination for <strong className="text-white">electronics & gadgets</strong>,{" "}
            <strong className="text-white">home appliances</strong>, and{" "}
            <strong className="text-white">tech accessories</strong> — all in one place. We bring
            quality technology and innovation to your doorstep across Bangladesh.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { icon: Users, label: "Happy Customers", value: "10,000+" },
              { icon: Star, label: "Products", value: "500+" },
              { icon: Truck, label: "Cities Covered", value: "64" },
              { icon: Clock, label: "Years of Trust", value: "5+" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center bg-white/10 rounded-2xl px-6 py-4 min-w-[110px]">
                <Icon className="w-6 h-6 mb-1 text-cyan-200" />
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xs text-cyan-200">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#167389]">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>{siteName}</strong> was founded with a simple goal — to make genuine, high-quality
              electronics accessible to every household in Bangladesh. Starting as a small local shop,
              we have grown into a trusted online electronics store serving customers across all 64 districts.
              From the latest smartphones and laptops to home appliances and accessories, we stock everything
              a modern tech-savvy customer needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="px-6 py-16 bg-cyan-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#167389]">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At <strong>{siteName}</strong>, our mission is to make quality electronics and the latest
              technology accessible to everyone in Bangladesh. We work with verified suppliers and top
              brands to deliver 100% genuine products — safely, quickly, and at the best prices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe technology should empower people. That&apos;s why we carefully curate every product
              in our catalog — ensuring it meets our strict standards for quality, performance, and value.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#167389]">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To become Bangladesh&apos;s most trusted electronics retailer — known for authenticity,
              affordability, and exceptional customer service.
            </p>
            <ul className="space-y-3">
              {[
                "Offer the widest range of genuine electronics",
                "Provide fast, reliable delivery nationwide",
                "Build long-term relationships with our customers",
                "Support local tech enthusiasts and professionals",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-20 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#167389] mb-12">
          Why Choose Us
        </h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            {
              icon: Cpu,
              title: "Genuine Electronics",
              desc: "100% authentic products sourced directly from trusted brands and distributors.",
            },
            {
              icon: Zap,
              title: "Latest Technology",
              desc: "Stay ahead with the newest gadgets, appliances, and tech accessories.",
            },
            {
              icon: ShieldCheck,
              title: "Quality Guaranteed",
              desc: "Every product is verified and quality-checked before reaching you.",
            },
            {
              icon: Truck,
              title: "Fast & Reliable Delivery",
              desc: "Quick nationwide delivery right to your doorstep.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-6 hover:shadow-md transition-all"
            >
              <Icon className="w-10 h-10 text-cyan-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-[#167389]">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What We Sell */}
      <section className="px-6 py-16 bg-cyan-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#167389] mb-4">What We Sell</h2>
          <p className="text-gray-600 mb-8">A wide range of electronics for every need and budget.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              "Smartphones & Tablets",
              "Laptops & Computers",
              "Home Appliances",
              "TV & Audio",
              "Cameras & Photography",
              "Accessories & Cables",
              "Gaming & Consoles",
              "Smart Home Devices",
              "Power & Charging",
            ].map((cat) => (
              <div key={cat} className="bg-white rounded-xl border border-cyan-100 px-4 py-3 text-sm font-medium text-[#167389] shadow-sm">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-cyan-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#167389] mb-1">Our Location</h3>
              <p className="text-gray-600 text-sm">Serving customers across all 64 districts of Bangladesh with fast home delivery.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-cyan-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#167389] mb-1">Business Hours</h3>
              <p className="text-gray-600 text-sm">Saturday – Thursday: 9:00 AM – 9:00 PM<br />Friday: 2:00 PM – 9:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Promise */}
      <section className="px-6 py-16 bg-linear-to-br from-[#167389] to-cyan-700 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            <Headphones className="w-10 h-10 text-cyan-200" />
            <Wrench className="w-10 h-10 text-cyan-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Promise to You</h2>
          <p className="text-cyan-100 leading-relaxed text-base sm:text-lg mb-8">
            Whether you&apos;re a tech enthusiast, a professional, or shopping for your home — we promise
            genuine products, competitive prices, and dedicated after-sales support. Your satisfaction
            and trust drive everything we do.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-white text-[#167389] font-semibold rounded-xl hover:bg-cyan-50 transition-all"
          >
            Explore Our Products
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-[#167389] text-white text-center py-8">
        <p className="text-sm">
          © {new Date().getFullYear()} {siteName} — Your Trusted Electronics Store in Bangladesh ⚡
        </p>
      </footer>
    </main>
  );
}
