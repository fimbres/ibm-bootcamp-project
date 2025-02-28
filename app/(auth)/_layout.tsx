import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack initialRouteName='index' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='login' />
      <Stack.Screen name='signup' />
    </Stack>
  );
}
