import { useEffect, useState } from "react";
import { View, Image, Dimensions } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { Link } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Separator } from "~/components/ui/separator";

import Logo from "~/assets/images/icon.png";

export default function LandingScreen() {
  const width = Dimensions.get("screen").width / 3 || 128;
  const labels = ["Escribe", "Expresa", "Comparte"];
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((prevIndex) => (prevIndex + 1) % labels.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/50">
      <View className="flex justify-center items-center space-y-5 mb-20">
        <Image
          source={Logo}
          width={width}
          height={width}
          style={{ width, height: width }}
        />
        <Text className="font-bold text-5xl text-brand">Pio</Text>
        <LayoutAnimationConfig skipEntering>
          <Animated.View
            key={labels[labelIndex]}
            entering={FadeInUp}
            exiting={FadeOutDown}
          >
            <Text className="font-bold text-foreground" numberOfLines={1}>
              {labels[labelIndex]}
            </Text>
          </Animated.View>
        </LayoutAnimationConfig>
      </View>
      <View>
        <Button variant="primary">
          <Link href="/signup">
            <Text>Únete Gratis</Text>
          </Link>
        </Button>
        <Separator orientation="horizontal" className="my-1.5" />
        <Button variant="link">
          <Link href="/login">
            <Text>Inicia Sesión</Text>
          </Link>
        </Button>
      </View>
    </View>
  );
}
