import "~/global.css";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

import { useColorScheme } from "~/lib/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";

import { useAuth } from "~/providers/auth.provider";

import Loader from "~/components/Loader";

export { ErrorBoundary } from "expo-router";

export default function NavLayout() {
  const hasMounted = useRef(false);
  const { colorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (!hasMounted.current) {
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      setAndroidNavigationBar(colorScheme);
      setIsColorSchemeLoaded(true);
      hasMounted.current = true;
    }
  }, [colorScheme]);

  useEffect(() => {
    if (!isLoading && !user && !token) {
      console.log(user, token);
      router.replace("/landing");
    }
  }, [isLoading, user, token, router]);

  if (isLoading || !isColorSchemeLoaded) {
    return <Loader />;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-post-modal"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
