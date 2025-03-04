import * as React from "react";
import { View, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { useAuth } from "~/providers/auth.provider";

import Logo from "~/assets/images/icon.png";

const schema = z.object({
  email: z.string().email({ message: "Correo inválido." }),
  password: z.string().min(8, {
    message: "La contraseña debe ser mayor a 8 carácteres.",
  }),
});

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });
  const { isLoading } = formState;
  type SchemaType = z.infer<typeof schema>;
  const width = Dimensions.get("screen").width / 4 || 128;

  const onSubmit = async (data: SchemaType) => {
    try {
      await signIn(data);
  
      router.push("/(nav)/(tabs)");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-3 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardHeader className="items-center">
          <Image
            source={Logo}
            width={width}
            height={width}
            style={{ width, height: width }}
          />
          <CardTitle className="pb-2 text-center text-lg">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Label nativeID="email">Correo</Label>
                <Input
                  nativeID="email"
                  autoComplete="email"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  placeholder="jose@ejemplo.com"
                  editable={!isLoading}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Label nativeID="password">Contraseña</Label>
                <Input
                  nativeID="password"
                  secureTextEntry={true}
                  autoComplete="password"
                  placeholder="******"
                  textContentType="password"
                  editable={!isLoading}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </>
            )}
          />
        </CardContent>
        <CardFooter className="flex-col gap-3 pb-0">
          <Button
            variant="primary"
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text>Iniciar Sesión</Text>
          </Button>
          <Button variant="link" onPress={router.back} disabled={isLoading}>
            <Text>Atrás</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
