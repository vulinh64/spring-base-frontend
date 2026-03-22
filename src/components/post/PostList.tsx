import type { PrefetchPostProjection } from "@/types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: PrefetchPostProjection[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-gray-500 py-8 text-center">No posts found.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
