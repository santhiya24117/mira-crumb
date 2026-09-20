import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl } from '../config/business';

export default function WhatsAppSticky() {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = "Hi MIRA & CRUMB, I'd like to enquire about your artisan bakes and custom cakes.";

  return (
    <div id="sticky-whatsapp-container" className="fixed bottom-6 right-6 z-40 flex items-end flex-col">
      {showTooltip && (
        <div className="relative mb-2.5 max-w-[220px] bg-[#FFFFFF] text-[#292129] text-xs py-2 px-3 rounded-xl shadow-lg border border-[#D8C3A5] animate-fadeIn hidden sm:flex items-start justify-between">
          <p className="font-sans text-[11px] leading-snug">
            Questions or fresh bake enquiries? <span className="font-semibold text-[#4A263F]">Chat with our baker</span> on WhatsApp.
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-[#B99AA8] hover:text-[#292129] ml-1.5 shrink-0"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={getWhatsAppUrl(defaultMessage)}
        target="_blank"
        rel="noopener noreferrer"
        id="sticky-whatsapp-button"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#4A263F] text-[#FFFFFF] shadow-xl hover:bg-[#3a1d31] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#D8C3A5]"
        aria-label="Chat on WhatsApp with MIRA & CRUMB"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8C3A5] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D8C3A5]"></span>
        </span>
        <MessageCircle className="w-7 h-7 text-[#FFFFFF] group-hover:text-[#D8C3A5] transition-colors" />
      </a>
    </div>
  );
}
