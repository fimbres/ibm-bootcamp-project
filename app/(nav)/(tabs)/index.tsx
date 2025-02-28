import { useMemo } from "react";
import { View } from "react-native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import PostList from "~/components/PostList";

import { useAuth } from "~/providers/auth.provider";
import { PostService } from "~/services/post.service";
import { getInitials } from "~/lib/utils";

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

export default function Screen() {
  const postService = new PostService();
  const { token, user } = useAuth();
  const { error, data: feedPosts, isLoading } = useSuspenseQuery({
    queryKey: ["feed", token],
    queryFn: async () => {
      const response = await postService.getFeed(token!);

      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
  });
  const { data: allPosts } = useSuspenseQuery({
    queryKey: ["posts", token],
    queryFn: async () => {
      const response = await postService.readPosts(token!);

      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
  });
  const shownPosts = useMemo(
    () => (
      !!feedPosts.length ? feedPosts : allPosts
    )
      .filter((p) => p.user.email !== user?.email)
      .sort((a, b) =>  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [feedPosts, allPosts]
  );
  
  return (
    <View className="flex-1 gap-5 bg-secondary/30">
      <View className="flex flex-row gap-4 w-full items-center pt-5 px-4">
        <Avatar alt={`User ${user?.name}`} className="w-14 h-14">
          <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
          <AvatarFallback>
            <Text>{getInitials(user?.name)}</Text>
          </AvatarFallback>
        </Avatar>
        <Input
          className="flex-1"
          placeholder="Escribe algo..."
          editable={false}
          onPress={() => router.push("/(nav)/create-post-modal")}
        />
      </View>
      <PostList
        title={!feedPosts.length ? "Explora publicaciones" : undefined}
        isLoading={isLoading}
        isFeed={true}
        data={shownPosts}
        emptyMessage="No hay publicaciones para ver."
      />
    </View>
  );
}
