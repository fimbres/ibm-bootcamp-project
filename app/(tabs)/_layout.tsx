import React from 'react';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '~/components/useClientOnlyValue';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: "#17C5FF",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Feed',
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Tabs>
  );
}
