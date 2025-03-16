export type UserRole = 'basic' | 'pro' | 'admin';

export interface ProFeatures {
  dailyRatingLimit: number;
  canExportHistory: boolean;
  prioritySupport: boolean;
  earlyAccess: boolean;
  customProfile: boolean;
}

export const PRO_FEATURES: ProFeatures = {
  dailyRatingLimit: 10,
  canExportHistory: true,
  prioritySupport: true,
  earlyAccess: true,
  customProfile: true,
};

export const BASIC_FEATURES: ProFeatures = {
  dailyRatingLimit: 5,
  canExportHistory: false,
  prioritySupport: false,
  earlyAccess: false,
  customProfile: false,
};

// Price in cents
export const PRO_PRICE = 299; 