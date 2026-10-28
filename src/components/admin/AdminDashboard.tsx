import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Image as ImageIcon,
  Inbox,
  Database,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  LogIn,
  LogOut,
  Mail,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { GalleryItem, GalleryCategory, InquiryStatus } from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, loginWithGoogle, logout, authError } = useAuth();
  const {
    content,
    gallery,
    inquiries,
    updateSiteContent,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    updateInquiryStatus,
    seedInitialDataToFirestore,
  } = useContent();

  const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'inquiries' | 'assets'>('content');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | InquiryStatus>('all');

  // Content edit state
  const [contentForm, setContentForm] = useState(content);

  // Sync content form when content updates
  React.useEffect(() => {
    setContentForm(content);
  }, [content]);

  // New gallery item state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<{
    title: string;
    subtitle: string;
    imageUrl: string;
    altText: string;
    category: GalleryCategory;
    series: string;
    order: number;
    isPublished: boolean;
  }>({
    title: '',
    subtitle: '',
    imageUrl: '',
    altText: '',
    category: 'editorial',
    series: '',
    order: (gallery.length || 0) + 1,
    isPublished: true,
  });

  if (!isOpen) return null;

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSiteContent(contentForm);
      setSaveStatus('Site content updated and published to Firestore successfully!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: unknown) {
      setSaveStatus(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.imageUrl) return;
    setIsSaving(true);
    try {
      await addGalleryItem(newItem);
      setIsAddingItem(false);
      setNewItem({
        title: '',
        subtitle: '',
        imageUrl: '',
        altText: '',
        category: 'editorial',
        series: '',
        order: gallery.length + 1,
        isPublished: true,
      });
      setSaveStatus('New gallery look added to Firestore!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: unknown) {
      setSaveStatus(err instanceof Error ? err.message : 'Error adding look');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Seed Firestore with initial reference content and original photographs?')) return;
    setIsSaving(true);
    try {
      await seedInitialDataToFirestore();
      setSaveStatus('Firestore successfully seeded with original model photographs and copy!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: unknown) {
      setSaveStatus(err instanceof Error ? err.message : 'Error seeding data');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter === 'all') return true;
    return inq.status === inquiryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#0f1116] border border-white/15 flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-white/20 bg-white/5">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-editorial-title font-bold text-white text-base tracking-wide flex items-center gap-2">
                UNSEEN SIDE — ADMIN CONSOLE
                {isAdmin && (
                  <span className="px-2 py-0.5 text-[9px] font-editorial-sub bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                    VERIFIED
                  </span>
                )}
              </h2>
              <p className="text-[11px] font-editorial-sub text-white/50 tracking-wider">
                Cloud Firestore Persistent Storage & Model Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 text-xs font-editorial-sub text-white/70">
                <span className="hidden sm:inline">{user.email}</span>
                <button
                  onClick={logout}
                  className="px-2.5 py-1 border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-3 py-1.5 bg-white text-black font-editorial-sub text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier if not signed in or not admin */}
        {!isAdmin ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 bg-white/5">
              <Shield className="w-8 h-8 text-amber-400/80" />
            </div>
            <h3 className="font-editorial-title text-2xl font-bold text-white mb-2">
              Authorized Administrator Access
            </h3>
            <p className="font-editorial-sub text-sm text-white/60 mb-6 leading-relaxed">
              Sign in with your administrator account (<span className="text-white font-mono">gdayoota@gmail.com</span>) to manage website copy, virtual model lookbooks, and review client inquiries.
            </p>

            {authError && (
              <div className="mb-6 p-3 border border-rose-500/30 bg-rose-500/10 text-rose-200 text-xs w-full">
                {authError}
              </div>
            )}

            <button
              onClick={loginWithGoogle}
              className="px-8 py-3.5 bg-white text-black font-editorial-sub text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>

            {user && !isAdmin && (
              <p className="mt-4 text-xs text-amber-300/80 font-editorial-sub">
                Logged in as {user.email}. This email is not in the authorized administrator whitelist.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/20 overflow-x-auto text-xs font-editorial-sub tracking-widest uppercase">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'content'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Site Content</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'gallery'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Model Gallery ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'inquiries'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Client Inquiries ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('assets')}
                className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'assets'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Media Assets</span>
              </button>

              <div className="ml-auto pb-2">
                <button
                  onClick={handleSeedDatabase}
                  disabled={isSaving}
                  className="px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[10px] tracking-widest hover:bg-amber-500/30 transition-colors uppercase flex items-center gap-1.5"
                  title="Initialize or reset Firestore data with original assets"
                >
                  <Database className="w-3 h-3" />
                  <span>Seed Data</span>
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {saveStatus && (
              <div className="mx-6 mt-4 p-3 border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 text-xs font-editorial-sub flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {saveStatus}
                </span>
                <button onClick={() => setSaveStatus(null)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: SITE CONTENT */}
              {activeTab === 'content' && (
                <form onSubmit={handleSaveContent} className="space-y-6 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={contentForm.brandName}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, brandName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                        Virtual Model Name
                      </label>
                      <input
                        type="text"
                        value={contentForm.modelName}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, modelName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                      Hero Pretitle
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroPretitle}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroPretitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroTitle}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.heroSubtitle}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                      Hero Statement Quote
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroStatement}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroStatement: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h4 className="font-editorial-title font-bold text-white text-base">
                      About Section & Manifesto
                    </h4>
                    <div>
                      <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                        About Heading
                      </label>
                      <input
                        type="text"
                        value={contentForm.aboutHeading}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, aboutHeading: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                        Paragraph 1 (Commanding the Frame)
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.aboutParagraph1}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, aboutParagraph1: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                        Paragraph 2 (Effortless Dressing)
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.aboutParagraph2}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, aboutParagraph2: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h4 className="font-editorial-title font-bold text-white text-base">
                      Official Contact Coordinates
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={contentForm.contactEmail}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, contactEmail: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={contentForm.contactPhone}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, contactPhone: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1.5">
                        Studio Location Address
                      </label>
                      <input
                        type="text"
                        value={contentForm.contactLocation}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, contactLocation: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-sm font-editorial-sub focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 bg-white text-black font-editorial-sub text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>SAVE & PUBLISH TO FIRESTORE</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: GALLERY MANAGER */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-editorial-title text-xl font-bold text-white">
                        Curated Looks & Photobook
                      </h3>
                      <p className="text-xs font-editorial-sub text-white/60">
                        Manage titles, display ordering, publication status, and custom additions.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingItem(!isAddingItem)}
                      className="px-4 py-2 border border-white/30 text-white font-editorial-sub text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingItem ? 'CANCEL' : 'ADD NEW LOOK'}</span>
                    </button>
                  </div>

                  {/* Add New Look Form Drawer */}
                  {isAddingItem && (
                    <form
                      onSubmit={handleCreateGalleryItem}
                      className="p-5 border border-white/20 bg-neutral-900/60 space-y-4"
                    >
                      <h4 className="font-editorial-title font-bold text-sm text-amber-200 uppercase tracking-wider">
                        Add New Virtual Model Photograph
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="e.g. Midnight Horizon"
                            className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-xs font-editorial-sub focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1">
                            Image URL / Path *
                          </label>
                          <input
                            type="text"
                            required
                            value={newItem.imageUrl}
                            onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                            placeholder="/images/model/MAG4HVhB6wU.png"
                            className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-xs font-editorial-sub focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1">
                            Category *
                          </label>
                          <select
                            value={newItem.category}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                category: e.target.value as GalleryCategory,
                              })
                            }
                            className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-xs font-editorial-sub focus:border-white focus:outline-none"
                          >
                            <option value="editorial">Editorial</option>
                            <option value="studio">Studio</option>
                            <option value="concept">Concept (3 Sides)</option>
                            <option value="runway">Runway</option>
                            <option value="archive">Archive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1">
                            Series Tag
                          </label>
                          <input
                            type="text"
                            value={newItem.series}
                            onChange={(e) => setNewItem({ ...newItem, series: e.target.value })}
                            placeholder="e.g. Studio Series No. 04"
                            className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-xs font-editorial-sub focus:border-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1">
                            Alt Text (SEO)
                          </label>
                          <input
                            type="text"
                            value={newItem.altText}
                            onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                            placeholder="Description of garment and model pose"
                            className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-xs font-editorial-sub focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-editorial-sub text-white/70 uppercase mb-1">
                          Subtitle / Narrative
                        </label>
                        <input
                          type="text"
                          value={newItem.subtitle}
                          onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })}
                          placeholder="Brief editorial description"
                          className="w-full px-3 py-2 bg-black/60 border border-white/20 text-white text-xs font-editorial-sub focus:border-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-white text-black font-editorial-sub text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Look to Database</span>
                      </button>
                    </form>
                  )}

                  {/* Gallery Items List */}
                  <div className="space-y-3">
                    {gallery.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3 border border-white/10 bg-neutral-900/30 flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-14 object-cover border border-white/10 shrink-0 bg-black"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-editorial-title font-bold text-sm text-white">
                                {item.title}
                              </span>
                              <span className="px-1.5 py-0.5 text-[9px] font-editorial-sub bg-white/10 text-white/70 uppercase tracking-widest">
                                {item.category}
                              </span>
                              {!item.isPublished && (
                                <span className="px-1.5 py-0.5 text-[9px] font-editorial-sub bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest">
                                  HIDDEN
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/50 font-editorial-sub line-clamp-1 mt-0.5">
                              {item.subtitle || item.series || 'No description'}
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Visibility Toggle */}
                          <button
                            onClick={() =>
                              updateGalleryItem(item.id, { isPublished: !item.isPublished })
                            }
                            className={`p-2 border transition-colors ${
                              item.isPublished
                                ? 'border-white/20 text-white/70 hover:text-white'
                                : 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                            }`}
                            title={item.isPublished ? 'Hide from public view' : 'Publish to public'}
                          >
                            {item.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Reorder Up */}
                          {index > 0 && (
                            <button
                              onClick={() => {
                                const prev = gallery[index - 1];
                                updateGalleryItem(item.id, { order: prev.order - 0.5 });
                              }}
                              className="p-2 border border-white/20 text-white/50 hover:text-white transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Item */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${item.title}"?`)) {
                                deleteGalleryItem(item.id);
                              }
                            }}
                            className="p-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Look"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: INQUIRIES INBOX */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-editorial-title text-xl font-bold text-white">
                        Collaboration Inquiries Inbox
                      </h3>
                      <p className="text-xs font-editorial-sub text-white/60">
                        Review direct booking and editorial requests from brand partners.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-editorial-sub uppercase tracking-wider">
                      {(['all', 'new', 'reviewed', 'archived'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setInquiryFilter(filter)}
                          className={`px-3 py-1.5 border transition-colors ${
                            inquiryFilter === filter
                              ? 'bg-white text-black border-white'
                              : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-5 border ${
                          inq.status === 'new'
                            ? 'border-amber-400/40 bg-amber-400/[0.03]'
                            : 'border-white/10 bg-neutral-900/30'
                        } flex flex-col justify-between gap-4`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-editorial-title font-bold text-white text-base">
                              {inq.name}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-editorial-sub bg-white/10 text-white/80 border border-white/20 uppercase tracking-widest">
                              {inq.inquiryType}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[9px] font-editorial-sub uppercase tracking-widest ${
                                inq.status === 'new'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : inq.status === 'reviewed'
                                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                                  : 'bg-white/10 text-white/50'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>

                          <div className="text-xs font-editorial-sub text-white/40">
                            <a
                              href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(
                                inq.subject || 'UNSEEN SIDE Inquiry'
                              )}`}
                              className="text-amber-200/80 hover:text-amber-200 hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>{inq.email}</span>
                            </a>
                          </div>
                        </div>

                        {inq.subject && (
                          <div className="text-xs font-editorial-sub font-semibold tracking-wider text-white/90 uppercase">
                            Subject: {inq.subject}
                          </div>
                        )}

                        <p className="text-sm font-editorial-sub text-white/80 whitespace-pre-wrap leading-relaxed">
                          {inq.message}
                        </p>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] font-editorial-sub text-white/30">
                            ID: {inq.id}
                          </span>

                          <div className="flex items-center gap-2">
                            {inq.status !== 'reviewed' && (
                              <button
                                onClick={() => updateInquiryStatus(inq.id, 'reviewed')}
                                className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-editorial-sub uppercase tracking-wider hover:bg-emerald-500/30 transition-colors"
                              >
                                Mark Reviewed
                              </button>
                            )}
                            {inq.status !== 'archived' && (
                              <button
                                onClick={() => updateInquiryStatus(inq.id, 'archived')}
                                className="px-3 py-1 bg-white/5 text-white/60 border border-white/20 text-xs font-editorial-sub uppercase tracking-wider hover:bg-white/10 transition-colors"
                              >
                                Archive
                              </button>
                            )}
                            {inq.status !== 'new' && (
                              <button
                                onClick={() => updateInquiryStatus(inq.id, 'new')}
                                className="px-3 py-1 bg-white/5 text-white/60 border border-white/20 text-xs font-editorial-sub uppercase tracking-wider hover:bg-white/10 transition-colors"
                              >
                                Mark New
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredInquiries.length === 0 && (
                      <div className="py-16 text-center border border-white/10 text-white/40 text-xs font-editorial-sub uppercase tracking-wider">
                        No inquiries in this view.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ORIGINAL ASSETS LIBRARY */}
              {activeTab === 'assets' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-editorial-title text-xl font-bold text-white">
                      Original Virtual Model Assets
                    </h3>
                    <p className="text-xs font-editorial-sub text-white/60">
                      All 14 original, uncompressed virtual model photographs preserved from the reference website.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      { id: 'MAG4HVhB6wU', name: 'Hero Primary Look', res: '768x1344', ext: 'png' },
                      { id: 'MAG4HXn1Ddc', name: 'Hero Secondary Frame', res: '1024x1024', ext: 'png' },
                      { id: 'MAG4HcPeUYw', name: 'Look 01 Redefine', res: '768x1344', ext: 'png' },
                      { id: 'MAG4HYR_A7w', name: 'Look 03 Elevate', res: '1349x2400', ext: 'jpg' },
                      { id: 'MAG4HSPewnY', name: 'Studio Series No. 01', res: '1024x1024', ext: 'png' },
                      { id: 'MAG4HfGCyb8', name: 'Studio Series No. 02', res: '1024x1033', ext: 'jpg' },
                      { id: 'MAG4HWV5JEs', name: 'Studio Series No. 03', res: '1024x1024', ext: 'png' },
                      { id: 'MAG4TnGu_Jk', name: 'Unfold Bold Side', res: '1079x770', ext: 'jpg' },
                      { id: 'MAG4HQvAr1w', name: 'Effortless Dressing', res: '2048x2048', ext: 'jpg' },
                      { id: 'MAG4TkFm208', name: 'The Bold', res: '1740x2400', ext: 'jpg' },
                      { id: 'MAG4TkcgeSk', name: 'The Elegant', res: '1744x2184', ext: 'jpg' },
                      { id: 'MAG4TmjoRGk', name: 'The Wild', res: '950x1155', ext: 'jpg' },
                      { id: 'MAG4HrL4MzU', name: 'Archive Full Silhouette', res: '1600x2400', ext: 'png' },
                      { id: 'MAG4HaRUIzo', name: 'Archive Portrait Frame', res: '1024x1024', ext: 'png' },
                    ].map((asset) => (
                      <div
                        key={asset.id}
                        className="p-3 border border-white/10 bg-neutral-900/40 flex flex-col justify-between"
                      >
                        <div className="aspect-[3/4] bg-black overflow-hidden border border-white/10 mb-2">
                          <img
                            src={`/images/model/${asset.id}.${asset.ext}`}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-editorial-title font-bold text-xs text-white block truncate">
                            {asset.name}
                          </span>
                          <span className="text-[10px] font-editorial-sub text-white/50 block">
                            {asset.res} • {asset.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
