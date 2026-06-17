import React from 'react';

export const PostSkeleton = () => (
  <div className="bg-[#002238] border border-white/5 rounded-2xl p-5 mb-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-white/5" />
      <div className="space-y-2">
        <div className="w-32 h-4 bg-white/5 rounded" />
        <div className="w-20 h-3 bg-white/5 rounded" />
      </div>
    </div>
    <div className="space-y-3 mb-4">
      <div className="w-full h-4 bg-white/5 rounded" />
      <div className="w-5/6 h-4 bg-white/5 rounded" />
      <div className="w-4/6 h-4 bg-white/5 rounded" />
    </div>
    <div className="w-full h-48 bg-white/5 rounded-xl mb-4" />
    <div className="flex gap-6 pt-4 border-t border-white/5">
      <div className="w-8 h-4 bg-white/5 rounded" />
      <div className="w-8 h-4 bg-white/5 rounded" />
      <div className="w-8 h-4 bg-white/5 rounded" />
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="bg-[#002238] border border-white/5 rounded-2xl p-5 animate-pulse">
    <div className="w-24 h-4 bg-white/5 rounded mb-4" />
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-24 h-3 bg-white/5 rounded" />
            <div className="w-16 h-2 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);


export const CommentSkeleton = () => (
  <div className="flex gap-3 mt-5 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
    <div className="flex-1">
      <div className="bg-[#001526] p-4 rounded-2xl rounded-tl-none border border-white/5 space-y-3">
        <div className="w-24 h-3 bg-white/10 rounded" />
        <div className="w-full h-3 bg-white/5 rounded" />
        <div className="w-2/3 h-3 bg-white/5 rounded" />
      </div>
    </div>
  </div>
);