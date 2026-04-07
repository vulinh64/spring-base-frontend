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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
