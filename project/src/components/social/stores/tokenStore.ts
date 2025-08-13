import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenFeatures {
  deepface: number;
  textToVideo: number;
  textToPodcast: number;
  textToMindmap: number;
  textToImage: number;
  textToMusic: number;
}

interface TokenStore {
  tokens: number;
  features: TokenFeatures;
  addTokens: (amount: number) => void;
  useTokens: (feature: keyof TokenFeatures, amount: number) => boolean;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: 100,
      features: {
        deepface: 10,
        textToVideo: 20,
        textToPodcast: 15,
        textToMindmap: 5,
        textToImage: 10,
        textToMusic: 15,
      },
      addTokens: (amount) =>
        set((state) => ({ tokens: state.tokens + amount })),
      useTokens: (feature, amount) => {
        const currentState = get();
        if (currentState.features[feature] >= amount) {
          set((state) => ({
            features: {
              ...state.features,
              [feature]: state.features[feature] - amount,
            },
          }));
          return true;
        }
        return false;
      },
    }),
    {
      name: "token-store",
    }
  )
);
