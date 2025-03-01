import { useMemo } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import PostList from "~/components/PostList";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/providers/auth.provider";

import { PostService } from "~/services/post.service";
import { UserService } from "~/services/user.service";

import { Post, User } from "~/types/db";
import { getInitials } from "~/lib/utils";

export default function UserScreen() {
  const { query } = useLocalSearchParams<{ user: string; query?: string }>();

  if(!query) router.back();

  const postService = new PostService();
  const userService = new UserService();
  const { user: currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useSuspenseQuery({
    queryKey: [`user-${query}-data`],
    queryFn: async () => {
      const userPosts = await postService.findPostsByUserId(token!, query!);
      const userFollowers = await userService.getFollowersByUserId(token!, query!);
      const userFollowing = await userService.getFollowingByUserId(token!, query!);

      return {
        userPosts: userPosts.data as Post[],
        userFollowers: userFollowers.data as User[],
        userFollowing: userFollowing.data as User[],
      };
    }
  });
  const user = useMemo(() => data.userPosts?.[0]?.user, [data]) as User;
  const followedData = useMemo(() => data.userFollowers.find(f => f.email === currentUser?.email), [data.userFollowers])
  const { mutate: follow } = useMutation({
    mutationFn: async () => {
      const response = await userService.followUser(token!, {
        follower: currentUser,
        following: user,
      });

      return !!response.data;
    },
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries([`user-${query}-data`]);
    }
  });
  const { mutate: unfollow } = useMutation({
    mutationFn: async () => {
      const response = await userService.unfollowUser(token!, query!);

      return !!response.data;
    },
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries([`user-${query}-data`]);
    }
  });

  const handleClick = () => !!followedData ? unfollow() : follow();

  return (
    <View className="flex-1 gap-5 bg-secondary/30">
      <Card className="w-full p-6 border-background rounded-b-2xl">
        <CardHeader className="items-center">
          <Avatar alt={`User ${user?.name}`} className="w-24 h-24">
            <AvatarFallback>
              <Text>{getInitials(user?.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">
            {user?.name.includes("@") ? "Rick Martínez" : user?.name}
          </CardTitle>
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
              <Text className="text-xl font-semibold">{data.userFollowers?.length || 0}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm text-muted-foreground">Seguidos</Text>
              <Text className="text-xl font-semibold">{data.userFollowing?.length || 0}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-sm text-muted-foreground">
                Publicaciones
              </Text>
              <Text className="text-xl font-semibold">
                {data.userPosts?.length || 0}
              </Text>
            </View>
          </View>
        </CardContent>
        <CardFooter>
          <Button variant={!!followedData ? "destructive" : "primary"} className="flex-1" onPress={handleClick}>
            <Text>{!!followedData ? "Dejar De Seguir" : "Seguir"}</Text>
          </Button>
        </CardFooter>
      </Card>
      <PostList
        isLoading={isLoading}
        isFeed={false}
        data={data.userPosts || []}
        emptyMessage="No ha creado publicaciones aún."
      />
    </View>
  );
}
