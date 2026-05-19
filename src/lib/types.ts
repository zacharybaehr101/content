export type SchoolType = 'High School' | 'University' | 'Archdiocese' | string;
export type Region = 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'Mountain West' | 'South' | string;
export type EnrollmentRange = '< 500' | '500-999' | '1,000-1,499' | '1,500+' | string;
export type StrengthLevel = 'Strong' | 'Moderate' | 'Weak' | 'Absent' | string;
export type UserTier = 'free' | 'individual' | 'premium' | 'agency' | 'enterprise';

export interface School {
  // Identity
  id: string;
  institutionName: string;
  type: SchoolType;
  religiousOrder: string;
  dioceseOrProvince: string;
  city: string;
  state: string;
  region: Region;
  enrollmentSize: string;
  enrollmentRange: EnrollmentRange;
  websiteUrl: string;
  dateAnalyzed: string;
  pagesAnalyzed: string;

  // Social
  instagramUrl: string;
  facebookUrl: string;
  linkedInUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  primarySocialPlatform: string;

  // Homepage Copy Analysis
  heroHeadline: string;
  heroMessageType: string;
  primaryAudienceFocus: string;
  faithIdentityPosture: string;
  catholicOrderNamedOnHomepage: string;
  strongestPhrase: string;
  weakestPatternIdentified: string;
  ctaLabels: string;

  // Feature Flags
  financialAidLanguagePresent: string;
  outcomesPlacementDataShown: string;
  studentQuotesPresent: string;
  newsEventsFresh: string;

  // Qualitative Scores
  belongingLanguageStrength: StrengthLevel;
  prestigeLanguageLevel: StrengthLevel;
  serviceJusticeLanguage: string;

  // Navigation & UX
  navTopLabels: string;
  admissionsCtaProminence: string;
  visualTheologyImageType: string;
  foundersCharismUsedAsLens: string;
  mobileFrictionTapsToInquiry: string;

  // Strategic Analysis
  competitiveDifferentiationVsStateSchool: string;
  recommendedOutreachAngle: string;

  // Deep Analysis (Sheet 2 merged columns)
  deepPageType?: string;
  deepPageUrl?: string;
  deepHeroHeadline?: string;
  deepPrimaryMessage?: string;
  deepCtaLabels?: string;
  deepKeyPhrases?: string;
  deepNotableStrengths?: string;
  deepNotableGaps?: string;
  deepVisualTheologyNote?: string;
  deepNarrativeAnalysis?: string;
}

export const FREE_FIELDS: (keyof School)[] = [
  'id', 'institutionName', 'type', 'religiousOrder', 'city', 'state', 'region',
  'enrollmentRange', 'websiteUrl', 'primarySocialPlatform', 'heroHeadline',
  'heroMessageType', 'faithIdentityPosture', 'belongingLanguageStrength',
  'prestigeLanguageLevel', 'deepNarrativeAnalysis', 'deepNotableStrengths',
  'deepNotableGaps', 'deepPrimaryMessage', 'deepKeyPhrases', 'deepVisualTheologyNote',
];

export const INDIVIDUAL_FIELDS: (keyof School)[] = [
  ...FREE_FIELDS,
  'dioceseOrProvince', 'enrollmentSize', 'primaryAudienceFocus', 'strongestPhrase',
  'ctaLabels', 'financialAidLanguagePresent', 'outcomesPlacementDataShown',
  'studentQuotesPresent', 'newsEventsFresh', 'serviceJusticeLanguage',
  'admissionsCtaProminence', 'mobileFrictionTapsToInquiry', 'deepCtaLabels',
];

export const PREMIUM_FIELDS: (keyof School)[] = [
  'id', 'institutionName', 'type', 'religiousOrder', 'dioceseOrProvince', 'city',
  'state', 'region', 'enrollmentSize', 'enrollmentRange', 'websiteUrl', 'dateAnalyzed',
  'pagesAnalyzed', 'instagramUrl', 'facebookUrl', 'linkedInUrl', 'twitterUrl',
  'youtubeUrl', 'tiktokUrl', 'primarySocialPlatform', 'heroHeadline', 'heroMessageType',
  'primaryAudienceFocus', 'faithIdentityPosture', 'catholicOrderNamedOnHomepage',
  'strongestPhrase', 'weakestPatternIdentified', 'ctaLabels', 'financialAidLanguagePresent',
  'outcomesPlacementDataShown', 'studentQuotesPresent', 'newsEventsFresh',
  'belongingLanguageStrength', 'prestigeLanguageLevel', 'serviceJusticeLanguage',
  'navTopLabels', 'admissionsCtaProminence', 'visualTheologyImageType',
  'foundersCharismUsedAsLens', 'mobileFrictionTapsToInquiry',
  'competitiveDifferentiationVsStateSchool', 'recommendedOutreachAngle',
  'deepPageType', 'deepPageUrl', 'deepHeroHeadline', 'deepPrimaryMessage',
  'deepCtaLabels', 'deepKeyPhrases', 'deepNotableStrengths', 'deepNotableGaps',
  'deepVisualTheologyNote', 'deepNarrativeAnalysis',
];

export interface SearchParams {
  query?: string;
  type?: SchoolType;
  region?: Region;
  religiousOrder?: string;
  state?: string;
  enrollmentRange?: EnrollmentRange;
  faithPosture?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  schools: Partial<School>[];
  total: number;
  page: number;
  totalPages: number;
  tier: UserTier;
  searchesRemaining?: number;
}
