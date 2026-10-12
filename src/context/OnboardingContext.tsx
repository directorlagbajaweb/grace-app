import { createContext, useContext } from 'react';

export const ONBOARDED_KEY = 'grace.onboarded';

type OnboardingContextValue = {
  // Marks onboarding as done; the root layout's route guards then move to the Vent screen.
  completeOnboarding: () => Promise<void>;
};

export const OnboardingContext = createContext<OnboardingContextValue>({
  completeOnboarding: async () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);
