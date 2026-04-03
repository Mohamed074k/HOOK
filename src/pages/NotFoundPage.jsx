import { Link } from "react-router-dom";
import { Anchor } from "lucide-react";

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#001526] flex flex-col items-center justify-center text-center p-6">
    <div className="flex items-center gap-2 text-4xl font-black text-[#cee5ff] mb-8">
      <Anchor className="text-sky-400" size={32} />
      HOOK
    </div>
    <h1 className="text-8xl font-black text-[#cee5ff]">404</h1>
    <p className="text-2xl font-bold text-[#a3cbf2]/60 mt-4">Lost at Sea</p>
    <p className="text-[#a3cbf2]/40 mt-2 max-w-sm">The page you're looking for has drifted off. Let's get you back to shore.</p>
    <Link
      to="/"
      className="mt-8 bg-sky-400 text-[#003353] px-8 py-3 rounded-xl font-bold hover:bg-sky-300 transition-colors"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
