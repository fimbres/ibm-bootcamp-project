import { FC, useState } from 'react'
import { Text, View } from 'react-native'
import { HeartIcon, MessageCircleIcon } from 'lucide-react-native';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Post } from '~/types/db'
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { getInitials } from '~/lib/utils';

interface PostCardProps {
  post: Post;
  isFeed: boolean;
}

const PostCard: FC<PostCardProps> = ({ post, isFeed }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row gap-2 items-center'>
        <Avatar alt={`User ${post.user.name}`} className="w-14 h-14">
          <AvatarFallback>
            <Text>{getInitials(post.user.name)}</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <CardTitle>
            {post.user.name}
          </CardTitle>
          <CardDescription>
            {post.user.email}
          </CardDescription>
        </View>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-lg'>
          {post.text}
        </CardDescription>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <View className='flex-1 flex-row mb-4 mt-2 gap-2'>
          <Button variant="ghost" className='flex-row gap-2'>
            <Text className='text-red-500'>{post.likes.length}</Text>
            <HeartIcon color="red" />
          </Button>
          <Button variant="ghost" className='flex-row gap-2 text-primary-foreground' onPress={() => setShowDescription(s => !s)}>
            <Text className='text-white'>{post.comments.length}</Text>
            <MessageCircleIcon color='white' />
          </Button>
          {!isFeed && (
            <Button variant="destructive" className='flex-1'>
              <Text>
                Eliminar
              </Text>
            </Button>
          )}
        </View>
        ({showDescription && (
          <View className='w-full px-2 gap-2'>
            {post.comments.map(c => (
              <Text className='text-sm text-neutral-500'>{c}</Text>
            ))}
          </View>
        )})
      </CardFooter>
    </Card>
  )
}

export default PostCard
