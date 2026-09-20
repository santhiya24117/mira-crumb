import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Phone, Mail, Instagram, Clock, ArrowUpRight } from 'lucide-react';
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  OPENING_HOURS,
  getWhatsAppUrl,
} from '../config/business';
import { ScrollReveal, Magnet } from './react-bits';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer id="main-footer" className="bg-[#4A263F] text-[#FFFFFF] pt-16 pb-12 border-t border-[#D8C3A5]/30">
      <ScrollReveal duration={0.8} distance={15} blur={false} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#FFFFFF]/10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.2em] text-[#FFFFFF] block">
                {BUSINESS_NAME}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#D8C3A5] font-sans block mt-1">
                {BUSINESS_TAGLINE}
              </span>
            </div>
            <p className="text-sm text-[#F7F3F5]/80 leading-relaxed font-light">
              European-inspired pâtisserie crafted in Coimbatore with contemporary pastry artistry. Baked fresh at dawn with unhurried devotion.
            </p>
            <div className="pt-2">
              <Magnet padding={25} magnetStrength={3}>
                <a
                  href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to place an order via WhatsApp.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-whatsapp-order-cta"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#FFFFFF] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>
              </Magnet>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg tracking-wider text-[#D8C3A5] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    id={`footer-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#F7F3F5]/80 hover:text-[#D8C3A5] transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8C3A5]/40 mr-2 group-hover:bg-[#D8C3A5] transition-colors" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg tracking-wider text-[#D8C3A5] mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#D8C3A5]" />
              <span>Opening Hours</span>
            </h4>
            <ul className="space-y-2 text-sm text-[#F7F3F5]/80">
              {OPENING_HOURS.map((slot) => (
                <li key={slot.days} className="flex justify-between border-b border-[#FFFFFF]/5 pb-1.5">
                  <span className="font-light">{slot.days}</span>
                  <span className="text-[#D8C3A5] font-medium">{slot.hours}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#F7F3F5]/60 mt-3 italic">
              Breads & morning viennoiserie warm from the hearth from 07:30 AM.
            </p>
          </div>

          {/* Contact Details & Social */}
          <div>
            <h4 className="font-serif text-lg tracking-wider text-[#D8C3A5] mb-4">
              Pâtisserie Boutique
            </h4>
            <div className="space-y-3 text-sm text-[#F7F3F5]/80">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D8C3A5] shrink-0 mt-0.5" />
                <span>{BUSINESS_ADDRESS}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D8C3A5] shrink-0" />
                <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-[#D8C3A5] transition-colors">
                  {BUSINESS_PHONE}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D8C3A5] shrink-0" />
                <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-[#D8C3A5] transition-colors">
                  {BUSINESS_EMAIL}
                </a>
              </div>
            </div>

            <div className="pt-5">
              <span className="text-xs uppercase tracking-widest text-[#D8C3A5] block mb-2 font-medium">
                Connect With Us
              </span>
              <div className="flex space-x-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-instagram-link"
                  className="p-2 rounded-full border border-[#D8C3A5]/40 text-[#D8C3A5] hover:bg-[#D8C3A5] hover:text-[#4A263F] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-facebook-link"
                  className="p-2 rounded-full border border-[#D8C3A5]/40 text-[#D8C3A5] hover:bg-[#D8C3A5] hover:text-[#4A263F] transition-all"
                  aria-label="Facebook"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright and Location */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F3F5]/60 gap-4">
          <p>© 2026 MIRA & CRUMB. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[#D8C3A5]/70">Artisan Pâtisserie & Speciality Coffee</span>
            <span>&bull;</span>
            <span className="text-[#D8C3A5]/70">Coimbatore, Tamil Nadu</span>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
