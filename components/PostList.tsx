import type { FC } from 'react'
import { View, Text, VirtualizedList } from 'react-native'
import { FolderArchiveIcon } from 'lucide-react-native';

import { Skeleton } from './ui/skeleton';
import PostCard from './PostCard';

import { Post } from '~/types/db'

interface PostListProps {
  data: Post[];
  isLoading: boolean;
  isFeed: boolean;
  emptyMessage: string;
}

const PostList: FC<PostListProps> = ({ isFeed, isLoading, data, emptyMessage }) => {
  if(isLoading) {
    return (
      <View className="flex-1 gap-4">
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
      </View>
    );
  }

  return (
    <VirtualizedList
      data={data}
      keyExtractor={(_, i) => i.toString()}
      getItemCount={(data: Post[]) => data.length}
      getItem={(data: Post[], id: number) => data[id]}
      initialNumToRender={4}
      renderItem={({item}) => <PostCard post={item} isFeed={isFeed} />}
      contentContainerClassName="flex-1"
      ListEmptyComponent={() => (
        <View className="flex-1 w-full justify-center items-center">
          <FolderArchiveIcon color="grey" size={100} />
          <Text className="font-semibold text-accent-foreground mt-4">{emptyMessage}</Text>
        </View>
      )}
    />
  )
}

export default PostList;
