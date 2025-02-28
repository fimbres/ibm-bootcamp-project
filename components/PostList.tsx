import React from 'react';
import { View, Text, VirtualizedList } from 'react-native';
import { FolderArchiveIcon } from 'lucide-react-native';

import { Skeleton } from './ui/skeleton';
import PostCard from './PostCard';

import { Post } from '~/types/db';

interface PostListProps {
  data: Post[];
  isLoading: boolean;
  isFeed: boolean;
  emptyMessage: string;
}

const PostList: React.FC<PostListProps> = ({ isFeed, isLoading, data, emptyMessage }) => {
  if (isLoading) {
    return (
      <View style={{ flex: 1, gap: 16 }}>
        <Skeleton className="w-full h-[176]" />
        <Skeleton className="w-full h-[176]" />
        <Skeleton className="w-full h-[176]" />
      </View>
    );
  }

  return (
    <VirtualizedList
      data={data}
      keyExtractor={(_, i) => i.toString()}
      getItemCount={(data: Post[]) => data.length}
      getItem={(data: Post[], index: number) => data[index]}
      initialNumToRender={4}
      renderItem={({ item }) => <PostCard post={item} isFeed={isFeed} />}
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, gap: 16 }}
      ListEmptyComponent={() => (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <FolderArchiveIcon color="grey" size={100} />
          <Text style={{ fontWeight: '600', color: '#6b7280', marginTop: 16 }}>{emptyMessage}</Text>
        </View>
      )}
      ListFooterComponent={<View style={{ marginBottom: 40 }} />}
    />
  );
};

export default PostList;
