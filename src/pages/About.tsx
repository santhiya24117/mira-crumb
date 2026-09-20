import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChefHat, Wheat, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import { getWhatsAppUrl } from '../config/business';
import { BlurText, Magnet, ScrollReveal, AnimatedContent, SpotlightCard } from '../components/react-bits';

export default function About() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'Our Story & Philosophy',
    'description': 'The story and culinary philosophy of MIRA & CRUMB pâtisserie atelier in Coimbatore.',
    'mainEntity': {
      '@type': 'Bakery',
      'name': 'MIRA & CRUMB',
      'foundingLocation': 'Coimbatore, India',
      'knowsAbout': ['French Pastry', 'Sourdough Fermentation', 'Viennoiserie Lamination', 'Bespoke Cake Design'],
    },
  };

  const philosophyPoints = [
    {
      title: 'Small-Batch Production',
      desc: 'We never bake in industrial volumes. Everything is proportioned for small hearth decks where each loaf and pastry receives individual baker observation.',
    },
    {
      title: '36-Hour Cold Fermentation',
      desc: 'Time is our most indispensable ingredient. Natural wild yeast development creates incomparable digestible crumb depth and crisp blistered crusts.',
    },
    {
      title: 'Normandy Churned Butter',
      desc: 'Lamination requires high-fat, cultured butter with the proper elasticity to yield crisp, distinct honeycomb layers without heaviness.',
    },
    {
      title: 'Ethical Single-Origin Cacao',
      desc: 'From 70% dark Belgian couvertures to Peruvian organic beans, our chocolate profiles balance floral acidity with silky ganache texture.',
    },
  ];

  return (
    <div id="about-page" className="pt-28 sm:pt-36 pb-20 bg-[#F7F3F5]">
      <SEO
        title="Our Story & Philosophy | MIRA & CRUMB Atelier"
        description="Discover the story of MIRA & CRUMB in Coimbatore: European baking tradition, Normandy butter lamination, and slow 36-hour wild-yeast fermentation."
        canonicalPath="/about"
        schema={aboutSchema}
      />
      {/* Editorial Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 text-center">
        <ScrollReveal duration={0.8} distance={15}>
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#4A263F] block mb-3">
            Atelier Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#292129] tracking-tight leading-tight max-w-4xl mx-auto">
            <BlurText text="The Art of Intentional Pâtisserie" delay={60} animateBy="words" />
          </h1>
          <div className="w-16 h-[2px] bg-[#D8C3A5] mx-auto my-6" />
          <p className="text-base sm:text-xl font-light text-[#292129]/80 max-w-2xl mx-auto leading-relaxed">
            Founded on the quiet belief that great baking requires architectural patience, sensory devotion, and deep respect for unadulterated ingredients.
          </p>
        </ScrollReveal>
      </section>

      {/* Main Story Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <ScrollReveal duration={0.8} distance={20}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#D8C3A5]">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"
                  alt="Baker shaping loaves at MIRA & CRUMB"
                  className="w-full aspect-4/3 object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#FFFFFF] p-4 rounded-xl shadow-lg border border-[#D8C3A5]/60 hidden sm:flex items-center space-x-3">
                <ChefHat className="w-6 h-6 text-[#4A263F]" />
                <div className="text-xs font-serif italic text-[#292129]">
                  "Every morning is a renewal of precision."
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4A263F] block">
                Our Journey
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#292129]">
                From Hearth Dawn to Afternoon Tea
              </h2>
              <div className="w-10 h-[2px] bg-[#D8C3A5]" />
              <p className="text-base text-[#292129]/80 font-light leading-relaxed">
                MIRA & CRUMB began with a single mission: to return baking to its artisanal European roots. We reject the rushed shortcuts of modern commercial bakeries in favor of slow fermentation, precise dough temperature control, and classical French lamination.
              </p>
              <p className="text-sm sm:text-base text-[#292129]/75 font-light leading-relaxed">
                Whether rolling delicate croissants that crackle upon first touch, scoring wild-ferment sourdough loaves, or sculpting floral tiered gateaux for momentous celebrations, every piece that leaves our ovens is an invitation to pause and savor.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Magnet padding={25} magnetStrength={3}>
                  <Link
                    to="/menu"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors shadow-xs"
                  >
                    <span>View The Menu</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-[#D8C3A5]" />
                  </Link>
                </Magnet>
                <Magnet padding={25} magnetStrength={3}>
                  <Link
                    to="/custom-orders"
                    className="inline-flex items-center px-6 py-3 rounded-full border border-[#D8C3A5] bg-[#FFFFFF] text-[#4A263F] text-xs uppercase tracking-widest font-medium hover:bg-[#F7F3F5] transition-colors shadow-2xs"
                  >
                    <span>Bespoke Cake Commissions</span>
                  </Link>
                </Magnet>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Philosophy Grid */}
      <section className="bg-[#FFFFFF] py-20 sm:py-28 border-y border-[#D8C3A5]/40 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="The Principles"
            title="Four Pillars of Our Craft"
            description="Our non-negotiable standards of quality that guide every bake from dawn to dusk."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophyPoints.map((point, idx) => (
              <AnimatedContent key={point.title} delay={idx * 0.1} distance={15} duration={0.6}>
                <SpotlightCard
                  spotlightColor="rgba(216, 195, 165, 0.25)"
                  className="p-8 rounded-2xl bg-[#F7F3F5] border border-[#D8C3A5]/40 flex items-start space-x-5 h-full"
                >
                  <div className="w-10 h-10 rounded-full bg-[#4A263F] text-[#D8C3A5] flex items-center justify-center shrink-0 mt-1 font-serif text-lg font-semibold">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-[#292129] mb-2">
                      {point.title}
                    </h3>
                    <p className="text-sm text-[#292129]/75 font-light leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </SpotlightCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier Interior & Atmosphere */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <ScrollReveal duration={0.8} distance={20}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4A263F] block">
                The Space
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#292129]">
                An Oasis of Warmth and Aroma
              </h2>
              <div className="w-10 h-[2px] bg-[#D8C3A5]" />
              <p className="text-base text-[#292129]/80 font-light leading-relaxed">
                Designed with Carrara marble, warm natural timber, and hand-patinated brass accents, our boutique offers a contemplative retreat from the bustle of the city.
              </p>
              <p className="text-sm sm:text-base text-[#292129]/75 font-light leading-relaxed">
                Join us for a morning flat white paired with a warm cardamom twist, or consult with our confectioners in the bespoke salon to curate your wedding cake tasting.
              </p>
              <div className="pt-2">
                <Magnet padding={25} magnetStrength={3}>
                  <a
                    href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to ask a question about your bakery.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[#D8C3A5]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </Magnet>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#D8C3A5]/60">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85"
                  alt="Inside the MIRA & CRUMB bakery boutique"
                  className="w-full aspect-4/3 object-cover object-center"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#4A263F] text-[#FFFFFF] py-16 text-center">
        <ScrollReveal duration={0.8} distance={15} className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#FFFFFF] mb-4">
            Experience Our Daily Bakes
          </h2>
          <p className="text-sm sm:text-base text-[#F7F3F5]/80 font-light mb-8 max-w-xl mx-auto">
            Freshly pulled from the oven every morning at 07:30. View our current selection or submit a custom cake consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Magnet padding={25} magnetStrength={3}>
              <Link
                to="/menu"
                className="px-7 py-3 rounded-full bg-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#FFFFFF] transition-colors shadow-md inline-block"
              >
                Explore Full Menu
              </Link>
            </Magnet>
            <Magnet padding={25} magnetStrength={3}>
              <Link
                to="/custom-orders"
                className="px-7 py-3 rounded-full border border-[#D8C3A5] text-[#FFFFFF] text-xs uppercase tracking-widest font-medium hover:bg-[#FFFFFF]/10 transition-colors inline-block"
              >
                Custom Cake Enquiry
              </Link>
            </Magnet>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
