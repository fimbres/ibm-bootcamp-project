import { View } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import ImagePickerInput from "~/components/ImagePicker";

import { useAuth } from "~/providers/auth.provider";
import { CreatePostInput, PostService } from "~/services/post.service";
import { uploadImageToCloudinary } from "~/lib/utils";

const schema = z.object({
  content: z.string().min(1, { message: "Escríbe algo." }),
  file: z.any().optional(),
});

export default function Screen() {
  const { token } = useAuth();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });
  const { isLoading } = formState;
  type SchemaType = z.infer<typeof schema>;
  const postService = new PostService();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      const response = await postService.createPost(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries(["posts", "feed"]);
    },
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      let public_id: string | undefined = undefined;

      if (data.file) {
        public_id = await uploadImageToCloudinary(data.file?.uri);
        console.log(data.file, data.file?.uri, public_id);
      }

      mutate({
        text: data.content,
        media: public_id,
        token,
      });

      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 gap-5 px-4 pt-16 bg-secondary/30">
      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Label nativeID="content">Contenido</Label>
            <Input
              nativeID="content"
              placeholder="¿Qué tienes en mente?"
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
        name="file"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Label nativeID="file">Imagen</Label>
            <ImagePickerInput
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              onCancel={() => onChange(undefined)}
            />
          </>
        )}
      />
      <Button
        variant="primary"
        className="w-full"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text>Publicar</Text>
      </Button>
    </View>
  );
}
