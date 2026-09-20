import { useState, FormEvent } from 'react';
import { MessageCircle, Send, CheckCircle2, AlertCircle, Calendar, Sparkles, Clock, Users, Heart } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import { BlurText, Magnet, ScrollReveal } from '../components/react-bits';
import { CustomOrderFormData } from '../types';
import { getWhatsAppUrl } from '../config/business';

export default function CustomOrders() {
  const [formData, setFormData] = useState<CustomOrderFormData>({
    name: '',
    phone: '',
    email: '',
    occasion: 'Wedding',
    cakeType: 'Tiered Celebration Cake',
    preferredDate: '',
    numberOfPeople: '20-30 guests',
    budgetRange: '₹5,000 — ₹10,000',
    preferredFlavour: 'Belgian Chocolate & Raspberry',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Min date helper (at least today or future recommended for bespoke pâtisserie)
  const todayStr = new Date().toISOString().split('T')[0];

  const customOrdersSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bespoke Celebration Cakes & Custom Orders',
    provider: {
      '@type': 'Bakery',
      name: 'MIRA & CRUMB',
      telephone: '+919876543210',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
    },
    description: 'Custom tiered celebration cakes, wedding gateaux, and artisanal commissions handcrafted in Coimbatore.',
  };

  const validateField = (field: keyof CustomOrderFormData, value: string): string => {
    const trimmed = (value || '').trim();
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
        if (!trimmed || !/^[6-9]\d{9}$/.test(trimmed)) {
          return 'Please enter a valid 10-digit Indian mobile number.';
        }
        return '';
      case 'preferredDate':
        if (!value) return 'Please select your preferred celebration date.';
        if (value < todayStr) return 'Celebration date cannot be in the past.';
        return '';
      case 'occasion':
        if (!value) return 'Please select an occasion.';
        return '';
      case 'cakeType':
        if (!value) return 'Please select a cake style.';
        return '';
      case 'numberOfPeople':
        if (!value) return 'Please indicate estimated guest count.';
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof CustomOrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation: revalidate immediately if touched or has existing error
    if (touched[field] || errors[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleFieldBlur = (field: keyof CustomOrderFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const validateAll = (): boolean => {
    const fieldsToValidate: (keyof CustomOrderFormData)[] = [
      'name',
      'email',
      'phone',
      'preferredDate',
      'occasion',
      'cakeType',
      'numberOfPeople',
    ];
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
        const response = await fetch('/api/custom-order', {
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
            message: data.message || 'Something went wrong. Please try again.',
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
        setServerError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting custom cake enquiry:', err);
      setServerError('The server is currently reconnecting or restarting. Please try again in a few seconds, or enquire directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppInquiry = () => {
    const msg = `Hi MIRA & CRUMB, I'd like to enquire about a custom cake for my ${formData.occasion || 'event'} on ${formData.preferredDate || 'an upcoming date'}. Guest count: ${formData.numberOfPeople || 'approx 20'}.`;
    return getWhatsAppUrl(msg);
  };

  return (
    <div id="custom-orders-page" className="pt-28 sm:pt-36 pb-24 bg-[#F7F3F5] min-h-screen">
      <SEO
        title="Custom Cake Enquiry & Bespoke Gateaux | MIRA & CRUMB Atelier"
        description="Commission a bespoke celebration cake, multi-tier wedding gateau, or anniversary centerpiece handcrafted by master pâtissiers at MIRA & CRUMB in Coimbatore."
        canonicalPath="/custom-orders"
        schema={customOrdersSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section (Section 12: "Your Cake, Your Story") */}
        <ScrollReveal duration={0.8} distance={15}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#4A263F] block mb-3">
              Bespoke Atelier Service
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#292129] tracking-tight mb-4">
              <BlurText text="Your Cake, Your Story" delay={65} animateBy="words" />
            </h1>
            <div className="w-16 h-[2px] bg-[#D8C3A5] mx-auto my-5" />
            <p className="text-base sm:text-lg text-[#292129]/75 font-light leading-relaxed">
              Every celebration deserves an exquisite edible centerpiece. Share your vision with our master pâtissiers, and we will compose a tailored creation reflecting your aesthetic and favorite flavors.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Guidance & What to Expect */}
          <ScrollReveal delay={0.1} duration={0.8} distance={20} className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#D8C3A5]/60 shadow-xs space-y-5">
              <h3 className="font-serif text-2xl font-medium text-[#292129]">
                The Bespoke Process
              </h3>
              <div className="w-8 h-[2px] bg-[#D8C3A5]" />

              <div className="space-y-4 text-xs sm:text-sm text-[#292129]/80 font-light">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#f1e7d9] text-[#4A263F] font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="font-semibold text-[#292129] block">Enquiry Submission</strong>
                    Provide your date, estimated party size, and preferred flavour notes below.
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#f1e7d9] text-[#4A263F] font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="font-semibold text-[#292129] block">Baker Consultation</strong>
                    Our pastry team reviews within 24–48 hours with flavor sketches and a formal quote.
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#f1e7d9] text-[#4A263F] font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="font-semibold text-[#292129] block">Tasting & Final Craft</strong>
                    Boutique tasting boxes are available for wedding and multi-tier commissions.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F3F5] border border-[#D8C3A5]/40 text-xs text-[#292129]/80">
                <div className="font-semibold text-[#4A263F] mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#4A263F]" />
                  <span>Lead Times</span>
                </div>
                <p>We recommend 2–4 weeks notice for celebrations, and 2–3 months for summer wedding bookings.</p>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-[#4A263F] text-[#FFFFFF] p-6 sm:p-8 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#D8C3A5] font-semibold block">
                Immediate Assistance
              </span>
              <h4 className="font-serif text-xl font-medium">
                Prefer to Discuss on WhatsApp?
              </h4>
              <p className="text-xs text-[#F7F3F5]/80 font-light leading-relaxed">
                Connect directly with our head pastry chef to share reference images or check urgent weekend availability.
              </p>
              <Magnet padding={25} magnetStrength={3}>
                <a
                  href={generateWhatsAppInquiry()}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="custom-order-sidebar-whatsapp"
                  className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#FFFFFF] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </Magnet>
            </div>
          </ScrollReveal>

          {/* Right Column: Custom Order Form */}
          <ScrollReveal delay={0.2} duration={0.8} distance={20} className="lg:col-span-8">
            <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-2xl border border-[#D8C3A5] shadow-sm">
              
              {isSuccess ? (
                /* Success State as required by Section 13 */
                <div id="custom-order-success-card" className="text-center py-10 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="font-serif text-3xl font-medium text-[#292129]">
                    Thank You!
                  </h3>

                  <div className="w-12 h-[2px] bg-[#D8C3A5] mx-auto" />

                  <blockquote className="text-base sm:text-lg text-[#4A263F] font-serif italic max-w-lg mx-auto bg-[#F7F3F5] p-5 rounded-xl border border-[#D8C3A5]/40">
                    "Thank you! Your enquiry has been received. We'll get back to you shortly."
                  </blockquote>

                  <p className="text-xs sm:text-sm text-[#292129]/70 font-light max-w-md mx-auto leading-relaxed">
                    A copy of your bespoke custom cake details has been securely dispatched to our head pastry chef atelier. We will review your celebration vision and contact you shortly.
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          occasion: 'Birthday',
                          cakeType: 'Layered Buttercream Gateau',
                          preferredDate: '',
                          numberOfPeople: '10-20 guests',
                          budgetRange: '',
                          preferredFlavour: '',
                          message: '',
                        });
                      }}
                      className="px-6 py-2.5 rounded-full border border-[#D8C3A5] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#F7F3F5]"
                    >
                      Submit Another Enquiry
                    </button>

                    <a
                      href={generateWhatsAppInquiry()}
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
                /* The Custom Cake Form (Section 12 Form Fields) */
                <form id="custom-cake-enquiry-form" onSubmit={handleSubmit} noValidate className="space-y-6">
                  
                  {serverError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Section A: Contact Details */}
                  <div>
                    <h4 className="font-serif text-xl font-medium text-[#292129] mb-4 pb-2 border-b border-[#f0e8ed]">
                      1. Your Information
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="custom-name" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Your Full Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="custom-name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          onBlur={() => handleFieldBlur('name')}
                          placeholder="e.g. Eleanor Hughes"
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

                      {/* Phone */}
                      <div>
                        <label htmlFor="custom-phone" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Phone Number <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          id="custom-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone')}
                          placeholder="e.g. 9876543210"
                          aria-invalid={Boolean(errors.phone)}
                          className={`w-full px-4 py-3 rounded-xl border bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 transition-all ${
                            errors.phone
                              ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                              : touched.phone && formData.phone.trim() && !errors.phone
                              ? 'border-emerald-600/40 hover:border-emerald-600/60 focus:ring-[#4A263F]'
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

                      {/* Email */}
                      <div className="sm:col-span-2">
                        <label htmlFor="custom-email" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Email Address <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="email"
                          id="custom-email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          onBlur={() => handleFieldBlur('email')}
                          placeholder="e.g. eleanor@example.com"
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
                    </div>
                  </div>

                  {/* Section B: Occasion & Cake Specifications */}
                  <div>
                    <h4 className="font-serif text-xl font-medium text-[#292129] mb-4 pb-2 border-b border-[#f0e8ed]">
                      2. Cake Specifications
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Occasion */}
                      <div>
                        <label htmlFor="custom-occasion" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Occasion <span className="text-rose-600">*</span>
                        </label>
                        <select
                          id="custom-occasion"
                          name="occasion"
                          value={formData.occasion}
                          onChange={(e) => handleFieldChange('occasion', e.target.value)}
                          onBlur={() => handleFieldBlur('occasion')}
                          className="w-full px-4 py-3 rounded-xl border border-[#D8C3A5]/60 bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 focus:ring-[#4A263F]"
                        >
                          <option value="Wedding">Wedding Celebration</option>
                          <option value="Birthday">Milestone Birthday</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Corporate">Corporate Gala / Milestone</option>
                          <option value="Baby Shower / Christening">Baby Shower / Christening</option>
                          <option value="Private Dinner">Intimate Dinner Party</option>
                          <option value="Other">Other Bespoke Gathering</option>
                        </select>
                        {errors.occasion && (
                          <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.occasion}</span>
                          </p>
                        )}
                      </div>

                      {/* Cake Type */}
                      <div>
                        <label htmlFor="custom-cake-type" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Cake Style <span className="text-rose-600">*</span>
                        </label>
                        <select
                          id="custom-cake-type"
                          name="cakeType"
                          value={formData.cakeType}
                          onChange={(e) => handleFieldChange('cakeType', e.target.value)}
                          onBlur={() => handleFieldBlur('cakeType')}
                          className="w-full px-4 py-3 rounded-xl border border-[#D8C3A5]/60 bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 focus:ring-[#4A263F]"
                        >
                          <option value="Tiered Celebration Cake">Multi-Tier Architectural Cake</option>
                          <option value="Single Tier Floral Gateau">Single Tier Floral Gateau</option>
                          <option value="French Entremet Presentation">French Entremet Mirror Glaze</option>
                          <option value="Rustic Textured Buttercream">Rustic Textured Swiss Buttercream</option>
                          <option value="Dessert Table Ensemble">Full Pâtisserie Dessert Table</option>
                        </select>
                        {errors.cakeType && (
                          <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.cakeType}</span>
                          </p>
                        )}
                      </div>

                      {/* Preferred Date */}
                      <div>
                        <label htmlFor="custom-date" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Preferred Celebration Date <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="date"
                          id="custom-date"
                          name="preferredDate"
                          min={todayStr}
                          value={formData.preferredDate}
                          onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
                          onBlur={() => handleFieldBlur('preferredDate')}
                          aria-invalid={Boolean(errors.preferredDate)}
                          className={`w-full px-4 py-3 rounded-xl border bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 transition-all ${
                            errors.preferredDate
                              ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                              : touched.preferredDate && formData.preferredDate
                              ? 'border-emerald-600/40 hover:border-emerald-600/60 focus:ring-[#4A263F]'
                              : 'border-[#D8C3A5]/60 hover:border-[#D8C3A5] focus:ring-[#4A263F]'
                          }`}
                        />
                        {errors.preferredDate && (
                          <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.preferredDate}</span>
                          </p>
                        )}
                      </div>

                      {/* Number of People */}
                      <div>
                        <label htmlFor="custom-people" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Number of Guests <span className="text-rose-600">*</span>
                        </label>
                        <select
                          id="custom-people"
                          name="numberOfPeople"
                          value={formData.numberOfPeople}
                          onChange={(e) => handleFieldChange('numberOfPeople', e.target.value)}
                          onBlur={() => handleFieldBlur('numberOfPeople')}
                          className="w-full px-4 py-3 rounded-xl border border-[#D8C3A5]/60 bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 focus:ring-[#4A263F]"
                        >
                          <option value="6-10 guests">6 — 10 guests (Intimate)</option>
                          <option value="12-20 guests">12 — 20 guests</option>
                          <option value="20-35 guests">20 — 35 guests (2 Tiers)</option>
                          <option value="40-75 guests">40 — 75 guests (3 Tiers)</option>
                          <option value="80-150+ guests">80 — 150+ guests (Grand Wedding)</option>
                        </select>
                        {errors.numberOfPeople && (
                          <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.numberOfPeople}</span>
                          </p>
                        )}
                      </div>

                      {/* Optional Budget Range */}
                      <div>
                        <label htmlFor="custom-budget" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Budget Range <span className="text-xs text-[#B99AA8]">(Optional)</span>
                        </label>
                        <select
                          id="custom-budget"
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#D8C3A5]/60 bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 focus:ring-[#4A263F]"
                        >
                          <option value="Under ₹5,000">Under ₹5,000</option>
                          <option value="₹5,000 — ₹10,000">₹5,000 — ₹10,000</option>
                          <option value="₹10,000 — ₹20,000">₹10,000 — ₹20,000</option>
                          <option value="₹20,000 — ₹35,000">₹20,000 — ₹35,000</option>
                          <option value="₹35,000+ (Luxury Multi-Tier & Event Orders)">₹35,000+ (Luxury Multi-Tier & Event Orders)</option>
                        </select>
                      </div>

                      {/* Optional Preferred Flavour */}
                      <div>
                        <label htmlFor="custom-flavour" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                          Preferred Flavour <span className="text-xs text-[#B99AA8]">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          id="custom-flavour"
                          name="preferredFlavour"
                          value={formData.preferredFlavour}
                          onChange={(e) => setFormData({ ...formData, preferredFlavour: e.target.value })}
                          placeholder="e.g. Pistachio & Wild Raspberry, Valrhona Dark Silk"
                          className="w-full px-4 py-3 rounded-xl border border-[#D8C3A5]/60 bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 focus:ring-[#4A263F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section C: Customer Message / Requirements */}
                  <div>
                    <label htmlFor="custom-message" className="block text-xs uppercase tracking-wider text-[#292129] font-medium mb-1.5">
                      Design Notes, Theme, or Dietary Requirements
                    </label>
                    <textarea
                      id="custom-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your celebration aesthetic, color palette, flower choices, or specific dietary restrictions (e.g. nut allergies, gluten-free preference)..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D8C3A5]/60 bg-[#F7F3F5] text-sm text-[#292129] focus:outline-hidden focus:ring-2 focus:ring-[#4A263F]"
                    />
                  </div>

                  {/* Submission CTA & Secondary WhatsApp CTA */}
                  <div className="pt-4 border-t border-[#f0e8ed] flex flex-col sm:flex-row items-center gap-4">
                    <Magnet padding={25} magnetStrength={3} className="w-full sm:w-auto flex-1">
                      <button
                        type="submit"
                        id="custom-order-submit-btn"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#4A263F] text-[#FFFFFF] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#3a1d31] transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 border-2 border-[#D8C3A5] border-t-transparent rounded-full animate-spin" />
                            <span>Delivering Enquiry to Baker...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Send Custom Enquiry</span>
                            <Send className="w-3.5 h-3.5 ml-1 text-[#D8C3A5]" />
                          </div>
                        )}
                      </button>
                    </Magnet>

                    <Magnet padding={25} magnetStrength={3} className="w-full sm:w-auto">
                      <a
                        href={generateWhatsAppInquiry()}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="custom-order-form-whatsapp-btn"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full border border-[#D8C3A5] bg-[#FFFFFF] text-[#4A263F] text-xs uppercase tracking-widest font-semibold hover:bg-[#F7F3F5] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span>Enquire on WhatsApp</span>
                      </a>
                    </Magnet>
                  </div>

                  <p className="text-[11px] text-center text-[#292129]/60 font-light">
                    Your enquiry is delivered directly to our head pastry chef atelier. We treat your personal details with complete discretion.
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
