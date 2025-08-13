export interface CoreValues {
  values: string[];
  attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
  emotionalIntelligence: number; // 1-10
  conflictResolution: number; // 1-10
}

export interface Lifestyle {
  workLifeBalance: number; // 1-10
  longTermGoals: string[];
  dailyHabits: string[];
  healthPractices: string[];
  travelPreferences: string[];
}

export interface Interests {
  hobbies: string[];
  passions: string[];
  socialActivities: string[];
  friendshipStyle: string;
}

export interface CommunicationStyle {
  primaryStyle: 'direct' | 'indirect' | 'analytical' | 'intuitive';
  emotionalExpression: number; // 1-10
  listeningSkills: number; // 1-10
  conflictStyle: string;
}

export interface PersonalityProfile {
  traits: string[];
  socialValues: string[];
  communityInvolvement: string[];
  familyDynamics: string;
}

export interface FinancialProfile {
  financialGoals: string[];
  moneyAttitude: string;
  careerAspirations: string[];
  workEthic: number; // 1-10
}

export interface LifeVision {
  futurePlans: string[];
  relationshipGoals: string[];
  personalGrowth: string[];
  conflictResolutionStyle: string;
}

export interface SeductiveArchetype {
  primaryArchetype: string;
  secondaryArchetype: string;
  traits: string[];
}

export interface GenderTropes {
  primaryTrope: string;
  secondaryTrope: string;
  characteristics: string[];
}

export interface CompatibilityProfile {
  id: string;
  userId: string;
  coreValues: CoreValues;
  lifestyle: Lifestyle;
  interests: Interests;
  communicationStyle: CommunicationStyle;
  personalityProfile: PersonalityProfile;
  financialProfile: FinancialProfile;
  lifeVision: LifeVision;
  seductiveArchetype: SeductiveArchetype;
  genderTropes: GenderTropes;
  createdAt: Date;
  updatedAt: Date;
}