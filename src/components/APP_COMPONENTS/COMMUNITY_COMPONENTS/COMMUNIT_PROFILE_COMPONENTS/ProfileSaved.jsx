import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../PostCard";
import { PostSkeleton } from "../CommunitySkeletons";
import { Bookmark } from "lucide-react";

const ProfileSaved = ({ posts, isLoading }) => {
  if (isLoading) return <div className="space-y-6">{Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)}</div>;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark size={48} className="mx-auto text-white/5 mb-4" />
        <p className="text-[#a3cbf2]/50 font-medium">No saved posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {posts.map(post => <PostCard key={post.id} post={post} onShare={() => {}} />)}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSaved;