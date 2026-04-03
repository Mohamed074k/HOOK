// components/FISHING_GUIDE_COMPONENTS/BoatWizard.jsx
import { useState } from "react";
import { X, ImagePlus, Ship } from "lucide-react";

const BoatWizard = ({ boat, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: boat?.name || "",
    capacity: boat?.capacity || "",
    description: boat?.description || "",
    images: boat?.images || [null, null, null],
  });

  const handleImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = [...formData.images];
      newImages[index] = ev.target.result;
      setFormData({ ...formData, images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Boat name is required");
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      alert("Capacity must be greater than 0");
      return;
    }
    const imageCount = formData.images.filter(img => img !== null).length;
    if (imageCount !== 3) {
      alert("Please upload exactly 3 images");
      return;
    }

    onSave({
      name: formData.name,
      capacity: parseInt(formData.capacity),
      description: formData.description,
      images: formData.images,
    });
  };

  const ImageUploadBox = ({ index, image, onUpload, onRemove }) => (
    <div className="relative aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-sky-400/30 overflow-hidden transition-all duration-200">
      {image ? (
        <>
          <img src={image} alt={`Boat ${index + 1}`} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-500 transition-colors"
          >
            <X size={12} className="text-white" />
          </button>
        </>
      ) : (
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
          <ImagePlus size={24} className="text-[#a3cbf2]/30 group-hover:text-sky-400/60 transition-colors" />
          <span className="text-[#a3cbf2]/20 text-xs mt-1">Image {index + 1}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(index, e.target.files[0])}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">
            {boat ? "Edit Boat" : "Add New Boat"}
          </h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">
            {boat ? "Update boat information" : "Register your boat to use in trips"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-6 space-y-5">
        {/* Boat Name */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Boat Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Sea Hunter, Flat Master, Sunset Dream"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Capacity (persons) *
          </label>
          <input
            type="number"
            min="1"
            placeholder="Maximum number of guests"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Description (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Describe your boat's features, equipment, amenities..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200 resize-none"
          />
        </div>

        {/* Images - Exactly 3 */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Images (Exactly 3) *
          </label>
          <p className="text-[#a3cbf2]/30 text-xs mb-3">
            Please upload exactly 3 images of your boat
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => (
              <ImageUploadBox
                key={idx}
                index={idx}
                image={formData.images[idx]}
                onUpload={handleImageUpload}
                onRemove={removeImage}
              />
            ))}
          </div>
          {formData.images.filter(img => img !== null).length !== 3 && (
            <p className="text-yellow-400/60 text-xs mt-2">
              ⚠️ {3 - formData.images.filter(img => img !== null).length} more image(s) required
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 hover:-translate-y-0.5 transition-all"
        >
          {boat ? "Update Boat" : "Save Boat"}
        </button>
      </div>
    </div>
  );
};

export default BoatWizard;