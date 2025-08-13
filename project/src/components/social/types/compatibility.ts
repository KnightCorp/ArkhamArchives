export interface CompatibilityProfile {
  id: string;
  userId: string;
  coreValues: {
    values: string[];
    attachmentStyle: string;
    emotionalIntelligence: number;
    conflictResolution: number;
  };
  lifestyle: {
    workLifeBalance: number;
    longTermGoals: string[];
    dailyHabits: string[];
    healthPractices: string[];
    travelPreferences: string[];
  };
  interests: {
    hobbies: string[];
    passions: string[];
    socialActivities: string[];
    friendshipStyle: string;
  };
  communicationStyle: {
    primaryStyle: string;
    emotionalExpression: number;
    listeningSkills: number;
    conflictStyle: string;
  };
  personalityProfile: {
    traits: string[];
    socialValues: string[];
    communityInvolvement: string[];
    familyDynamics: string;
  };
  financialProfile: {
    financialGoals: string[];
    moneyAttitude: string;
    careerAspirations: string[];
    workEthic: number;
  };
  lifeVision: {
    futurePlans: string[];
    relationshipGoals: string[];
    personalGrowth: string[];
    conflictResolutionStyle: string;
  };
  seductiveArchetype: {
    primaryArchetype: string;
    secondaryArchetype: string;
    traits: string[];
  };
  genderTropes: {
    primaryTrope: string;
    secondaryTrope: string;
    characteristics: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  media: Array<{
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  }>;
}
