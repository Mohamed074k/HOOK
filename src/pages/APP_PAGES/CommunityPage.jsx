const CommunityPage = () => (
  <div className="px-6 md:px-12 py-12 max-w-screen-xl mx-auto">
    <h1 className="text-4xl font-black text-[#cee5ff] mb-2">Archive Feed</h1>
    <p className="text-[#a3cbf2]/60 mb-10">Live updates from the global community of captains and explorers.</p>
    <div className="space-y-6 max-w-2xl">
      {[
        { user: "Elias Janssen", role: "Captain", time: "2h ago", text: "Absolute unit caught off the coast of Iceland. The Apex Carbon Reel held its own. Best expedition this year! 🎣", likes: 428, comments: 24 },
        { user: "Sofia Reyes", role: "Explorer", time: "5h ago", text: "Just returned from the Azores. Spectacular waters, incredible blue marlin sightings. Highly recommend hiring a local guide.", likes: 312, comments: 18 },
        { user: "Marco Fischetti", role: "Guide", time: "1d ago", text: "New trip available: 3-day North Sea deep sea challenge. Limited slots. DM for details!", likes: 189, comments: 42 },
      ].map((post) => (
        <article key={post.user} className="bg-[#002238] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
              {post.user.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="font-bold text-[#cee5ff] text-sm">{post.user}</p>
              <p className="text-[10px] text-[#a3cbf2]/40 uppercase tracking-tight">{post.role} · {post.time}</p>
            </div>
          </div>
          <p className="text-[#cee5ff]/80 mb-4 leading-relaxed">{post.text}</p>
          <div className="flex gap-6 text-sm text-[#a3cbf2]/40">
            <button className="hover:text-sky-400 transition-colors">❤️ {post.likes}</button>
            <button className="hover:text-sky-400 transition-colors">💬 {post.comments}</button>
            <button className="hover:text-sky-400 transition-colors">↗ Share</button>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default CommunityPage;
