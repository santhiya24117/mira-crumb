import { MessageCircle, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { getWhatsAppUrl } from '../config/business';
import { SpotlightCard } from './react-bits';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = `Hi MIRA & CRUMB, I'm interested in ordering ${product.name}.`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <SpotlightCard
      id={`product-card-${product.id}`}
      spotlightColor="rgba(216, 195, 165, 0.18)"
      className="group relative bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#D8C3A5]/40 hover:border-[#D8C3A5] shadow-[0_4px_20px_rgba(74,38,63,0.03)] hover:shadow-[0_12px_30px_rgba(74,38,63,0.08)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-4/3 overflow-hidden bg-[#F7F3F5]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#292129]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Ribbon */}
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-[#4A263F] text-[#FFFFFF] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full flex items-center shadow-xs">
              <Sparkles className="w-3 h-3 mr-1 text-[#D8C3A5]" />
              <span>Signature</span>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-[#FFFFFF]/95 backdrop-blur-xs text-[#4A263F] font-serif text-lg font-semibold px-3 py-1 rounded-lg border border-[#D8C3A5]/50 shadow-xs">
            {product.price}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#B99AA8] font-medium">
              {product.category}
            </span>
            {product.servings && (
              <>
                <span className="text-[#D8C3A5] text-xs">&bull;</span>
                <span className="text-[11px] text-[#292129]/60 font-medium">
                  {product.servings}
                </span>
              </>
            )}
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#292129] group-hover:text-[#4A263F] transition-colors mb-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-sm text-[#292129]/75 font-light leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Dietary tags */}
          {product.dietary && product.dietary.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {product.dietary.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F7F3F5] text-[#4A263F] font-medium border border-[#D8C3A5]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 pb-6 pt-0">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          id={`enquire-btn-${product.id}`}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-[#4A263F] text-[#4A263F] hover:bg-[#4A263F] hover:text-[#FFFFFF] transition-all duration-200 text-xs uppercase tracking-widest font-semibold group/btn"
          aria-label={`Enquire on WhatsApp about ${product.name}`}
        >
          <MessageCircle className="w-4 h-4 text-[#4A263F] group-hover/btn:text-[#D8C3A5] transition-colors" />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>
    </SpotlightCard>
  );
}
