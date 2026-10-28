import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { SiteContent, GalleryItem, ContactInquiry, InquiryStatus, OperationType } from '../types';
import { INITIAL_SITE_CONTENT, INITIAL_GALLERY_ITEMS } from '../data/initialContent';
import { useAuth } from './AuthContext';

interface ContentContextType {
  content: SiteContent;
  gallery: GalleryItem[];
  inquiries: ContactInquiry[];
  loadingContent: boolean;
  loadingGallery: boolean;
  loadingInquiries: boolean;
  updateSiteContent: (data: Partial<SiteContent>) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<string>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  submitContactInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [loadingGallery, setLoadingGallery] = useState<boolean>(true);
  const [loadingInquiries, setLoadingInquiries] = useState<boolean>(false);

  // Listen to Site Content
  useEffect(() => {
    const contentRef = doc(db, 'content', 'site_content');
    const unsubscribe = onSnapshot(
      contentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setContent({ ...INITIAL_SITE_CONTENT, ...(snapshot.data() as SiteContent) });
        } else {
          setContent(INITIAL_SITE_CONTENT);
        }
        setLoadingContent(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'content/site_content');
        setLoadingContent(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to Gallery Items
  useEffect(() => {
    const galleryCol = collection(db, 'gallery');
    const q = query(galleryCol, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: GalleryItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<GalleryItem, 'id'>) });
          });
          setGallery(items);
        } else {
          setGallery(INITIAL_GALLERY_ITEMS);
        }
        setLoadingGallery(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'gallery');
        setLoadingGallery(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to Inquiries (only if admin)
  useEffect(() => {
    if (!isAdmin) {
      setInquiries([]);
      setLoadingInquiries(false);
      return;
    }

    setLoadingInquiries(true);
    const inquiriesCol = collection(db, 'inquiries');
    const q = query(inquiriesCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: ContactInquiry[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ContactInquiry, 'id'>) });
        });
        setInquiries(items);
        setLoadingInquiries(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
        setLoadingInquiries(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Update Site Content
  const updateSiteContent = async (data: Partial<SiteContent>) => {
    if (!isAdmin) throw new Error('Unauthorized');
    const contentRef = doc(db, 'content', 'site_content');
    const payload = {
      ...content,
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid || 'admin',
    };

    try {
      await setDoc(contentRef, payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'content/site_content');
    }
  };

  // Add Gallery Item
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    if (!isAdmin) throw new Error('Unauthorized');
    const newId = `look-${Date.now()}`;
    const itemRef = doc(db, 'gallery', newId);
    const payload = {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(itemRef, payload);
      return newId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `gallery/${newId}`);
    }
  };

  // Update Gallery Item
  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    if (!isAdmin) throw new Error('Unauthorized');
    const itemRef = doc(db, 'gallery', id);
    const payload = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(itemRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `gallery/${id}`);
    }
  };

  // Delete Gallery Item
  const deleteGalleryItem = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    const itemRef = doc(db, 'gallery', id);
    try {
      await deleteDoc(itemRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
    }
  };

  // Submit Contact Inquiry
  const submitContactInquiry = async (
    inquiry: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>
  ) => {
    const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const inquiryRef = doc(db, 'inquiries', id);
    const payload = {
      ...inquiry,
      status: 'new',
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(inquiryRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
    }
  };

  // Update Inquiry Status (Admin only)
  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    if (!isAdmin) throw new Error('Unauthorized');
    const inqRef = doc(db, 'inquiries', id);
    try {
      await updateDoc(inqRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  // Seed Initial Data to Firestore
  const seedInitialDataToFirestore = async () => {
    if (!isAdmin) throw new Error('Unauthorized: only admin can seed initial data');
    try {
      // 1. Seed Site Content
      const contentRef = doc(db, 'content', 'site_content');
      await setDoc(contentRef, {
        ...INITIAL_SITE_CONTENT,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'admin',
      });

      // 2. Seed All Gallery Items
      for (const item of INITIAL_GALLERY_ITEMS) {
        const itemRef = doc(db, 'gallery', item.id);
        const { id, ...data } = item;
        await setDoc(itemRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seed_data');
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        gallery,
        inquiries,
        loadingContent,
        loadingGallery,
        loadingInquiries,
        updateSiteContent,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        submitContactInquiry,
        updateInquiryStatus,
        seedInitialDataToFirestore,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
