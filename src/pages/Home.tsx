import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  Star,
  Compass,
  Instagram,
  Heart,
  ChefHat,
  Wheat,
  Award,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { BlurText, Magnet, ScrollReveal, AnimatedContent, SpotlightCard } from '../components/react-bits';
import { PRODUCTS, TESTIMONIALS, WHY_US_CARDS, GALLERY_ITEMS, INSTAGRAM_POSTS } from '../data/bakeryData';
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_ADDRESS,
  GOOGLE_MAPS_URL,
  GOOGLE_MAPS_EMBED_URL,
  INSTAGRAM_URL,
  getWhatsAppUrl,
  OPENING_HOURS,
} from '../config/business';

export default function Home() {
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const previewGallery = GALLERY_ITEMS.slice(0, 4);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    'name': 'MIRA & CRUMB',
    'alternateName': 'MIRA & CRUMB Atelier',
    'description': 'Artisan bakes and French pâtisserie atelier in Coimbatore, crafting slow-fermented breads, laminated croissants, and bespoke celebration cakes.',
    'url': 'https://miraandcrumb.com',
    'telephone': '+919876543210',
    'priceRange': '₹₹',
    'servesCuisine': ['French Pâtisserie', 'Artisan Bakery', 'Custom Cakes'],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Race Course Road',
      'addressLocality': 'Coimbatore',
      'addressRegion': 'Tamil Nadu',
      'postalCode': '641018',
      'addressCountry': 'IN',
    },
  };

  return (
    <div id="home-page" className="min-h-screen">
      <SEO
        title="MIRA & CRUMB | Artisan Bakes & Pâtisserie in Coimbatore"
        description="Handcrafted French pâtisserie, slow-fermented sourdoughs, laminated viennoiserie, and bespoke celebration cakes baked fresh daily in Coimbatore."
        canonicalPath="/"
        schema={homeSchema}
      />
      {/* 1. HERO SECTION (Editorial, Cinematic) */}
      <section
        id="hero-section"
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-36 bg-[#F7F3F5] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Typography & Hero Story */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-[0.25em] font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>European Pâtisserie Craft</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#292129] leading-[1.08]">
                  <BlurText
                    text={BUSINESS_NAME}
                    delay={80}
                    animateBy="words"
                    className="block text-[#4A263F] tracking-[0.05em]"
                  />
                  <BlurText
                    text={BUSINESS_TAGLINE}
                    delay={45}
                    animateBy="words"
                    className="block text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#4A263F]/80 font-normal mt-1"
                  />
                </h1>
              </div>

              <AnimatedContent distance={15} delay={0.25} duration={0.7}>
                <p className="font-sans text-base sm:text-lg lg:text-xl text-[#292129]/80 font-light leading-relaxed max-w-xl">
                  Handcrafted cakes, pastries and breads made for life's sweetest moments.
                  From dawn-baked laminated croissants to architectural wedding centerpieces.
                </p>
              </AnimatedContent>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Magnet padding={40} magnetStrength={3.5}>
                  <Link
                    to="/menu"
                    id="hero-explore-menu-cta"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#3a1d31] transition-all duration-300 shadow-md hover:shadow-xl group"
                  >
                    <span>Explore Menu</span>
                    <ArrowRight className="w-4 h-4 ml-2.5 text-[#D8C3A5] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Magnet>

                <Magnet padding={40} magnetStrength={3.5}>
                  <a
                    href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to order today's fresh bakes.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hero-order-whatsapp-cta"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-[#4A263F] bg-[#FFFFFF] text-[#4A263F] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#F7F3F5] transition-all duration-300 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 mr-2.5 text-[#4A263F]" />
                    <span>Order on WhatsApp</span>
                  </a>
                </Magnet>
              </div>

              {/* Quality Badges */}
              <div className="pt-6 sm:pt-8 border-t border-[#D8C3A5]/40 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-medium text-[#4A263F]">100%</div>
                  <div className="text-[11px] uppercase tracking-wider text-[#292129]/60 font-sans">Pure Butter & Flours</div>
                </div>
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-medium text-[#4A263F]">Daily</div>
                  <div className="text-[11px] uppercase tracking-wider text-[#292129]/60 font-sans">Fresh Small Batches</div>
                </div>
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-medium text-[#4A263F]">Bespoke</div>
                  <div className="text-[11px] uppercase tracking-wider text-[#292129]/60 font-sans">Celebration Cakes</div>
                </div>
              </div>
            </div>

            {/* Right Editorial Hero Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Champagne Framed Backdrop */}
                <div className="absolute -inset-4 sm:-inset-6 border border-[#D8C3A5] rounded-3xl -rotate-2 pointer-events-none opacity-80" />
                
                {/* Main Hero Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#FFFFFF] bg-[#FFFFFF]">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"
                    alt="MIRA & CRUMB signature artisan chocolate gateau"
                    className="w-full aspect-4/5 object-cover object-center transform hover:scale-102 transition-transform duration-700"
                    loading="eager"
                  />
                  
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#292129]/80 via-[#292129]/40 to-transparent text-[#FFFFFF]">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#D8C3A5] font-semibold block mb-1">
                      Today's Pâtisserie Highlight
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FFFFFF]">
                      Belgian Dark Chocolate & Silk Silk Cream
                    </h3>
                  </div>
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-[#FFFFFF] p-4 rounded-xl shadow-xl border border-[#D8C3A5]/60 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1e7d9] flex items-center justify-center text-[#4A263F]">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#292129] font-sans">Fresh From The Hearth</div>
                    <div className="text-[10px] text-[#B99AA8]">Warm viennoiserie every morning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BAKES (3-4 products as required by Section 8) */}
      <section id="featured-bakes-section" className="py-20 sm:py-28 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <SectionHeading
              id="featured-bakes-heading"
              subtitle="Curated Selections"
              title="Featured Daily Bakes"
              description="Our master pâtissier’s most celebrated recipes, prepared fresh each dawn using heritage flours and French butter."
              align="left"
            />
            <div className="mt-4 md:mt-0 mb-8 md:mb-12">
              <Link
                to="/menu"
                id="featured-view-full-menu-cta"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#4A263F] hover:text-[#292129] transition-colors border-b border-[#D8C3A5] pb-1"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <AnimatedContent key={product.id} delay={idx * 0.08} distance={18} duration={0.6}>
                <ProductCard product={product} />
              </AnimatedContent>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Magnet padding={35} magnetStrength={3}>
              <Link
                to="/menu"
                id="featured-bottom-menu-btn"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#3a1d31] transition-all duration-200 shadow-xs"
              >
                <span>Explore Complete Menu & Pastry List</span>
                <ArrowRight className="w-4 h-4 ml-2 text-[#D8C3A5]" />
              </Link>
            </Magnet>
          </div>
        </div>
      </section>

      {/* 3. ABOUT PREVIEW (Editorial Split-Section as required by Section 9) */}
      <section id="about-preview-section" className="py-20 sm:py-28 bg-[#F7F3F5] overflow-hidden">
        <ScrollReveal duration={0.8} distance={20} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Split Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#D8C3A5]/50">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85"
                  alt="Pastry chef folding laminated dough at MIRA & CRUMB"
                  className="w-full aspect-4/3 sm:aspect-1/1 object-cover object-center"
                />
              </div>
              {/* Subtle Decorative accent block */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 border-2 border-[#D8C3A5] rounded-2xl -z-10" />
            </div>

            {/* Split Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4A263F] font-sans block">
                Our Story & Philosophy
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#292129] leading-tight">
                Baked With Intention
              </h2>

              <div className="w-12 h-[2px] bg-[#D8C3A5]" />

              <p className="text-base sm:text-lg text-[#292129]/80 font-light leading-relaxed">
                MIRA & CRUMB was born from a timeless European principle: that baking is an architectural craft of patience, temperature, and uncompromised respect for natural ingredients.
              </p>

              <p className="text-sm sm:text-base text-[#292129]/75 font-light leading-relaxed">
                We believe in small-batch baking. We fold Normandy butter into twenty-seven delicate pastry leaves, allow sourdough cultures 36 hours of cold fermentation, and source single-origin chocolates from ethical cooperatives.
              </p>

              <div className="pt-4">
                <Magnet padding={30} magnetStrength={3}>
                  <Link
                    to="/about"
                    id="about-preview-our-story-cta"
                    className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#3a1d31] transition-all shadow-xs"
                  >
                    <span>Read Our Story</span>
                    <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
                  </Link>
                </Magnet>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. WHY MIRA & CRUMB (4 Feature Cards as required by Section 10) */}
      <section id="why-us-section" className="py-20 sm:py-28 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="why-us-heading"
            subtitle="The Artisan Standard"
            title="Why MIRA & CRUMB"
            description="Our dedication to European pâtisserie craft is felt in every crisp flake, silky ganache, and golden crust."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US_CARDS.map((card, idx) => {
              const icons = [Wheat, ChefHat, Award, Heart];
              const IconComponent = icons[idx % icons.length];
              return (
                <AnimatedContent key={card.id} delay={idx * 0.08} distance={18} duration={0.6}>
                  <SpotlightCard
                    id={`why-card-${card.id}`}
                    spotlightColor="rgba(216, 195, 165, 0.2)"
                    className="group p-8 rounded-2xl bg-[#F7F3F5] border border-[#D8C3A5]/30 hover:border-[#D8C3A5] hover:bg-[#FFFFFF] hover:shadow-[0_10px_30px_rgba(74,38,63,0.06)] transition-all duration-300 h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] group-hover:bg-[#4A263F] text-[#4A263F] group-hover:text-[#D8C3A5] border border-[#D8C3A5]/50 flex items-center justify-center mb-6 transition-colors shadow-2xs">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <span className="text-[11px] uppercase tracking-[0.2em] text-[#B99AA8] font-medium block mb-1">
                        {card.subtitle}
                      </span>

                      <h3 className="font-serif text-2xl font-medium text-[#292129] mb-3">
                        {card.title}
                      </h3>

                      <p className="text-sm text-[#292129]/70 font-light leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CUSTOM CAKE CTA BANNER ("Your Cake, Your Story") */}
      <section id="custom-cake-banner" className="py-20 sm:py-28 bg-[#4A263F] text-[#FFFFFF] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D8C3A5_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <ScrollReveal duration={0.8} distance={20} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D8C3A5] font-semibold block mb-3">
            Bespoke Celebration Commissions
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium text-[#FFFFFF] tracking-tight mb-6">
            Your Cake, Your Story
          </h2>

          <div className="w-16 h-[2px] bg-[#D8C3A5] mx-auto mb-6" />

          <p className="text-base sm:text-xl text-[#F7F3F5]/85 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            From intimate birthday dinners to sculptural multi-tier wedding centerpieces, our pastry chefs design bespoke confections tailored to your palate and celebration theme.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnet padding={35} magnetStrength={3.5}>
              <Link
                to="/custom-orders"
                id="cta-enquire-custom-cake"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#FFFFFF] transition-all duration-200 shadow-md"
              >
                <span>Design Your Custom Cake</span>
              </Link>
            </Magnet>

            <Magnet padding={35} magnetStrength={3.5}>
              <a
                href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to enquire about a custom cake for my upcoming event.")}
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-custom-cake"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#D8C3A5] text-[#FFFFFF] hover:bg-[#FFFFFF]/10 text-xs uppercase tracking-[0.18em] font-medium transition-all"
              >
                <MessageCircle className="w-4 h-4 inline mr-2 text-[#D8C3A5]" />
                <span>Enquire on WhatsApp</span>
              </a>
            </Magnet>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. TESTIMONIALS (Section 19) */}
      <section id="testimonials-section" className="py-20 sm:py-28 bg-[#F7F3F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="testimonials-heading"
            subtitle="Words From Patrons"
            title="Celebrated Moments"
            description="Kind reviews from wedding couples, private dinner hosts, and our morning regulars."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <AnimatedContent key={t.id} delay={idx * 0.08} distance={15} duration={0.6}>
                <div
                  id={`testimonial-${t.id}`}
                  className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#D8C3A5]/40 shadow-xs flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center space-x-1 mb-4 text-[#D8C3A5]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="font-serif italic text-[#292129] text-base leading-relaxed mb-6">
                      "{t.quote}"
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-[#f0e8ed]">
                    <div className="font-semibold text-xs tracking-wider uppercase text-[#4A263F]">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-[#292129]/60 font-light mt-0.5">
                      {t.occasion}
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>

          <div className="mt-8 text-center">
            <span className="inline-block text-[11px] uppercase tracking-wider text-[#B99AA8] bg-[#FFFFFF] px-4 py-1.5 rounded-full border border-[#D8C3A5]/30">
              Demo Testimonials for Prototype Showcase
            </span>
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW (Section 18 Snapshot) */}
      <section id="gallery-preview-section" className="py-20 sm:py-28 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeading
              id="gallery-preview-heading"
              subtitle="Visual Anthology"
              title="The Pâtisserie Gallery"
              description="A photographic glance into our confectionery atelier, from delicate sugar flowers to hearth-baked crusts."
              align="left"
            />
            <div className="mt-4 md:mt-0 mb-8 md:mb-12">
              <Link
                to="/gallery"
                id="gallery-preview-all-cta"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#4A263F] hover:text-[#292129] transition-colors border-b border-[#D8C3A5] pb-1"
              >
                <span>View Full Gallery ({GALLERY_ITEMS.length} Photos)</span>
                <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewGallery.map((item, idx) => (
              <AnimatedContent key={item.id} delay={idx * 0.08} distance={15} duration={0.6}>
                <Link
                  to="/gallery"
                  className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-[#F7F3F5] border border-[#D8C3A5]/40 block"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#292129]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-[#FFFFFF]">
                    <span className="text-[10px] uppercase tracking-widest text-[#D8C3A5] font-semibold mb-1">
                      {item.categoryLabel}
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#FFFFFF] leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM / SOCIAL SECTION (Section 20) */}
      <section id="instagram-section" className="py-20 sm:py-24 bg-[#F7F3F5] border-t border-[#D8C3A5]/30">
        <ScrollReveal duration={0.8} distance={20} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4A263F] block mb-2">
              Follow Our Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#292129] mb-3">
              @miraandcrumb
            </h2>
            <p className="text-sm text-[#292129]/75 font-light">
              Follow us on Instagram for daily oven reveals, behind-the-scenes lamination, and seasonal menu previews.
            </p>
            <div className="mt-4">
              <Magnet padding={25} magnetStrength={3}>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="home-instagram-follow-cta"
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#FFFFFF] border border-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#4A263F] hover:text-[#FFFFFF] transition-all shadow-2xs"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow @miraandcrumb</span>
                </a>
              </Magnet>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {INSTAGRAM_POSTS.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-[#FFFFFF] border border-[#D8C3A5]/30 shadow-2xs"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#4A263F]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center text-[#FFFFFF]">
                  <Instagram className="w-5 h-5 text-[#D8C3A5] mb-2" />
                  <span className="text-[11px] font-sans font-medium">{post.likes} likes</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 9. VISIT US / LOCATION & GOOGLE MAPS (Section 21) */}
      <section id="visit-us-section" className="py-20 sm:py-28 bg-[#FFFFFF]">
        <ScrollReveal duration={0.8} distance={20} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Store Information */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4A263F] block">
                Pâtisserie Atelier
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#292129]">
                Visit Our Coimbatore Boutique
              </h2>

              <div className="w-12 h-[2px] bg-[#D8C3A5]" />

              <p className="text-base text-[#292129]/80 font-light leading-relaxed">
                Step into our fragrant boutique where warm viennoiserie, artisan sourdough loaves, and chilled dessert showcases await your morning discovery.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#4A263F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-[#292129] block">Address</strong>
                    <span className="text-sm text-[#292129]/75">{BUSINESS_ADDRESS}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#4A263F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-[#292129] block">Bakehouse Hours</strong>
                    <div className="text-xs text-[#292129]/75 space-y-1 mt-1">
                      {OPENING_HOURS.map((h) => (
                        <div key={h.days} className="flex space-x-4">
                          <span className="w-32">{h.days}:</span>
                          <span className="font-medium text-[#4A263F]">{h.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Magnet padding={25} magnetStrength={3}>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="home-get-directions-cta"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-all shadow-xs"
                  >
                    <Compass className="w-4 h-4 text-[#D8C3A5]" />
                    <span>Get Directions</span>
                  </a>
                </Magnet>

                <Magnet padding={25} magnetStrength={3}>
                  <Link
                    to="/contact"
                    id="home-contact-details-cta"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-[#D8C3A5] bg-[#FFFFFF] text-[#4A263F] text-xs uppercase tracking-widest font-medium hover:bg-[#F7F3F5] transition-all"
                  >
                    <span>Contact Page</span>
                  </Link>
                </Magnet>
              </div>
            </div>

            {/* Visual Google Maps Embed / Representation */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-[#D8C3A5] shadow-xl bg-[#F7F3F5] aspect-16/10">
                <iframe
                  title="MIRA & CRUMB Boutique Location Map"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Overlay Card with Quick Directions Link */}
                <div className="absolute top-4 left-4 bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#D8C3A5]/60 max-w-xs">
                  <div className="font-serif font-semibold text-sm text-[#4A263F]">
                    {BUSINESS_NAME}
                  </div>
                  <div className="text-[11px] text-[#292129]/75 mt-0.5">
                    {BUSINESS_ADDRESS}
                  </div>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold text-[#4A263F] hover:underline"
                  >
                    Open in Google Maps &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 10. CONTACT CTA BANNER (Home flow final invitation) */}
      <section id="home-contact-cta-banner" className="py-16 bg-[#F7F3F5] border-t border-[#D8C3A5]/40 text-center">
        <ScrollReveal duration={0.7} distance={15} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292129] mb-3">
            Have an Upcoming Celebration or Special Request?
          </h3>
          <p className="text-sm sm:text-base text-[#292129]/75 font-light mb-8 max-w-xl mx-auto">
            Reach out through our online enquiry form or connect directly with our pâtisserie team on WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Magnet padding={25} magnetStrength={3}>
              <Link
                to="/contact"
                id="banner-contact-us-btn"
                className="px-7 py-3 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors shadow-xs inline-block"
              >
                Send Website Enquiry
              </Link>
            </Magnet>
            <Magnet padding={25} magnetStrength={3}>
              <a
                href={getWhatsAppUrl("Hi MIRA & CRUMB, I have an enquiry regarding your bakes.")}
                target="_blank"
                rel="noopener noreferrer"
                id="banner-whatsapp-chat-btn"
                className="px-7 py-3 rounded-full border border-[#D8C3A5] bg-[#FFFFFF] text-[#4A263F] text-xs uppercase tracking-widest font-medium hover:bg-[#D8C3A5]/20 transition-colors inline-block"
              >
                <MessageCircle className="w-4 h-4 inline mr-2 text-[#4A263F]" />
                <span>Chat on WhatsApp</span>
              </a>
            </Magnet>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
