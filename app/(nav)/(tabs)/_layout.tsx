import React from "react";
import { Tabs } from "expo-router";
;
import { ThemeToggle } from "~/components/ThemeToggle";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#17C5FF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Tabs>
  );
}
