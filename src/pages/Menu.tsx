import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Filter, ArrowRight, Info } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import { BlurText, Magnet, ScrollReveal, AnimatedContent } from '../components/react-bits';
import { PRODUCTS } from '../data/bakeryData';
import { ProductCategory } from '../types';
import { getWhatsAppUrl } from '../config/business';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProductCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  const menuSchema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    'name': 'MIRA & CRUMB Artisan Pâtisserie Menu',
    'description': 'Daily handcrafted French pastries, sourdough loaves, and celebration entremets.',
    'hasMenuSection': [
      {
        '@type': 'MenuSection',
        'name': 'Cakes & Entremets',
        'description': 'Layered celebration cakes and French entremets.',
      },
      {
        '@type': 'MenuSection',
        'name': 'Viennoiserie & Pastries',
        'description': 'Laminated butter croissants, pain au chocolat, and seasonal tarts.',
      },
      {
        '@type': 'MenuSection',
        'name': 'Artisan Breads',
        'description': 'Wild yeast fermented hearth sourdough and rustic baguettes.',
      },
    ],
  };

  const categories: { id: 'all' | ProductCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Creations', count: PRODUCTS.length },
    { id: 'cakes', label: 'Cakes & Entremets', count: PRODUCTS.filter((p) => p.category === 'cakes').length },
    { id: 'pastries', label: 'Viennoiserie & Pastries', count: PRODUCTS.filter((p) => p.category === 'pastries').length },
    { id: 'breads', label: 'Artisan Breads', count: PRODUCTS.filter((p) => p.category === 'breads').length },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesDietary =
      dietaryFilter === 'all' || (product.dietary && product.dietary.includes(dietaryFilter));
    return matchesCategory && matchesDietary;
  });

  return (
    <div id="menu-page" className="pt-28 sm:pt-36 pb-24 bg-[#F7F3F5] min-h-screen">
      <SEO
        title="Artisan Menu & Pâtisserie Creations | MIRA & CRUMB Atelier"
        description="Browse the daily artisan menu of MIRA & CRUMB: celebration entremets, buttery viennoiserie, fruit tarts, and slow-fermented artisan sourdough breads."
        canonicalPath="/menu"
        schema={menuSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#4A263F] block mb-3">
            Handmade Daily
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#292129] tracking-tight mb-4">
            <BlurText text="The Pâtisserie Menu" delay={60} animateBy="words" />
          </h1>
          <div className="w-16 h-[2px] bg-[#D8C3A5] mx-auto my-5" />
          <p className="text-base sm:text-lg text-[#292129]/75 font-light leading-relaxed">
            Every item is freshly prepared each morning. Click any creation to enquire about immediate availability, reserve morning batches, or arrange boutique collection via WhatsApp.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                id={`filter-tab-${cat.id}`}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#4A263F] text-[#FFFFFF] shadow-md -translate-y-0.5'
                    : 'bg-[#FFFFFF] text-[#292129]/80 border border-[#D8C3A5]/50 hover:border-[#D8C3A5] hover:text-[#4A263F]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#D8C3A5] text-[#4A263F]' : 'bg-[#F7F3F5] text-[#B99AA8]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Dietary Filter */}
        <div className="flex items-center justify-center space-x-2 mb-12 text-xs text-[#292129]/70">
          <span className="text-[11px] uppercase tracking-wider text-[#B99AA8] font-semibold">Dietary Preference:</span>
          {['all', 'Vegetarian', 'Vegan'].map((diet) => (
            <button
              key={diet}
              onClick={() => setDietaryFilter(diet)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                dietaryFilter === diet
                  ? 'bg-[#D8C3A5] text-[#4A263F] font-semibold'
                  : 'bg-[#FFFFFF] text-[#292129]/70 hover:text-[#4A263F] border border-[#D8C3A5]/30'
              }`}
            >
              {diet === 'all' ? 'Show All' : diet}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-dashed border-[#D8C3A5] max-w-xl mx-auto p-8">
            <p className="font-serif text-xl text-[#292129] mb-2">No creations found in this category</p>
            <p className="text-sm text-[#292129]/60 font-light mb-4">
              Try resetting your dietary preference to see all artisan selections.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietaryFilter('all');
              }}
              className="px-5 py-2 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <AnimatedContent key={product.id} delay={Math.min(idx * 0.05, 0.4)} distance={15} duration={0.5}>
                <ProductCard product={product} />
              </AnimatedContent>
            ))}
          </div>
        )}

        {/* Ordering Notice & Bespoke Cake Banner */}
        <ScrollReveal duration={0.8} distance={20} className="mt-20">
          <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 border border-[#D8C3A5] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#4A263F] font-semibold">
                  <Info className="w-4 h-4 text-[#D8C3A5]" />
                  <span>Custom Celebrations & Pre-Orders</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292129]">
                  Seeking a Bespoke Tiered Celebration Cake?
                </h3>
                <p className="text-sm sm:text-base text-[#292129]/75 font-light leading-relaxed">
                  For wedding cakes, milestone birthdays, or tiered custom gateaux, we require a minimum 5–7 days advance notice. You can specify flavors, tiers, dietary needs, and delivery dates via our custom order portal.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Magnet padding={25} magnetStrength={3}>
                  <Link
                    to="/custom-orders"
                    id="menu-bespoke-cake-cta"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors shadow-xs w-full"
                  >
                    <span>Submit Custom Cake Enquiry</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-[#D8C3A5]" />
                  </Link>
                </Magnet>
                <Magnet padding={25} magnetStrength={3}>
                  <a
                    href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to ask about custom cakes.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-medium hover:bg-[#F7F3F5] transition-colors w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-[#4A263F]" />
                    <span>Ask via WhatsApp</span>
                  </a>
                </Magnet>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
