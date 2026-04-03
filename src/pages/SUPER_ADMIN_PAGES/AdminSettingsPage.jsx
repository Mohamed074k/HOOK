import { useState, useEffect } from "react";

const AdminSettingsPage = () => {
  const [animate, setAnimate] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      <div 
        className="transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Platform Settings</h1>
      </div>
      
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl divide-y divide-white/5 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        {[
          { label: "Platform Name", value: "HOOK", type: "text" },
          { label: "Support Email", value: "support@hook.io", type: "email" },
          { label: "Commission Rate (%)", value: "8", type: "number" },
        ].map(({ label, value, type }) => (
          <div key={label} className="flex items-center justify-between px-6 py-5 flex-wrap gap-3 hover:bg-white/[0.02] transition-colors">
            <label className="text-[#cee5ff]/80 text-sm font-medium">{label}</label>
            <input
              type={type}
              defaultValue={value}
              className="bg-[#001526] border border-white/5 rounded-lg px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/20 w-48 sm:w-64 transition-all duration-300 shadow-sm hover:border-sky-400/20"
            />
          </div>
        ))}

        {[
          { label: "Maintenance Mode", defaultChecked: false },
          { label: "Allow New Registrations", defaultChecked: true },
          { label: "Email Notifications", defaultChecked: true },
        ].map(({ label, defaultChecked }) => (
          <div key={label} className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors">
            <span className="text-[#cee5ff]/80 text-sm font-medium">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
              <div className="w-11 h-6 bg-[#001526] border border-white/10 rounded-full peer peer-checked:bg-sky-500 peer-checked:border-sky-500 transition-colors duration-300" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm" />
            </label>
          </div>
        ))}
      </div>

      <div 
        className="flex items-center gap-4 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <button 
          onClick={handleSave}
          className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          Save Changes
        </button>
        {saved && (
          <span className="text-teal-400 text-sm font-medium animate-[fadeUp_0.3s_ease-out]">
            ✓ Settings updated successfully
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;