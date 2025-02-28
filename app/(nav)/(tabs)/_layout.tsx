import React from "react";
import { Link, Tabs, router } from "expo-router";
import { BellDotIcon, HomeIcon, PlusIcon, UserIcon } from "lucide-react-native";

import { ThemeToggle } from "~/components/ThemeToggle";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#17C5FF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerLeftContainerStyle: { paddingLeft: 10 },
          tabBarIcon: (props) => <HomeIcon {...props} />,
          headerLeft: () => <BellDotIcon color='grey' />,
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tabs.Screen
        name="create-post"
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/create-post-modal");
          },
        })}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Link href='/create-post-modal' asChild>
              <View className="flex justify-center items-center w-16 h-16 bg-brand rounded-full">
                <PlusIcon size={28} color='white' />
              </View>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mi Perfil",
          tabBarIcon: (props) => <UserIcon {...props} />,
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Tabs>
  );
}
