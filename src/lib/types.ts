export type SchoolType = 'High School' | 'University' | 'Archdiocese' | string;
export type Region = string;
export type EnrollmentRange = string;
export type StrengthLevel = 'Strong' | 'Moderate' | 'Weak' | 'Absent' | string;
export type UserTier = 'free' | 'starter' | 'team' | 'agency';

export interface School {
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
  instagramUrl: string;
  facebookUrl: string;
  linkedInUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  primarySocialPlatform: string;
  heroHeadline: string;
  heroMessageType: string;
  primaryAudienceFocus: string;
  faithIdentityPosture: string;
  catholicOrderNamedOnHomepage: string;
  strongestPhrase: string;
  weakestPatternIdentified: string;
  ctaLabels: string;
  financialAidLanguagePresent: string;
  outcomesPlacementDataShown: string;
  studentQuotesPresent: string;
  newsEventsFresh: string;
  belongingLanguageStrength: StrengthLevel;
  prestigeLanguageLevel: StrengthLevel;
  serviceJusticeLanguage: string;
  navTopLabels: string;
  admissionsCtaProminence: string;
  visualTheologyImageType: string;
  foundersCharismUsedAsLens: string;
  mobileFrictionTapsToInquiry: string;
  competitiveDifferentiationVsStateSchool: string;
  recommendedOutreachAngle: string;
  deepAnalysisAvailable: boolean;
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

export interface FullSiteAnalysis {
  institutionName: string;
  identityOrder: string;
  homepageUrl: string;
  featuredArtUrl: string;
  pagesEvaluated: string;
  linksToEvaluatedPages: string;
  socialMediaEvaluated: string;
  narrative: string;
  overallThemeTone: string;
  catholicFactor: string;
  headlineStrategy: string;
  visualStorytelling: string;
  outcomeRoiFocus: string;
  navigationEaseOfUse: string;
  conversionStrategy: string;
  socialStrategy: string;
  whatToSteal: string;
}

export interface AdmissionsAnalysis {
  institutionName: string;
  pageType: string;
  pageUrl: string;
  heroHeadline: string;
  primaryMessage: string;
  ctaLabels: string;
  keyPhrases: string;
  notableStrengths: string;
  opportunities: string;
  visualTheologyNote: string;
  narrativeAnalysis: string;
}

export interface StudentLifeAnalysis {
  institutionName: string;
  identityOrder: string;
  overallThemeTone: string;
  catholicFactor: string;
  headlineStrategy: string;
  visualStorytelling: string;
  belongingCommunityFocus: string;
  navigationEaseOfUse: string;
  engagementConversionStrategy: string;
  whatToSteal: string;
}

export interface AcademicsAnalysis {
  institutionName: string;
  affiliationHeritage: string;
  strategicPositioningCoreMessaging: string;
  primaryContentModules: string;
  visualDesignLayoutStrategy: string;
  colorPaletteTypography: string;
  ctasNavigationPrompts: string;
  notableFeaturesDifferentiators: string;
}

export interface PinnedSchool {
  id: string;
  institutionName: string;
  type: string;
  region: string;
  city: string;
  state: string;
  heroHeadline: string;
  note: string;
  pinnedAt: string;
}

export interface InspirationResult {
  schoolId: string;
  institutionName: string;
  city: string;
  state: string;
  type: string;
  region: string;
  matchedTab: string;
  matchReason: string;
  keyPhrases: string[];
  pageUrl?: string;
}

export interface SearchParams {
  query?: string;
  type?: SchoolType;
  region?: Region;
  religiousOrder?: string;
  state?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  schools: Partial<School>[];
  total: number;
  page: number;
  totalPages: number;
  tier: UserTier;
}

export const TIER_LIMITS = {
  free:    { searches: 3,   pins: 0,  inspirationResults: 0,  seats: 1 },
  starter: { searches: 30,  pins: 10, inspirationResults: 5,  seats: 1 },
  team:    { searches: 150, pins: -1, inspirationResults: 15, seats: 5 },
  agency:  { searches: -1,  pins: -1, inspirationResults: -1, seats: -1 },
} as const;
