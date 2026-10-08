import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

import founderImg from "../assets/images/founder.jpg";

const About = () => {
  return (
    <div className="bg-white text-neutral-800">
      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-5">
                Our Story
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-tight text-neutral-900">
                More than hair.
                <span className="block text-pink-600">
                  A journey that started in 2011.
                </span>
              </h1>

              <p className="mt-7 text-base sm:text-lg leading-8 text-neutral-600 max-w-xl">
                Dara Hair was born from a passion for beauty that started long
                before the business itself. From hairstyling and braiding to
                selling braided wigs online, every chapter has shaped the brand
                we are building today.
              </p>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-7 py-3.5 rounded-full font-medium transition"
                >
                  Shop Our Collection
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full -z-0" />

              <div className="relative z-10 overflow-hidden rounded-[2rem]">
                <img
                  src={founderImg}
                  alt="Dara Hair founder"
                  className="w-full h-[480px] sm:h-[560px] object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white shadow-xl rounded-2xl px-6 py-5 z-20">
                <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold">
                  Since
                </p>
                <p className="text-3xl font-serif font-semibold text-neutral-900">
                  2011
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          INTRO
      ========================== */}
      <section className="bg-pink-50">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-5">
            The Dara Hair Story
          </p>

          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-neutral-900 mb-7">
            A passion that became a business
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-8">
            Dara Hair has always been part of my story. What started as a
            practical skill eventually became a passion, and that passion
            eventually became a business. The journey has evolved over the
            years, but the love for hair and beauty has remained at the heart
            of it all.
          </p>
        </div>
      </section>

      {/* =========================
          TIMELINE
      ========================== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-4">
              Our Journey
            </p>

            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-neutral-900">
              From passion to purpose
            </h2>

            <p className="mt-5 text-neutral-600 max-w-2xl mx-auto leading-7">
              Every chapter brought Dara Hair closer to becoming the brand it
              is today.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* 2011 */}
            <div className="relative bg-white border border-pink-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <Heart className="text-pink-600" size={21} />
              </div>

              <p className="text-3xl font-serif font-semibold text-pink-600 mb-3">
                2011
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                The Beginning
              </h3>

              <p className="text-sm leading-7 text-neutral-600">
                The journey began with learning hairdressing and developing
                practical experience as a hairstylist and braider.
              </p>
            </div>

            {/* 2019 */}
            <div className="relative bg-white border border-pink-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <Sparkles className="text-pink-600" size={21} />
              </div>

              <p className="text-3xl font-serif font-semibold text-pink-600 mb-3">
                2019
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                The Idea
              </h3>

              <p className="text-sm leading-7 text-neutral-600">
                During NYSC, the idea of selling hair began to take shape,
                starting with braided wigs.
              </p>
            </div>

            {/* 2021 */}
            <div className="relative bg-white border border-pink-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <Users className="text-pink-600" size={21} />
              </div>

              <p className="text-3xl font-serif font-semibold text-pink-600 mb-3">
                2021
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                The Decision
              </h3>

              <p className="text-sm leading-7 text-neutral-600">
                While working at UBA, the decision was made to turn that
                long-standing passion for hair into a business.
              </p>
            </div>

            {/* 2022 */}
            <div className="relative bg-white border border-pink-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <ShieldCheck className="text-pink-600" size={21} />
              </div>

              <p className="text-3xl font-serif font-semibold text-pink-600 mb-3">
                2022
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Officially Registered
              </h3>

              <p className="text-sm leading-7 text-neutral-600">
                Dara Hair was officially registered as a business, marking an
                important new chapter in the journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FULL STORY
      ========================== */}
      <section className="bg-pink-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-5">
                How It Started
              </p>

              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-neutral-900 leading-tight mb-7">
                From making hair to building a hair brand
              </h2>

              <div className="space-y-5 text-neutral-600 leading-8">
                <p>
                  In 2011, I went to learn hairdressing. While I was in school,
                  I worked as a hairstylist and braider. Hair was already a
                  meaningful part of my life, and I enjoyed the creativity and
                  confidence that came with helping women look and feel
                  beautiful.
                </p>

                <p>
                  In 2019, while I was serving, the idea of buying and selling
                  hair started to grow. At that time, I began with braided
                  wigs, taking the first steps towards turning my experience
                  with hair into something bigger.
                </p>

                <p>
                  By 2021, while working as a contract staff at UBA, I started
                  thinking seriously about my future. I knew I could not
                  continue doing the same job forever. There was a business
                  that had been part of me for years, and I knew it was time to
                  give it a real chance.
                </p>

                <p>
                  I realized that I didn't necessarily have to continue making
                  people's hair. Instead, I could take everything I had learned
                  and loved about hair and turn it into a business focused on
                  selling wigs and hair.
                </p>

                <p>
                  And that was how Dara Hair began its journey as an online
                  hair business. In 2022, the business was officially
                  registered, giving the dream an even stronger foundation.
                </p>

                <p className="font-medium text-neutral-800">
                  Today, Dara Hair continues to grow from that same passion —
                  with a commitment to helping women find hair that makes them
                  feel beautiful, confident, and completely themselves.
                </p>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 md:p-12 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-7">
                <Heart className="text-pink-600" size={24} />
              </div>

              <p className="text-2xl sm:text-3xl font-serif leading-relaxed text-neutral-900">
                "What started as a skill became a passion, and that passion
                became a business."
              </p>

              <div className="mt-8 pt-6 border-t border-pink-100">
                <p className="font-semibold text-neutral-900">Dara</p>
                <p className="text-sm text-pink-600 mt-1">
                  Founder, Dara Hair
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          VALUES
      ========================== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-4">
              What We Believe
            </p>

            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-neutral-900">
              More than just hair
            </h2>

            <p className="mt-5 text-neutral-600 leading-7">
              Dara Hair is built around the belief that the right hair can be
              more than an accessory — it can be part of how you express
              yourself and how you feel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quality */}
            <div className="text-center p-7 rounded-2xl bg-pink-50">
              <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-5">
                <Sparkles className="text-pink-600" size={23} />
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Quality
              </h3>

              <p className="text-sm text-neutral-600 leading-7">
                We believe you deserve beautiful hair and products that give
                you value.
              </p>
            </div>

            {/* Confidence */}
            <div className="text-center p-7 rounded-2xl bg-pink-50">
              <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-5">
                <Heart className="text-pink-600" size={23} />
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Confidence
              </h3>

              <p className="text-sm text-neutral-600 leading-7">
                We want every woman to feel confident and beautiful in the hair
                she chooses.
              </p>
            </div>

            {/* Customer Care */}
            <div className="text-center p-7 rounded-2xl bg-pink-50">
              <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-5">
                <Users className="text-pink-600" size={23} />
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Customer Care
              </h3>

              <p className="text-sm text-neutral-600 leading-7">
                Every customer matters, and we aim to make every experience
                personal and enjoyable.
              </p>
            </div>

            {/* Growth */}
            <div className="text-center p-7 rounded-2xl bg-pink-50">
              <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-5">
                <ShieldCheck className="text-pink-600" size={23} />
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Growth
              </h3>

              <p className="text-sm text-neutral-600 leading-7">
                From learning hairdressing in 2011 to building a registered
                business, growth remains part of our story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FOUNDER
      ========================== */}
      <section className="bg-pink-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Founder Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -bottom-5 -right-5 w-36 h-36 bg-pink-200 rounded-full" />

              <div className="relative z-10 overflow-hidden rounded-[2rem] bg-white p-3">
                <img
                  src={founderImg}
                  alt="Dara, founder of Dara Hair"
                  className="w-full h-[500px] sm:h-[600px] object-cover rounded-[1.5rem]"
                />
              </div>
            </div>

            {/* Founder Text */}
            <div className="order-1 lg:order-2">
              <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-5">
                Meet the Founder
              </p>

              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-neutral-900 mb-3">
                Dara
              </h2>

              <p className="text-pink-600 font-medium mb-7">
                Founder, Dara Hair
              </p>

              <div className="space-y-5 text-neutral-600 leading-8">
                <p>
                  Dara's journey in the beauty industry began in 2011 when she
                  learned hairdressing and started working as a hairstylist and
                  braider while in school.
                </p>

                <p>
                  Years later, her experience and passion for hair inspired
                  her to explore a new direction — building a business around
                  wigs and hair rather than only styling them.
                </p>

                <p>
                  From starting with braided wigs to officially registering
                  Dara Hair in 2022, the journey has been one of courage,
                  growth, and staying true to a passion that had been there
                  from the beginning.
                </p>

                <p className="font-medium text-neutral-800">
                  Today, Dara Hair continues to grow with the same purpose:
                  helping women discover hair that makes them feel beautiful,
                  confident, and ready to show up as themselves.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700 transition"
                >
                  Explore Dara Hair
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PROMISE
      ========================== */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-5">
            The Dara Hair Promise
          </p>

          <h2 className="text-3xl md:text-5xl font-serif font-semibold text-neutral-900 leading-tight">
            Beautiful hair.
            <span className="block text-pink-600">
              Thoughtful service.
            </span>
            Confidence in every look.
          </h2>

          <p className="mt-7 text-neutral-600 leading-8 max-w-2xl mx-auto">
            Thank you for being part of our journey. Whether you're discovering
            Dara Hair for the first time or you've been with us from the
            beginning, we're grateful to have you here.
          </p>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto bg-pink-600 rounded-[2rem] px-7 sm:px-10 md:px-16 py-14 md:py-20 text-center">
          <p className="text-pink-100 text-sm uppercase tracking-[0.3em] font-semibold mb-5">
            Your next look awaits
          </p>

          <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white leading-tight">
            Find the hair that feels like you.
          </h2>

          <p className="mt-5 text-pink-100 max-w-xl mx-auto leading-7">
            Explore our collection of wigs and hair extensions and discover
            your next favorite look.
          </p>

          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 px-8 py-3.5 rounded-full font-semibold transition"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;