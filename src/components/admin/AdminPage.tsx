import React, { useState, useRef } from 'react';
import {
  Shield,
  LayoutDashboard,
  Image as ImageIcon,
  Upload,
  FileText,
  Inbox,
  Settings,
  LogOut,
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { GalleryItem, GalleryCategory, InquiryStatus, SiteContent } from '../../types';

interface AdminPageProps {
  onBackToSite: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite }) => {
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

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'gallery' | 'upload' | 'content' | 'inquiries' | 'settings'
  >('overview');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Gallery filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Editing modal state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [replaceImagePreview, setReplaceImagePreview] = useState<string | null>(null);

  // Upload new image form state
  const [uploadForm, setUploadForm] = useState<{
    title: string;
    subtitle: string;
    category: GalleryCategory;
    series: string;
    altText: string;
    order: number;
    isPublished: boolean;
    previewUrl: string;
  }>({
    title: '',
    subtitle: '',
    category: 'editorial',
    series: '',
    altText: '',
    order: (gallery.length || 0) + 1,
    isPublished: true,
    previewUrl: '',
  });

  // Content form state
  const [contentForm, setContentForm] = useState<SiteContent>(content);
  React.useEffect(() => {
    setContentForm(content);
  }, [content]);

  // Inquiries filter
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | InquiryStatus>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle local image file upload (FileReader -> base64 data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/)) {
      showNotify('Please select a JPG, PNG, or WebP image.', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showNotify('Image exceeds 8MB. Please choose a smaller file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadForm((prev) => ({
        ...prev,
        previewUrl: reader.result as string,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setReplaceImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.previewUrl) {
      showNotify('Please upload an image file or provide an image URL.', 'error');
      return;
    }
    if (!uploadForm.title.trim()) {
      showNotify('Please enter a title for the look.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await addGalleryItem({
        title: uploadForm.title.trim(),
        subtitle: uploadForm.subtitle.trim(),
        imageUrl: uploadForm.previewUrl,
        altText: uploadForm.altText.trim() || uploadForm.title.trim(),
        category: uploadForm.category,
        series: uploadForm.series.trim(),
        order: Number(uploadForm.order) || gallery.length + 1,
        isPublished: uploadForm.isPublished,
      });

      showNotify('Virtual model photograph added to gallery successfully!');
      setUploadForm({
        title: '',
        subtitle: '',
        category: 'editorial',
        series: '',
        altText: '',
        order: gallery.length + 2,
        isPublished: true,
        previewUrl: '',
      });
      setCurrentTab('gallery');
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsProcessing(true);
    try {
      const updates: Partial<GalleryItem> = {
        title: editingItem.title,
        subtitle: editingItem.subtitle,
        category: editingItem.category,
        series: editingItem.series,
        altText: editingItem.altText,
        order: Number(editingItem.order),
        isPublished: editingItem.isPublished,
      };

      if (replaceImagePreview) {
        updates.imageUrl = replaceImagePreview;
      }

      await updateGalleryItem(editingItem.id, updates);
      showNotify(`Updated "${editingItem.title}" successfully!`);
      setEditingItem(null);
      setReplaceImagePreview(null);
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await updateSiteContent(contentForm);
      showNotify('Website content saved and published to Firestore!');
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : 'Error updating content', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Seed Firestore with initial original photographs and default copy?')) return;
    setIsProcessing(true);
    try {
      await seedInitialDataToFirestore();
      showNotify('Firestore populated with initial content & model looks!');
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : 'Seeding failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter gallery items
  const filteredGallery = gallery.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.series && item.series.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.isPublished) ||
      (statusFilter === 'hidden' && !item.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter === 'all') return true;
    return inq.status === inquiryStatusFilter;
  });

  // Not signed in or unauthorized gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-center items-center px-6 relative">
        <div className="absolute top-8 left-8">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs font-grotesk tracking-widest text-neutral-400 hover:text-white uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#E50920]" />
            <span>RETURN TO PORTFOLIO</span>
          </button>
        </div>

        <div className="max-w-md w-full p-8 bg-neutral-950 border border-neutral-900 shadow-2xl relative">
          <div className="w-4 h-4 border-t-2 border-l-2 border-[#E50920] absolute -top-1 -left-1" />
          <div className="w-4 h-4 border-t-2 border-r-2 border-[#E50920] absolute -top-1 -right-1" />
          <div className="w-4 h-4 border-b-2 border-l-2 border-[#E50920] absolute -bottom-1 -left-1" />
          <div className="w-4 h-4 border-b-2 border-r-2 border-[#E50920] absolute -bottom-1 -right-1" />

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#E50920]" />
            </div>
            <h1 className="font-editorial-modern text-2xl font-bold uppercase tracking-wider text-white">
              PRIVATE ADMIN CONSOLE
            </h1>
            <p className="mt-2 text-xs font-grotesk text-[#8A8A93] uppercase tracking-wider">
              UNSEEN SIDE Virtual Model System
            </p>

            <div className="mt-6 p-4 border border-neutral-900 bg-[#080808] w-full text-left text-xs font-grotesk text-neutral-400 space-y-2">
              <div className="flex items-center justify-between text-neutral-500">
                <span>WHITELIST EMAIL:</span>
                <span className="text-white font-mono">gdayoota@gmail.com</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>SECURITY LEVEL:</span>
                <span className="text-[#E50920] font-bold">ABAC ZERO-TRUST</span>
              </div>
            </div>

            {authError && (
              <div className="mt-4 p-3 border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs w-full font-grotesk">
                {authError}
              </div>
            )}

            {user && !isAdmin && (
              <div className="mt-4 p-3 border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs w-full font-grotesk">
                Signed in as {user.email}. This account is not authorized.
              </div>
            )}

            <button
              onClick={loginWithGoogle}
              className="mt-6 w-full py-4 bg-[#E50920] hover:bg-[#FF1A2E] text-white font-grotesk text-xs tracking-[0.25em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#E50920]/25"
            >
              <span>SIGN IN WITH GOOGLE</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-200 flex flex-col md:flex-row font-grotesk">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0c] border-r border-neutral-900 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#E50920] flex items-center justify-center">
                <span className="font-monolith text-xs text-white">US</span>
              </div>
              <div>
                <span className="font-editorial-modern font-black text-sm text-white tracking-widest block uppercase">
                  UNSEEN SIDE
                </span>
                <span className="text-[9px] tracking-widest text-[#E50920] uppercase font-bold block">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs tracking-wider uppercase">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
              { id: 'gallery', label: 'IMAGE LIBRARY', icon: ImageIcon, badge: gallery.length },
              { id: 'upload', label: 'UPLOAD LOOK', icon: Upload },
              { id: 'content', label: 'WEBSITE CONTENT', icon: FileText },
              { id: 'inquiries', label: 'INQUIRIES', icon: Inbox, badge: inquiries.filter((i) => i.status === 'new').length },
              { id: 'settings', label: 'SETTINGS', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as typeof currentTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 transition-colors ${
                    isActive
                      ? 'bg-[#E50920] text-white font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[9px] ${
                        isActive ? 'bg-black text-white' : 'bg-[#E50920] text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-900 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full py-2.5 px-3 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E50920]" />
            <span>VIEW PUBLIC SITE</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2.5 px-3 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-rose-400 text-xs tracking-wider uppercase flex items-center gap-2 transition-colors border border-neutral-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#080808] overflow-y-auto max-h-screen">
        {/* Top Header */}
        <header className="p-6 border-b border-neutral-900 flex items-center justify-between bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h2 className="font-editorial-modern text-xl font-bold uppercase text-white tracking-wide">
              {currentTab === 'overview' && 'SYSTEM OVERVIEW'}
              {currentTab === 'gallery' && 'VIRTUAL MODEL IMAGE LIBRARY'}
              {currentTab === 'upload' && 'UPLOAD NEW VIRTUAL MODEL LOOK'}
              {currentTab === 'content' && 'WEBSITE COPY & HERO MANAGEMENT'}
              {currentTab === 'inquiries' && 'CLIENT COLLABORATION INQUIRIES'}
              {currentTab === 'settings' && 'SYSTEM SETTINGS & FIRESTORE'}
            </h2>
            <p className="text-[11px] text-[#8A8A93] uppercase tracking-wider mt-0.5">
              Admin: {user?.email} • Database: Connected
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={isProcessing}
              className="px-3 py-1.5 border border-neutral-800 hover:border-[#E50920] text-neutral-400 hover:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              title="Seed initial data if database is empty"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">SEED DATA</span>
            </button>
          </div>
        </header>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`mx-6 mt-4 p-4 border flex items-center justify-between text-xs tracking-wider uppercase ${
              notification.type === 'success'
                ? 'border-[#E50920] bg-[#E50920]/10 text-white'
                : 'border-rose-500 bg-rose-500/10 text-rose-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E50920]" />
              {notification.message}
            </span>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-neutral-950 border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                    TOTAL MANAGED LOOKS
                  </span>
                  <span className="text-3xl font-editorial-modern font-bold text-white mt-2 block">
                    {gallery.length}
                  </span>
                  <span className="text-[11px] text-[#E50920] tracking-wider mt-1 block">
                    {gallery.filter((g) => g.isPublished).length} Published on site
                  </span>
                </div>

                <div className="p-5 bg-neutral-950 border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                    NEW INQUIRIES
                  </span>
                  <span className="text-3xl font-editorial-modern font-bold text-white mt-2 block">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </span>
                  <span className="text-[11px] text-neutral-400 tracking-wider mt-1 block">
                    {inquiries.length} Total Submissions
                  </span>
                </div>

                <div className="p-5 bg-neutral-950 border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                    VIRTUAL MODEL IDENTITY
                  </span>
                  <span className="text-xl font-editorial-modern font-bold text-white mt-2 block truncate">
                    {content.modelName || 'KRISH-KARTIK'}
                  </span>
                  <span className="text-[11px] text-neutral-400 tracking-wider mt-1 block">
                    Brand: {content.brandName || 'UNSEEN SIDE'}
                  </span>
                </div>

                <div className="p-5 bg-neutral-950 border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                    STORAGE INTEGRITY
                  </span>
                  <span className="text-3xl font-editorial-modern font-bold text-[#E50920] mt-2 block">
                    100%
                  </span>
                  <span className="text-[11px] text-neutral-400 tracking-wider mt-1 block">
                    Authentic Original Assets
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Looks */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Looks */}
                <div className="lg:col-span-8 p-6 bg-neutral-950 border border-neutral-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <h3 className="font-editorial-modern font-bold text-white uppercase text-sm tracking-wider">
                      Recent Portfolio Looks
                    </h3>
                    <button
                      onClick={() => setCurrentTab('gallery')}
                      className="text-xs text-[#E50920] hover:underline uppercase tracking-wider"
                    >
                      View All ({gallery.length})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {gallery.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="p-2 border border-neutral-900 bg-[#080808] flex flex-col justify-between"
                      >
                        <div className="aspect-[3/4] bg-black overflow-hidden mb-2">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-editorial-modern text-xs text-white font-bold block truncate uppercase">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          {item.category} • {item.isPublished ? 'Published' : 'Hidden'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="lg:col-span-4 p-6 bg-neutral-950 border border-neutral-900 space-y-4">
                  <h3 className="font-editorial-modern font-bold text-white uppercase text-sm tracking-wider border-b border-neutral-900 pb-3">
                    Management Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentTab('upload')}
                      className="w-full py-3 px-4 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-xs font-bold tracking-widest uppercase flex items-center justify-between transition-colors shadow-lg shadow-[#E50920]/20"
                    >
                      <span>Upload New Look</span>
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentTab('content')}
                      className="w-full py-3 px-4 border border-neutral-800 hover:border-neutral-600 bg-neutral-900 text-neutral-300 hover:text-white text-xs tracking-widest uppercase flex items-center justify-between transition-colors"
                    >
                      <span>Edit Website Headlines</span>
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentTab('inquiries')}
                      className="w-full py-3 px-4 border border-neutral-800 hover:border-neutral-600 bg-neutral-900 text-neutral-300 hover:text-white text-xs tracking-widest uppercase flex items-center justify-between transition-colors"
                    >
                      <span>Review Inquiries</span>
                      <Inbox className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGE LIBRARY */}
          {currentTab === 'gallery' && (
            <div className="space-y-6">
              {/* Controls Bar: Search & Filters */}
              <div className="p-4 bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by look title, series, or caption..."
                    className="w-full pl-9 pr-4 py-2 bg-[#080808] border border-neutral-800 text-xs font-grotesk text-white placeholder-neutral-600 focus:border-[#E50920] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-neutral-300 focus:border-[#E50920] focus:outline-none uppercase"
                  >
                    <option value="all">ALL CATEGORIES</option>
                    <option value="editorial">EDITORIAL</option>
                    <option value="studio">STUDIO</option>
                    <option value="concept">3 SIDES / CONCEPT</option>
                    <option value="runway">RUNWAY</option>
                    <option value="archive">ARCHIVE</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-neutral-300 focus:border-[#E50920] focus:outline-none uppercase"
                  >
                    <option value="all">ALL STATUSES</option>
                    <option value="published">PUBLISHED ONLY</option>
                    <option value="hidden">HIDDEN ONLY</option>
                  </select>

                  <button
                    onClick={() => setCurrentTab('upload')}
                    className="px-4 py-2 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD LOOK</span>
                  </button>
                </div>
              </div>

              {/* Gallery List */}
              <div className="space-y-3">
                {filteredGallery.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-neutral-950 border border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Photo Thumbnail */}
                      <div className="w-14 h-18 bg-black border border-neutral-800 overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-editorial-modern text-sm font-bold text-white uppercase truncate">
                            {item.title}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase font-mono">
                            {item.category}
                          </span>
                          {item.series && (
                            <span className="px-2 py-0.5 text-[9px] bg-neutral-900 text-neutral-400 uppercase font-mono">
                              {item.series}
                            </span>
                          )}
                          {!item.isPublished && (
                            <span className="px-2 py-0.5 text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-mono">
                              HIDDEN
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#8A8A93] line-clamp-1 mt-1">
                          {item.subtitle || 'No subtitle provided'}
                        </p>

                        <div className="text-[10px] text-neutral-600 mt-1 uppercase">
                          Order: {item.order} • ID: {item.id}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Publish / Hide Toggle */}
                      <button
                        onClick={() =>
                          updateGalleryItem(item.id, { isPublished: !item.isPublished })
                        }
                        className={`p-2 border transition-colors ${
                          item.isPublished
                            ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-[#E50920]'
                            : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                        }`}
                        title={item.isPublished ? 'Unpublish from public portfolio' : 'Publish to public portfolio'}
                      >
                        {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Reorder Up */}
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const prev = filteredGallery[index - 1];
                            updateGalleryItem(item.id, { order: prev.order - 0.5 });
                          }}
                          className="p-2 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setReplaceImagePreview(null);
                        }}
                        className="p-2 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#E50920] transition-colors"
                        title="Edit look metadata or replace image"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                            deleteGalleryItem(item.id);
                            showNotify(`Deleted "${item.title}"`);
                          }
                        }}
                        className="p-2 border border-neutral-800 text-neutral-500 hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                        title="Delete look"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredGallery.length === 0 && (
                  <div className="p-16 text-center border border-neutral-900 bg-neutral-950 text-neutral-500 text-xs uppercase tracking-wider">
                    No images match the current filter or search criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD LOOK */}
          {currentTab === 'upload' && (
            <div className="max-w-3xl mx-auto p-8 bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="font-editorial-modern text-xl font-bold uppercase text-white">
                  Add Virtual Model Photograph
                </h3>
                <p className="text-xs text-[#8A8A93] uppercase tracking-wider mt-1">
                  Upload a new model look (JPG, PNG, or WebP). All uploaded images become instantly available in your managed library.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                    IMAGE FILE OR URL *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Drag & Drop File Picker */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-800 hover:border-[#E50920] p-6 text-center cursor-pointer bg-[#080808] flex flex-col items-center justify-center transition-colors min-h-[160px]"
                    >
                      <Upload className="w-8 h-8 text-[#E50920] mb-2" />
                      <span className="text-xs font-bold uppercase text-white block">
                        Select Local File
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase mt-1 block">
                        PNG, JPG, or WebP up to 8MB
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Preview Frame */}
                    <div className="border border-neutral-800 bg-black flex items-center justify-center overflow-hidden min-h-[160px] p-2 relative">
                      {uploadForm.previewUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={uploadForm.previewUrl}
                            alt="Upload preview"
                            className="max-h-36 w-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadForm((p) => ({ ...p, previewUrl: '' }))}
                            className="absolute top-1 right-1 p-1 bg-[#E50920] text-white text-[10px]"
                          >
                            REMOVE
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-600 uppercase tracking-widest">
                          [ Image Preview ]
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                      Or enter image path:
                    </span>
                    <input
                      type="text"
                      value={uploadForm.previewUrl.startsWith('data:') ? '' : uploadForm.previewUrl}
                      onChange={(e) =>
                        setUploadForm((p) => ({ ...p, previewUrl: e.target.value }))
                      }
                      placeholder="/images/model/MAG4HVhB6wU.png"
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white placeholder-neutral-700 focus:border-[#E50920] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                      LOOK TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="e.g. Midnight Tailoring"
                      className="w-full px-3 py-2.5 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                      CATEGORY *
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) =>
                        setUploadForm((p) => ({
                          ...p,
                          category: e.target.value as GalleryCategory,
                        }))
                      }
                      className="w-full px-3 py-2.5 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none uppercase"
                    >
                      <option value="editorial">Editorial</option>
                      <option value="studio">Studio</option>
                      <option value="concept">Concept (3 Sides)</option>
                      <option value="runway">Runway</option>
                      <option value="archive">Archive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                      SERIES / COLLECTION TAG
                    </label>
                    <input
                      type="text"
                      value={uploadForm.series}
                      onChange={(e) =>
                        setUploadForm((p) => ({ ...p, series: e.target.value }))
                      }
                      placeholder="e.g. Studio Series No. 04"
                      className="w-full px-3 py-2.5 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                      DISPLAY ORDER
                    </label>
                    <input
                      type="number"
                      value={uploadForm.order}
                      onChange={(e) =>
                        setUploadForm((p) => ({ ...p, order: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2.5 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                    SUBTITLE / EDITORIAL NARRATIVE
                  </label>
                  <textarea
                    rows={2}
                    value={uploadForm.subtitle}
                    onChange={(e) =>
                      setUploadForm((p) => ({ ...p, subtitle: e.target.value }))
                    }
                    placeholder="Short description of the garment cut, mood, or lighting..."
                    className="w-full px-3 py-2.5 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={uploadForm.isPublished}
                    onChange={(e) =>
                      setUploadForm((p) => ({ ...p, isPublished: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#E50920]"
                  />
                  <label htmlFor="isPublished" className="text-xs text-neutral-300 uppercase">
                    Publish immediately to the public website
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#E50920]/25 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SAVING TO FIRESTORE...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>SAVE LOOK TO DATABASE</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CONTENT EDITOR */}
          {currentTab === 'content' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <form onSubmit={handleSaveContent} className="p-8 bg-neutral-950 border border-neutral-900 space-y-6">
                <div>
                  <h3 className="font-editorial-modern text-xl font-bold uppercase text-white">
                    Website Copy & Hero Configuration
                  </h3>
                  <p className="text-xs text-[#8A8A93] uppercase tracking-wider mt-1">
                    Edit brand copy and live text. Changes persist in Cloud Firestore and sync across devices.
                  </p>
                </div>

                {/* Hero Section Copy */}
                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <span className="text-xs font-bold text-[#E50920] tracking-widest uppercase block">
                    HERO CONFIGURATION
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                        MONUMENTAL BACKDROP TEXT (BEHIND MODEL)
                      </label>
                      <input
                        type="text"
                        value={contentForm.heroBackdropText || 'UNSEEN'}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, heroBackdropText: e.target.value })
                        }
                        placeholder="UNSEEN"
                        className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                        HERO FOREGROUND IMAGE
                      </label>
                      <select
                        value={contentForm.heroImageUrl || '/images/model/MAG4HVhB6wU.png'}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, heroImageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                      >
                        {gallery.map((g) => (
                          <option key={g.id} value={g.imageUrl}>
                            {g.title} ({g.series || g.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      HERO PRETITLE BADGE
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroPretitle}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroPretitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      HERO HEADLINE TITLE
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroTitle}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      HERO SUBTITLE / PHILOSOPHY
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.heroSubtitle}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      HERO STATEMENT QUOTE
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroStatement}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, heroStatement: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>
                </div>

                {/* About & Manifesto */}
                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <span className="text-xs font-bold text-[#E50920] tracking-widest uppercase block">
                    ABOUT & MANIFESTO
                  </span>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      ABOUT HEADING
                    </label>
                    <input
                      type="text"
                      value={contentForm.aboutHeading}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, aboutHeading: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      PARAGRAPH 1 (COMMANDING THE FRAME)
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.aboutParagraph1}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, aboutParagraph1: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      PARAGRAPH 2 (THE ART OF EFFORTLESS DRESSING)
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.aboutParagraph2}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, aboutParagraph2: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-neutral-900">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-4 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xl shadow-[#E50920]/25"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>PUBLISHING CHANGES...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>SAVE & PUBLISH CONTENT</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: INQUIRIES */}
          {currentTab === 'inquiries' && (
            <div className="space-y-6">
              {/* Header and status filter */}
              <div className="p-4 bg-neutral-950 border border-neutral-900 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-modern text-base font-bold uppercase text-white">
                    Client Collaboration Inquiries
                  </h3>
                  <span className="text-xs text-neutral-500 uppercase">
                    {inquiries.length} Total Submissions Received
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {(['all', 'new', 'reviewed', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setInquiryStatusFilter(st)}
                      className={`px-3 py-1.5 border transition-colors uppercase tracking-wider ${
                        inquiryStatusFilter === st
                          ? 'bg-[#E50920] text-white border-[#E50920] font-bold'
                          : 'bg-[#080808] border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries Cards */}
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-6 bg-neutral-950 border ${
                      inq.status === 'new'
                        ? 'border-[#E50920]/80 shadow-lg shadow-[#E50920]/10'
                        : 'border-neutral-900'
                    } space-y-4`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-editorial-modern font-bold text-white text-base uppercase">
                          {inq.name}
                        </span>
                        <span className="px-2 py-0.5 text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 uppercase">
                          {inq.inquiryType}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                            inq.status === 'new'
                              ? 'bg-[#E50920] text-white'
                              : inq.status === 'reviewed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <a
                        href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(
                          inq.subject || 'UNSEEN SIDE Inquiry'
                        )}`}
                        className="text-xs text-[#E50920] hover:underline flex items-center gap-1.5 font-mono"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{inq.email}</span>
                      </a>
                    </div>

                    {inq.subject && (
                      <div className="text-xs font-bold text-neutral-300 uppercase">
                        SUBJECT: {inq.subject}
                      </div>
                    )}

                    <p className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed bg-[#080808] p-4 border border-neutral-900">
                      {inq.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-neutral-600 font-mono">
                        REF: {inq.id}
                      </span>

                      <div className="flex items-center gap-2">
                        {inq.status !== 'reviewed' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'reviewed')}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs uppercase tracking-wider hover:bg-emerald-500/30 transition-colors"
                          >
                            Mark Reviewed
                          </button>
                        )}
                        {inq.status !== 'archived' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'archived')}
                            className="px-3 py-1 bg-neutral-900 text-neutral-400 border border-neutral-800 text-xs uppercase tracking-wider hover:text-white transition-colors"
                          >
                            Archive
                          </button>
                        )}
                        {inq.status !== 'new' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'new')}
                            className="px-3 py-1 bg-neutral-900 text-neutral-400 border border-neutral-800 text-xs uppercase tracking-wider hover:text-white transition-colors"
                          >
                            Mark New
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredInquiries.length === 0 && (
                  <div className="p-16 text-center border border-neutral-900 bg-neutral-950 text-neutral-500 text-xs uppercase tracking-wider">
                    No inquiries in this category.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {currentTab === 'settings' && (
            <div className="max-w-3xl mx-auto p-8 bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="font-editorial-modern text-xl font-bold uppercase text-white">
                  Brand & System Coordinates
                </h3>
                <p className="text-xs text-[#8A8A93] uppercase tracking-wider mt-1">
                  Manage core brand identities, contact coordinates, and social media handles.
                </p>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      BRAND DISPLAY NAME
                    </label>
                    <input
                      type="text"
                      value={contentForm.brandName}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, brandName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      VIRTUAL MODEL IDENTITY
                    </label>
                    <input
                      type="text"
                      value={contentForm.modelName}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, modelName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                    LIVE STATUS BANNER
                  </label>
                  <input
                    type="text"
                    value={contentForm.availabilityStatus || ''}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, availabilityStatus: e.target.value })
                    }
                    placeholder="AVAILABLE FOR S/S 2027 CAMPAIGNS"
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      CONTACT EMAIL
                    </label>
                    <input
                      type="email"
                      value={contentForm.contactEmail}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, contactEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      CONTACT PHONE
                    </label>
                    <input
                      type="text"
                      value={contentForm.contactPhone}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, contactPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                    STUDIO LOCATION
                  </label>
                  <input
                    type="text"
                    value={contentForm.contactLocation}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, contactLocation: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      INSTAGRAM URL
                    </label>
                    <input
                      type="text"
                      value={contentForm.instagramUrl || ''}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, instagramUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      FACEBOOK URL
                    </label>
                    <input
                      type="text"
                      value={contentForm.facebookUrl || ''}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, facebookUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                      TWITTER / X URL
                    </label>
                    <input
                      type="text"
                      value={contentForm.twitterUrl || ''}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, twitterUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                    FOOTER COPYRIGHT TEXT
                  </label>
                  <input
                    type="text"
                    value={contentForm.footerText || ''}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, footerText: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white focus:border-[#E50920] focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-3 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>SAVE SETTINGS</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-neutral-950 border border-neutral-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h3 className="font-editorial-modern text-lg font-bold text-white uppercase">
                Edit Look: {editingItem.title}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setReplaceImagePreview(null);
                }}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 bg-black border border-neutral-800 overflow-hidden shrink-0">
                  <img
                    src={replaceImagePreview || editingItem.imageUrl}
                    alt={editingItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-white uppercase tracking-wider flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#E50920]" />
                    <span>Replace Image File</span>
                  </button>
                  <input
                    ref={replaceFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReplaceFileChange}
                    className="hidden"
                  />
                  <span className="text-[10px] text-neutral-500 block uppercase">
                    Upload a new photo to replace the current visual
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                    TITLE
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as GalleryCategory,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white uppercase"
                  >
                    <option value="editorial">Editorial</option>
                    <option value="studio">Studio</option>
                    <option value="concept">Concept (3 Sides)</option>
                    <option value="runway">Runway</option>
                    <option value="archive">Archive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                    SERIES TAG
                  </label>
                  <input
                    type="text"
                    value={editingItem.series || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, series: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                    ORDER
                  </label>
                  <input
                    type="number"
                    value={editingItem.order}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                  SUBTITLE / CAPTION
                </label>
                <textarea
                  rows={2}
                  value={editingItem.subtitle || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#080808] border border-neutral-800 text-xs text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editPublished"
                  checked={editingItem.isPublished}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#E50920]"
                />
                <label htmlFor="editPublished" className="text-xs text-neutral-300 uppercase">
                  Published to public portfolio
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setReplaceImagePreview(null);
                  }}
                  className="px-4 py-2 bg-neutral-900 text-neutral-400 text-xs uppercase hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-xs font-bold uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
