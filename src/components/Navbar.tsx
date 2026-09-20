import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getWhatsAppUrl } from '../config/business';
import { Magnet } from './react-bits';

interface NavbarProps {
  onOpenEnquire?: () => void;
}

export default function Navbar({ onOpenEnquire }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7F3F5]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(74,38,63,0.06)] border-b border-[#D8C3A5]/40 py-3.5'
          : 'bg-[#F7F3F5]/80 backdrop-blur-xs py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark Logo */}
        <Link
          to="/"
          id="brand-logo"
          className="group flex flex-col items-start focus:outline-hidden"
          aria-label="MIRA & CRUMB - Home"
        >
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.2em] text-[#4A263F] group-hover:text-[#292129] transition-colors leading-none">
            MIRA & CRUMB
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#D8C3A5] font-medium mt-1 font-sans">
            Artisan Bakes & Pâtisserie
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav id="desktop-navigation" className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`relative text-sm tracking-[0.08em] font-medium transition-colors py-1 ${
                  isActive ? 'text-[#4A263F] font-semibold' : 'text-[#292129]/80 hover:text-[#4A263F]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A263F] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <Magnet padding={25} magnetStrength={3}>
            <Link
              to="/custom-orders"
              id="nav-order-enquire-cta"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3a1d31] transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <span>Order / Enquire</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#D8C3A5]" />
            </Link>
          </Magnet>
          
          <Magnet padding={20} magnetStrength={3}>
            <a
              href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to make an enquiry about your bakery.")}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-whatsapp-cta"
              className="inline-flex items-center justify-center p-2.5 rounded-full border border-[#D8C3A5] text-[#4A263F] hover:bg-[#D8C3A5]/20 transition-all duration-200"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </Magnet>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <Link
            to="/custom-orders"
            id="mobile-header-order-btn"
            className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full bg-[#4A263F] text-[#FFFFFF]"
          >
            Enquire
          </Link>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#4A263F] hover:text-[#292129] focus:outline-hidden"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-x-0 top-[60px] bg-[#F7F3F5] border-b border-[#D8C3A5]/50 shadow-xl px-6 py-8 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-lg font-serif tracking-wider py-2 border-b border-[#f0e8ed] flex items-center justify-between ${
                    isActive ? 'text-[#4A263F] font-semibold pl-2' : 'text-[#292129] hover:text-[#4A263F]'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#4A263F]" />}
                </Link>
              );
            })}

            <div className="pt-4 flex flex-col space-y-3">
              <Link
                to="/custom-orders"
                id="mobile-drawer-enquire-cta"
                className="w-full flex items-center justify-center py-3.5 rounded-full bg-[#4A263F] text-[#FFFFFF] font-sans text-xs uppercase tracking-widest font-semibold shadow-sm hover:bg-[#3a1d31]"
              >
                <span>Order / Custom Cake Enquiry</span>
                <ArrowRight className="w-4 h-4 ml-2 text-[#D8C3A5]" />
              </Link>
              <a
                href={getWhatsAppUrl("Hi MIRA & CRUMB, I'd like to make an enquiry about your bakery.")}
                target="_blank"
                rel="noopener noreferrer"
                id="mobile-drawer-whatsapp-cta"
                className="w-full flex items-center justify-center py-3 rounded-full border border-[#D8C3A5] bg-[#FFFFFF] text-[#4A263F] font-sans text-xs uppercase tracking-widest font-medium"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-[#4A263F]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
