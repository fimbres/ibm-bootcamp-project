import { FC } from 'react';
import { View, Text } from 'react-native'
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendIcon } from 'lucide-react-native';

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { useAuth } from '~/providers/auth.provider';
import { PostService } from '~/services/post.service';
import { getInitials } from '~/lib/utils';
import { Post } from '~/types/db';

const schema = z.object({
  comment: z.string().min(1, { message: "Escríbe algo." }),
});

interface CommentFormProps {
  post: Post;
}

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

const CommentForm: FC<CommentFormProps> = ({ post }) => {
  const { user, token } = useAuth();
  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const { isLoading } = formState;
  type SchemaType = z.infer<typeof schema>;
  const postService = new PostService();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({ comment }: { comment: string }) => {
      const response = await postService.commentPost(token!, {
        post,
        comment
      });
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
      mutate(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <View className="flex flex-row items-center gap-2 mt-2">
      <Avatar alt={`User ${user?.name}`} className="w-14 h-14">
      <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
        <AvatarFallback>
          <Text>{getInitials(user?.name)}</Text>
        </AvatarFallback>
      </Avatar>
      <Controller
        control={control}
        name="comment"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder='Di que piensas.'
            className='flex-1'
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <Button 
        variant="secondary" 
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <SendIcon size={20} color="white" />
      </Button>
    </View>
  )
}

export default CommentForm;
