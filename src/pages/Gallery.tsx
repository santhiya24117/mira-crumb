import { useState } from 'react';
import { Sparkles, ZoomIn, MessageCircle } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import { BlurText, Magnet, ScrollReveal, AnimatedContent } from '../components/react-bits';
import { GALLERY_ITEMS } from '../data/bakeryData';
import { GalleryCategory, GalleryItem } from '../types';
import { getWhatsAppUrl } from '../config/business';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    'name': 'MIRA & CRUMB Atelier Gallery',
    'description': 'Curated showcase of artisanal baked goods, bespoke celebration cakes, and French pâtisserie creations in Coimbatore.',
  };

  const categories: { id: GalleryCategory; label: string }[] = [
    { id: 'all', label: 'All Photographs' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'pastries', label: 'Pastries' },
    { id: 'bread', label: 'Bread' },
    { id: 'celebration-cakes', label: 'Celebration Cakes' },
    { id: 'bakery-interior', label: 'Bakery Interior' },
    { id: 'behind-the-scenes', label: 'Behind the Scenes' },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div id="gallery-page" className="pt-28 sm:pt-36 pb-24 bg-[#F7F3F5] min-h-screen">
      <SEO
        title="Artisan Gallery & Bespoke Gateaux | MIRA & CRUMB Atelier"
        description="A visual gallery of daily artisan rituals, architectural wedding gateaux, golden sourdough crusts, and delicate French pastries at MIRA & CRUMB in Coimbatore."
        canonicalPath="/gallery"
        schema={gallerySchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Title Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#4A263F] block mb-3">
            Atelier Visuals
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#292129] tracking-tight mb-4">
            <BlurText text="The Gallery" delay={70} animateBy="words" />
          </h1>
          <div className="w-16 h-[2px] bg-[#D8C3A5] mx-auto my-5" />
          <p className="text-base sm:text-lg text-[#292129]/75 font-light leading-relaxed">
            A visual chronicle of daily artisan rituals, architectural wedding gateaux, golden oven crusts, and life inside our Coimbatore bakery.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-14">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                id={`gallery-cat-${cat.id}`}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#4A263F] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#292129]/70 hover:text-[#4A263F] border border-[#D8C3A5]/40 hover:border-[#D8C3A5]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Editorial Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <AnimatedContent key={item.id} delay={Math.min(idx * 0.04, 0.35)} distance={15} duration={0.5}>
              <div
                onClick={() => setActiveItem(item)}
                id={`gallery-item-${item.id}`}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#D8C3A5]/40 hover:border-[#D8C3A5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Frame */}
                <div className="relative overflow-hidden aspect-4/3 sm:aspect-1/1 bg-[#292129]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-[#4A263F]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFFFFF] text-[#4A263F] flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs text-[#4A263F] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md border border-[#D8C3A5]/40">
                    {item.categoryLabel}
                  </div>
                </div>

                {/* Caption details below image */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#292129] group-hover:text-[#4A263F] transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#292129]/70 font-light leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0e8ed] flex items-center justify-between text-[11px] text-[#B99AA8]">
                    <span>Click to expand</span>
                    <span className="text-[#4A263F] font-semibold group-hover:underline">Enquire &rarr;</span>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Gallery Lightbox */}
        <Lightbox item={activeItem} onClose={() => setActiveItem(null)} />

        {/* Bottom Bespoke Callout */}
        <ScrollReveal duration={0.8} distance={20} className="mt-20">
          <div className="text-center bg-[#FFFFFF] rounded-2xl p-8 border border-[#D8C3A5]/60 max-w-2xl mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6 text-[#4A263F] mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-medium text-[#292129] mb-2">
              Inspired by a Past Creation?
            </h3>
            <p className="text-sm text-[#292129]/75 font-light mb-6">
              Our confectioners can adapt any flavor, tier architecture, or decorative sugar theme for your wedding or special milestone.
            </p>
            <Magnet padding={25} magnetStrength={3}>
              <a
                href={getWhatsAppUrl("Hi MIRA & CRUMB, I saw your online gallery and would like to ask about commissioning a custom bake.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-7 py-3 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors inline-block"
              >
                <MessageCircle className="w-4 h-4 text-[#D8C3A5]" />
                <span>Enquire on WhatsApp</span>
              </a>
            </Magnet>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
