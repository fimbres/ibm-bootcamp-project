import { useEffect } from "react";
import { View } from "react-native";
import { Loader2 } from "lucide-react-native";
import Animated, {
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const Loader = () => {
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 1000 }), -2, false);
  });
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${spin.value}deg`,
        },
      ],
    };
  });

  return (
    <View className="flex flex-1 justify-center items-center bg-primary-foreground">
      <LayoutAnimationConfig>
        <Animated.View style={style}>
          <Loader2 size={60} className="bg-brand" />
        </Animated.View>
      </LayoutAnimationConfig>
    </View>
  );
};

export default Loader;
