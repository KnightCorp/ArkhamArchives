// data/mockProfiles.ts
import { CompatibilityProfile } from "../types/compatibility";

export const mockProfiles: CompatibilityProfile[] = [
  {
    id: "1",
    userId: "user1",
    coreValues: {
      values: ["authenticity", "growth", "passion"],
      attachmentStyle: "secure",
      emotionalIntelligence: 8,
      conflictResolution: 7,
    },
    lifestyle: {
      workLifeBalance: 8,
      longTermGoals: ["entrepreneurship", "travel", "family"],
      dailyHabits: ["meditation", "exercise", "reading"],
      healthPractices: ["yoga", "clean eating"],
      travelPreferences: ["adventure", "cultural"],
    },
    interests: {
      hobbies: ["photography", "rock climbing", "cooking"],
      passions: ["environmental conservation", "art"],
      socialActivities: ["hiking groups", "art galleries"],
      friendshipStyle: "close-knit circle",
    },
    communicationStyle: {
      primaryStyle: "direct",
      emotionalExpression: 7,
      listeningSkills: 8,
      conflictStyle: "collaborative",
    },
    personalityProfile: {
      traits: ["Mysterious Intellectual", "Creative", "Ambitious"],
      socialValues: ["authenticity", "growth"],
      communityInvolvement: ["local arts", "environmental"],
      familyDynamics: "independent but connected",
    },
    financialProfile: {
      financialGoals: ["investment", "entrepreneurship"],
      moneyAttitude: "balanced",
      careerAspirations: ["creative leadership"],
      workEthic: 9,
    },
    lifeVision: {
      futurePlans: ["international living", "creative projects"],
      relationshipGoals: ["growth-oriented partnership"],
      personalGrowth: ["continuous learning"],
      conflictResolutionStyle: "direct and empathetic",
    },
    seductiveArchetype: {
      primaryArchetype: "The Mysterious Intellectual",
      secondaryArchetype: "The Artistic Free Spirit",
      traits: ["depth", "creativity", "independence"],
    },
    genderTropes: {
      primaryTrope: "The Enigmatic Artist",
      secondaryTrope: "The Passionate Visionary",
      characteristics: ["depth", "intensity", "creativity"],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
      },
      {
        type: "video",
        url: "https://example.com/video.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
      },
    ],
  },
];
