import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View>
        <Text className='text-sm text-muted-foreground'>¡La Pantalla No Existe!</Text>
        <Link href='/'>
          <Button>Ir a Inicio</Button>
        </Link>
      </View>
    </>
  );
}
