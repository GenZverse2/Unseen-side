export interface SiteContent {
  brandName: string;
  modelName: string;
  heroBackdropText?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPretitle: string;
  heroStatement: string;
  heroImageUrl?: string;
  availabilityStatus?: string;
  aboutHeading: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  footerText?: string;
  updatedAt?: string;
  updatedBy?: string;
  createdAt?: string;
}

export type GalleryCategory = 'editorial' | 'studio' | 'runway' | 'concept' | 'archive';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  altText?: string;
  category: GalleryCategory;
  series?: string;
  order: number;
  isPublished: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryType = 'collaboration' | 'campaign' | 'editorial' | 'press' | 'general';
export type InquiryStatus = 'new' | 'reviewed' | 'archived';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  inquiryType: InquiryType;
  status: InquiryStatus;
  createdAt?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
