import { ShoppingCart } from "lucide-react";

const products = [
  { name: "Apex Carbon Reel", price: "$849", type: "New Release", desc: "Precision engineered for deep-sea saltwater." },
  { name: "HydroScan V3", price: "$1,299", type: "Electronic", desc: "Real-time topographic sonar with depth-track." },
  { name: "Deep Bait Master", price: "$145", type: "Essentials", desc: "12 bioluminescent lures for night expeditions." },
  { name: "Nautical One Pro", price: "$550", type: "Wearable", desc: "Tide-tracking GPS, 100m depth resistance." },
  { name: "Offshore Tackle Box Pro", price: "$320", type: "Essentials", desc: "Waterproof with 24 compartments." },
  { name: "CarbonFlex Rod 9ft", price: "$720", type: "New Release", desc: "Ultra-light carbon fiber for precision casting." },
];

const MarketplacePage = () => (
  <div className="px-6 md:px-12 py-12 max-w-screen-xl mx-auto">
    <h1 className="text-4xl font-black text-[#cee5ff] mb-2">The Gear Locker</h1>
    <p className="text-[#a3cbf2]/60 mb-10">Premium equipment from verified sellers.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.name} className="bg-[#002238] border border-white/5 rounded-2xl p-6 hover:border-emerald-400/20 transition-all group">
          <div className="aspect-square bg-[#002c49] rounded-xl mb-4 flex items-center justify-center text-[#a3cbf2]/20 text-6xl font-black">
            🎣
          </div>
          <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">{p.type}</span>
          <h3 className="text-[#cee5ff] font-bold text-lg mt-1">{p.name}</h3>
          <p className="text-[#a3cbf2]/50 text-sm mt-1 mb-4">{p.desc}</p>
          <div className="flex justify-between items-center">
            <span className="text-[#cee5ff] font-black text-xl">{p.price}</span>
            <button className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MarketplacePage;
