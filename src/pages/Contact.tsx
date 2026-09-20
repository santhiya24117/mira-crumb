import { useState, FormEvent } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import { BlurText, Magnet, ScrollReveal } from '../components/react-bits';
import { ContactFormData } from '../types';
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_ADDRESS,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  GOOGLE_MAPS_URL,
  GOOGLE_MAPS_EMBED_URL,
  OPENING_HOURS,
  getWhatsAppUrl,
} from '../config/business';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'MIRA & CRUMB',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '142 Avinashi Road, Race Course',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      postalCode: '641018',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.0168,
      longitude: 76.9558,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:30',
        closes: '18:00',
      },
    ],
  };

  const validateField = (field: keyof ContactFormData, value: string): string => {
    const trimmed = value.trim();
    switch (field) {
      case 'name':
        if (!trimmed) return 'Please provide your full name.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'email':
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return 'Please enter a valid email address.';
        }
        return '';
      case 'phone':
        if (trimmed && !/^[6-9]\d{9}$/.test(trimmed)) {
          return 'Please enter a valid 10-digit Indian mobile number.';
        }
        return '';
      case 'message':
        if (!trimmed) return 'Please provide your message.';
        if (trimmed.length < 10) {
          return `Message must be at least 10 characters (${10 - trimmed.length} more needed).`;
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation: if field was touched or currently has an error, revalidate instantly
    if (touched[field] || errors[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleFieldBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const validateAll = (): boolean => {
    const fieldsToValidate: (keyof ContactFormData)[] = ['name', 'email', 'phone', 'message'];
    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};

    fieldsToValidate.forEach((f) => {
      newTouched[f] = true;
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateAll()) return;

    setIsSubmitting(true);

    const submitWithRetry = async (retries = 2, delayMs = 1000): Promise<any> => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          return { ok: true, data };
        } else {
          return {
            ok: false,
            message: data.message || 'Unable to send message. Please try again.',
          };
        }
      } catch (err: any) {
        if (retries > 0) {
          await new Promise((res) => setTimeout(res, delayMs));
          return submitWithRetry(retries - 1, delayMs * 1.5);
        }
        throw err;
      }
    };

    try {
      const result = await submitWithRetry();

      if (result.ok) {
        setIsSuccess(true);
      } else {
        setServerError(result.message || 'Unable to send message. Please try again.');
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setServerError('The server is currently reconnecting or restarting. Please try again in a few moments or chat with us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generalWhatsAppMessage = "Hi MIRA & CRUMB, I'd like to make a general enquiry about your bakery.";

  return (
    <div id="contact-page" className="pt-28 sm:pt-36 pb-24 bg-[#F7F3F5] min-h-screen">
      <SEO
        title="Contact Us & Boutique Location | MIRA & CRUMB Atelier"
        description="Visit MIRA & CRUMB pâtisserie on Avinashi Road in Coimbatore. Enquire about daily oven timings, custom celebrations, or boutique collection."
        canonicalPath="/contact"
        schema={contactSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro as required by Section 14 */}
        <ScrollReveal duration={0.8} distance={15}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#4A263F] block mb-2">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-[#292129]">
              <BlurText text={BUSINESS_NAME} delay={70} animateBy="words" />
            </h1>
            <p className="font-serif text-xl italic text-[#4A263F] mt-1 mb-4">
              {BUSINESS_TAGLINE}
            </p>
            <div className="w-16 h-[2px] bg-[#D8C3A5] mx-auto my-4" />
            <p className="text-base text-[#292129]/75 font-light leading-relaxed">
              We welcome your questions regarding pastry reservations, dietary questions, or tailored celebration consultations. Reach out via email or direct WhatsApp chat.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Business Details & Schedule (Section 14) */}
          <ScrollReveal delay={0.1} duration={0.8} distance={20} className="lg:col-span-5 space-y-8">
            <div className="bg-[#FFFFFF] p-8 rounded-2xl border border-[#D8C3A5]/60 shadow-xs space-y-6">
              <h3 className="font-serif text-2xl font-medium text-[#292129]">
                Boutique Information
              </h3>
              <div className="w-8 h-[2px] bg-[#D8C3A5]" />

              <div className="space-y-4 text-sm text-[#292129]/80">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-[#4A263F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#292129] font-medium">Bakehouse Location</strong>
                    <span>{BUSINESS_ADDRESS}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-5 h-5 text-[#4A263F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#292129] font-medium">Direct Telephone</strong>
                    <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-[#4A263F] transition-colors">
                      {BUSINESS_PHONE}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-[#4A263F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#292129] font-medium">Email Desk</strong>
                    <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-[#4A263F] transition-colors">
                      {BUSINESS_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Instagram className="w-5 h-5 text-[#4A263F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#292129] font-medium">Instagram</strong>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#4A263F] transition-colors"
                    >
                      {INSTAGRAM_HANDLE}
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="pt-4 border-t border-[#f0e8ed]">
                <h4 className="font-serif text-lg font-medium text-[#292129] mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-[#4A263F]" />
                  <span>Atelier Opening Hours</span>
                </h4>
                <div className="space-y-1.5 text-xs text-[#292129]/75">
                  {OPENING_HOURS.map((h) => (
                    <div key={h.days} className="flex justify-between py-1 border-b border-[#f0e8ed]/60">
                      <span className="font-light">{h.days}</span>
                      <span className="font-semibold text-[#4A263F]">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick WhatsApp Lead Gen Button */}
              <div className="pt-2">
                <Magnet padding={25} magnetStrength={3}>
                  <a
                    href={getWhatsAppUrl(generalWhatsAppMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-whatsapp-direct-btn"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31] transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[#D8C3A5]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </Magnet>
              </div>
            </div>

            {/* Google Maps Visual Embed Frame */}
            <div className="rounded-2xl overflow-hidden border border-[#D8C3A5] shadow-xs bg-[#FFFFFF]">
              <div className="aspect-16/10 w-full relative">
                <iframe
                  title="MIRA & CRUMB Coimbatore Boutique Location"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4 bg-[#FFFFFF] flex items-center justify-between text-xs">
                <span className="text-[#292129]/70 font-light">Avinashi Road, Coimbatore</span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 font-semibold text-[#4A263F] hover:underline"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Contact Form (Section 14 & 15) */}
          <ScrollReveal delay={0.2} duration={0.8} distance={20} className="lg:col-span-7">
            <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-2xl border border-[#D8C3A5] shadow-sm">
              
              {isSuccess ? (
                /* Success State as required by Section 15 */
                <div id="contact-success-card" className="text-center py-12 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="font-serif text-3xl font-medium text-[#292129]">
                    Thank You!
                  </h3>

                  <div className="w-12 h-[2px] bg-[#D8C3A5] mx-auto" />

                  <blockquote className="text-base sm:text-lg text-[#4A263F] font-serif italic max-w-md mx-auto bg-[#F7F3F5] p-5 rounded-xl border border-[#D8C3A5]/40">
                    "Thank you! Your message has been sent successfully."
                  </blockquote>

                  <p className="text-xs sm:text-sm text-[#292129]/70 font-light max-w-md mx-auto leading-relaxed">
                    Your enquiry has been securely received by our pâtisserie team. A member of our desk will reply to your email shortly.
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: '', email: '', phone: '', message: '' });
                      }}
                      className="px-6 py-2.5 rounded-full border border-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#F7F3F5]"
                    >
                      Send Another Message
                    </button>

                    <a
                      href={getWhatsAppUrl("Hi MIRA & CRUMB, I just submitted an enquiry through your website.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#3a1d31]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 inline mr-1.5 text-[#D8C3A5]" />
                      Follow up on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                /* Contact Form with Section 14 Fields: Name, Email, Phone, Message */
                <form id="general-contact-form" onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-[#292129] mb-1">
                      Send an Enquiry
                    </h3>
                    <p className="text-xs sm:text-sm text-[#292129]/70 font-light">
                      Please fill in your details and our team will get back to your inbox.
                    </p>
                  </div>

                  {serverError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                      Your Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name')}
                      placeholder="e.g. Julian Montgomery"
                      aria-invalid={Boolean(errors.name)}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 transition-all ${
                        errors.name
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : touched.name && formData.name.trim()
                          ? 'border-emerald-600/40 hover:border-emerald-600/60 focus:ring-[#4A263F]'
                          : 'border-[#D8C3A5]/60 hover:border-[#D8C3A5] focus:ring-[#4A263F]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      placeholder="e.g. julian@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : touched.email && formData.email.trim() && !errors.email
                          ? 'border-emerald-600/40 hover:border-emerald-600/60 focus:ring-[#4A263F]'
                          : 'border-[#D8C3A5]/60 hover:border-[#D8C3A5] focus:ring-[#4A263F]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                      Phone Number <span className="text-xs text-[#B99AA8]">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      onBlur={() => handleFieldBlur('phone')}
                      placeholder="e.g. 9876543210"
                      aria-invalid={Boolean(errors.phone)}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : 'border-[#D8C3A5]/60 hover:border-[#D8C3A5] focus:ring-[#4A263F]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                      Your Message <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      onBlur={() => handleFieldBlur('message')}
                      placeholder="How may our pastry chefs assist you today? Please share your question or requirement..."
                      aria-invalid={Boolean(errors.message)}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 transition-all ${
                        errors.message
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : touched.message && formData.message.trim().length >= 10
                          ? 'border-emerald-600/40 hover:border-emerald-600/60 focus:ring-[#4A263F]'
                          : 'border-[#D8C3A5]/60 hover:border-[#D8C3A5] focus:ring-[#4A263F]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                    <Magnet padding={25} magnetStrength={3} className="w-full sm:w-auto flex-1">
                      <button
                        type="submit"
                        id="contact-submit-enquiry-btn"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#3a1d31] transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 border-2 border-[#D8C3A5] border-t-transparent rounded-full animate-spin" />
                            <span>Sending Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Send Enquiry</span>
                            <Send className="w-3.5 h-3.5 ml-1 text-[#D8C3A5]" />
                          </div>
                        )}
                      </button>
                    </Magnet>

                    <Magnet padding={25} magnetStrength={3} className="w-full sm:w-auto">
                      <a
                        href={getWhatsAppUrl(generalWhatsAppMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="contact-chat-whatsapp-btn"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full border border-[#D8C3A5] bg-[#FFFFFF] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#F7F3F5] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </Magnet>
                  </div>

                  <p className="text-[11px] text-center text-[#292129]/60 font-light">
                    Submissions are delivered directly to our pâtisserie desk. We treat your personal details with complete discretion.
                  </p>
                </form>
              )}

            </div>
          </ScrollReveal>

        </div>

      </div>
    </div>
  );
}
