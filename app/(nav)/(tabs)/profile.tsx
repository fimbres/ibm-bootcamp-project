import { useMemo } from "react";
import { View } from "react-native";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import PostList from "~/components/PostList";

import { useAuth } from "~/providers/auth.provider";
import { PostService } from "~/services/post.service";
import { getInitials } from "~/lib/utils";

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

export default function MyProfileScreen() {
  const postService = new PostService();
  const { user, token } = useAuth();
  const { error, data, isLoading } = useSuspenseQuery({
    queryKey: ["posts", token],
    queryFn: async () => {
      const response = await postService.readPosts(token!);
      
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    }
  });
  const myPosts = useMemo(() => data.filter(p => p.user.email === user?.email), [data]);

  return (
    <View className="flex-1 gap-5 bg-secondary/30">
      <Card className="w-full p-6 border-background rounded-b-2xl">
        <CardHeader className="items-center">
          <Avatar alt={`User ${user?.name}`} className="w-24 h-24">
            <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
            <AvatarFallback>
              <Text>{getInitials(user?.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">{user?.name.includes("@") ? "Rick Martínez" : user?.name}</CardTitle>
          <View className="flex-row">
            <CardDescription className="text-base font-semibold">
              {user?.email}
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="flex flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-sm text-muted-foreground">Seguidores</Text>
              <Text className="text-xl font-semibold">{0}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm text-muted-foreground">Seguidos</Text>
              <Text className="text-xl font-semibold">{0}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm text-muted-foreground">Publicaciones</Text>
              <Text className="text-xl font-semibold">{myPosts.length || 0}</Text>
            </View>
          </View>
        </CardContent>
      </Card>
      <PostList
        isLoading={isLoading}
        isFeed={false}
        data={myPosts}
        emptyMessage="No has creado publicaciones aún."
      />
    </View>
  );
}
