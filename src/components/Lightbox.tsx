import { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';
import { getWhatsAppUrl } from '../config/business';

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function Lightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      id="gallery-lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#292129]/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="gallery-lightbox-modal"
        className="relative max-w-4xl w-full bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#D8C3A5] flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="lightbox-close-button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#4A263F] text-[#FFFFFF] hover:bg-[#3a1d31] transition-colors focus:outline-hidden"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Display */}
        <div className="md:w-3/5 bg-[#292129] flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full max-h-[60vh] md:max-h-[85vh] object-cover object-center"
          />
        </div>

        {/* Content & Inquiry Side */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFFFF] overflow-y-auto">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#4A263F] bg-[#f1e7d9] px-2.5 py-1 rounded-md">
                {item.categoryLabel}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292129] leading-tight mb-3">
              {item.title}
            </h3>

            <div className="w-8 h-[2px] bg-[#D8C3A5] mb-4" />

            <p className="text-sm sm:text-base text-[#292129]/75 font-light leading-relaxed mb-6">
              {item.caption}
            </p>

            <div className="bg-[#F7F3F5] rounded-xl p-4 border border-[#D8C3A5]/40 text-xs text-[#292129]/80 space-y-1.5">
              <div className="font-semibold text-[#4A263F] uppercase tracking-wider text-[10px]">
                Artisan Preparation Notes
              </div>
              <p>Hand-crafted in small batches with European culinary tradition and fresh daily ingredients.</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#f0e8ed]">
            <a
              href={getWhatsAppUrl(`Hi MIRA & CRUMB, I saw '${item.title}' in your gallery and would like to enquire about a similar creation.`)}
              target="_blank"
              rel="noopener noreferrer"
              id="lightbox-enquire-whatsapp"
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors shadow-xs"
            >
              <span>Enquire About This Creation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
