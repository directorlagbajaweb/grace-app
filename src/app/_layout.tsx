import { useCallback, useEffect, useMemo, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

import { ONBOARDED_KEY, OnboardingContext } from "@/context/OnboardingContext";
import { deleteOldEntries, getOrCreateKey } from "@/services/storage";

// Keep the splash screen up until launch work has finished.
SplashScreen.preventAutoHideAsync().catch(() => {});

async function readOnboarded(): Promise<boolean> {
  // TEMP DEV: launching with ?reset=onboarding shows onboarding again. Dev builds only.
  if (__DEV__) {
    const url = await Linking.getInitialURL();
    if (url && Linking.parse(url).queryParams?.reset === "onboarding") {
      await AsyncStorage.removeItem(ONBOARDED_KEY);
    }
  }
  return (await AsyncStorage.getItem(ONBOARDED_KEY)) === "true";
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    Promise.all([
      getOrCreateKey(),
      deleteOldEntries(),
      readOnboarded().then(setOnboarded),
    ])
      .catch(() => {})
      .finally(() => {
        setReady(true);
        SplashScreen.hideAsync().catch(() => {});
      });
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDED_KEY, "true");
    } catch {
      // Never trap someone in onboarding because storage failed.
    }
    setOnboarded(true);
  }, []);

  const onboardingContext = useMemo(() => ({ completeOnboarding }), [completeOnboarding]);

  if (!ready) return null;

  return (
    <OnboardingContext.Provider value={onboardingContext}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="index" />
          <Stack.Screen name="response" />
          <Stack.Screen name="help" />
          <Stack.Screen name="today" />
          <Stack.Screen name="settings" />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        </Stack.Protected>
      </Stack>
    </OnboardingContext.Provider>
  );
}
