import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { InquiryType } from '../../types';

export const ContactSection: React.FC = () => {
  const { content, submitContactInquiry } = useContent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    inquiryType: 'collaboration' as InquiryType,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!formData.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setErrorMessage('Please enter a valid business email address.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage('Please provide a descriptive inquiry message (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || `${formData.inquiryType.toUpperCase()} Inquiry`,
        inquiryType: formData.inquiryType,
        message: formData.message.trim(),
      });

      setSuccessMessage(
        'Inquiry delivered successfully to UNSEEN SIDE management. We will review and respond promptly.'
      );
      setFormData({
        name: '',
        email: '',
        subject: '',
        inquiryType: 'collaboration',
        message: '',
      });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to deliver your inquiry. Please try again or email us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 px-6 sm:px-8 lg:px-12 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Representation Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
                <span>DIRECT BOOKINGS</span>
              </div>
              <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight">
                Connect With <br />
                <span className="text-[#E50920]">Unseen Side.</span>
              </h2>
              <p className="mt-4 text-xs font-grotesk tracking-wider text-[#8A8A93] leading-relaxed uppercase">
                Available for digital runway showcases, brand campaigns, high-fashion editorials, virtual lookbooks, and avant-garde creative partnerships.
              </p>
            </div>

            {/* Direct Details with Red Accents */}
            <div className="mt-10 space-y-4">
              <div className="p-4 border border-neutral-900 bg-neutral-950/60">
                <span className="block text-[10px] font-grotesk tracking-[0.25em] text-[#E50920] uppercase font-bold">
                  STUDIO LOCATION
                </span>
                <span className="text-sm font-grotesk text-neutral-200 mt-1 block">
                  {content.contactLocation || 'Begusarai, Bihar, India • 123-Sim2, Bgs'}
                </span>
              </div>

              <div className="p-4 border border-neutral-900 bg-neutral-950/60">
                <span className="block text-[10px] font-grotesk tracking-[0.25em] text-[#E50920] uppercase font-bold">
                  OFFICIAL EMAIL
                </span>
                <a
                  href={`mailto:${content.contactEmail || 'Krishkartik604@gmail.com'}`}
                  className="text-sm font-grotesk text-neutral-200 hover:text-[#E50920] transition-colors mt-1 block"
                >
                  {content.contactEmail || 'Krishkartik604@gmail.com'}
                </a>
              </div>

              <div className="p-4 border border-neutral-900 bg-neutral-950/60">
                <span className="block text-[10px] font-grotesk tracking-[0.25em] text-[#E50920] uppercase font-bold">
                  DIRECT LINE
                </span>
                <span className="text-sm font-grotesk text-neutral-200 mt-1 block">
                  {content.contactPhone || '+91 62******57'}
                </span>
              </div>
            </div>

            <div className="mt-8 text-[11px] font-grotesk tracking-wider text-neutral-500 uppercase">
              • Response window: 24-48 business hours.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 border border-neutral-900 bg-neutral-950/60 p-8 sm:p-10 shadow-2xl relative">
            <h3 className="font-editorial-modern text-2xl font-bold text-white uppercase mb-2">
              Submit Collaboration Request
            </h3>
            <p className="text-[11px] font-grotesk text-[#8A8A93] uppercase tracking-widest mb-8">
              All inquiries are securely logged and delivered to management.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 border border-[#E50920] bg-[#E50920]/10 text-white text-xs font-grotesk flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E50920] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium tracking-wide">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 border border-rose-500/50 bg-rose-500/10 text-rose-200 text-xs font-grotesk flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-grotesk tracking-wider text-neutral-400 uppercase mb-2">
                    YOUR NAME / AGENCY *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Balenciaga Paris"
                    className="w-full px-4 py-3 bg-[#080808] border border-neutral-800 text-white placeholder-neutral-600 text-xs font-grotesk focus:border-[#E50920] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-grotesk tracking-wider text-neutral-400 uppercase mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. director@studio.com"
                    className="w-full px-4 py-3 bg-[#080808] border border-neutral-800 text-white placeholder-neutral-600 text-xs font-grotesk focus:border-[#E50920] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-grotesk tracking-wider text-neutral-400 uppercase mb-2">
                    INQUIRY TYPE *
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) =>
                      setFormData({ ...formData, inquiryType: e.target.value as InquiryType })
                    }
                    className="w-full px-4 py-3 bg-[#080808] border border-neutral-800 text-white text-xs font-grotesk focus:border-[#E50920] focus:outline-none transition-colors"
                  >
                    <option value="collaboration">Brand Collaboration</option>
                    <option value="campaign">Fashion Campaign</option>
                    <option value="editorial">Magazine / Editorial</option>
                    <option value="press">Press & Media</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-grotesk tracking-wider text-neutral-400 uppercase mb-2">
                    PROJECT SUBJECT
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Autumn / Winter 2027 Runway"
                    className="w-full px-4 py-3 bg-[#080808] border border-neutral-800 text-white placeholder-neutral-600 text-xs font-grotesk focus:border-[#E50920] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-grotesk tracking-wider text-neutral-400 uppercase mb-2">
                  MESSAGE / PROJECT SCOPE *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your creative vision, deliverables, licensing duration, and timeline..."
                  className="w-full px-4 py-3 bg-[#080808] border border-neutral-800 text-white placeholder-neutral-600 text-xs font-grotesk focus:border-[#E50920] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E50920] hover:bg-[#FF1A2E] text-white font-grotesk text-xs tracking-[0.25em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xl shadow-[#E50920]/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>DELIVERING INQUIRY...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT INQUIRY</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
