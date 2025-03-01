import { FC, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { HeartIcon, MessageCircleIcon } from "lucide-react-native";
import { AdvancedImage } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import CommentForm from "./CommentForm";

import { PostService } from "~/services/post.service";
import { useAuth } from "~/providers/auth.provider";
import { getInitials } from "~/lib/utils";
import { Post } from "~/types/db";

interface PostCardProps {
  post: Post;
  isFeed: boolean;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_NAME,
  }
});

const PostCard: FC<PostCardProps> = ({ post, isFeed }) => {
  const { user, token } = useAuth();
  const [showDescription, setShowDescription] = useState(false);
  const queryClient = useQueryClient();
  const postService = new PostService();
  const likeData = useMemo(() => 
    post.likes.find(
      l => l.user.email === user?.email), 
    [post.likes]
  );
  const { mutate: like } = useMutation({
    mutationFn: async () => {
      const response = await postService.likePost(token!, {
        post,
        user,
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
  const { mutate: unlike } = useMutation({
    mutationFn: async () => {
      const response = await postService.unlikePost(token!, likeData?.id!);
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
  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      const response = await postService.deletePost(token!, post.id);
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
  const imageUrl = !post.media ? 
    undefined : 
    cld
      .image(post.media)
      .resize(
        thumbnail()
        .width(350)
        .height(180)
        .gravity(
          autoGravity()
        )
      );

  const handleLike = () => !!likeData ? unlike() : like();
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row gap-2 items-center">
        <View className="flex flex-row items-center gap-2">
          <Avatar alt={`User ${post.user.name}`} className="w-14 h-14">
            <AvatarFallback>
              <Text>{getInitials(post.user.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View>
            <CardTitle>{post.user.name}</CardTitle>
            <CardDescription>{post.user.email}</CardDescription>
          </View>
        </View>
        <View className="flex-1 items-end">
          {isFeed && (
            <Button size="sm" onPress={() => router.push(`/(nav)/user-profile-modal?query=${post.user.id}`)}>
              <Text>Ver Perfil</Text>
            </Button>
          )}
        </View>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg">{post.text}</CardDescription>
        {imageUrl && (
          <AdvancedImage
            cldImg={imageUrl}
            className="w-full rounded-md mt-4"
            height={180}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <View className="flex-1 flex-row mb-4 mt-2 gap-2 justify-between w-full">
          <View className="flex flex-row">
            <Button variant="ghost" size="sm" className="flex-row gap-2" onPress={handleLike}>
              <Text className="text-red-500">{post.likes.length}</Text>
              <HeartIcon size={20} color="red" fill={!!likeData ? "red" : "transparent"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-row gap-2 text-primary-foreground"
              onPress={() => setShowDescription((s) => !s)}
            >
              <Text className="text-white">{post.comments.length}</Text>
              <MessageCircleIcon size={20} color="white" />
            </Button>
          </View>
          {user?.email === post.user.email && (
            <Button size="sm" variant="destructive" onPress={() => deletePost()}>
              <Text>Eliminar</Text>
            </Button>
          )}
        </View>
        {showDescription && (
          <View className="w-full px-2 gap-3">
            {post.comments.map((c) => (
              <View key={c.id} className="flex flex-1 flex-row items-center gap-2">
                <Avatar alt={`User ${post.user.name}`} className="w-10 h-10">
                  <AvatarFallback>
                    <Text>{getInitials(post.user.name)}</Text>
                  </AvatarFallback>
                </Avatar>
                <Text className="text-sm text-neutral-500">{c.comment}</Text>
              </View>
            ))}
            {isFeed && (
              <CommentForm post={post} />
            )}
          </View>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
