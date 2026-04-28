import { useState, useEffect } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";

const BoatWizard = ({ boat, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: boat?.name || "",
    capacity: boat?.capacity || "",
    description: boat?.description || "",
    images: [],
    existingImages: [],
    imagesToDelete: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (boat && boat.images) {
      // Map API array to our local state objects
      const existing = boat.images.map(img => ({ 
        id: img.id,
        url: img.imageUrl,
        isMainImage: img.isMainImage
      }));
      setFormData(prev => ({ ...prev, existingImages: existing }));
    }
  }, [boat]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Boat name is required";
    if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = "Capacity must be greater than 0";
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    if (!boat && formData.images.filter(img => img !== null).length !== 3) {
      newErrors.images = "Please upload exactly 3 images";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = [...formData.images];
      newImages[index] = ev.target.result;
      setFormData({ ...formData, images: newImages });
      if (errors.images) setErrors({ ...errors, images: null });
    };
    reader.readAsDataURL(file);
  };

  const removeNewImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData({ ...formData, images: newImages });
  };

  const removeExistingImage = (index, imageId) => {
    const newExistingImages = [...formData.existingImages];
    newExistingImages.splice(index, 1);
    setFormData({
      ...formData,
      existingImages: newExistingImages,
      imagesToDelete: [...formData.imagesToDelete, imageId] // Passing the exact GUID to delete
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const saveData = {
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity),
        description: formData.description.trim(),
      };

      if (boat) {
        saveData.newImages = formData.images.filter(img => img !== null);
        saveData.imagesToDelete = formData.imagesToDelete;
        
        // Find existing main image ID, fallback to first image ID if main was deleted
        const mainImg = formData.existingImages.find(img => img.isMainImage);
        if (mainImg) {
          saveData.mainImageId = mainImg.id;
        } else if (formData.existingImages.length > 0) {
          saveData.mainImageId = formData.existingImages[0].id;
        }
      } else {
        saveData.images = formData.images;
      }

      await onSave(saveData);
    } catch (error) {
      console.error("Error saving boat:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ImageUploadBox = ({ index, image, onUpload, onRemove }) => (
    <div className="relative aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-sky-400/30 overflow-hidden transition-all duration-200">
      {image ? (
        <>
          <img src={image} alt={`New Boat ${index + 1}`} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-500 transition-colors"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
        <button onClick={onClose} className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all" disabled={isSubmitting}>
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-6 space-y-5">
        
        {/* Basic Fields */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Boat Name *</label>
          <input
            type="text"
            placeholder="e.g., Sea Hunter, Flat Master"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            className={`w-full bg-[#001526] border rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 transition-all ${errors.name ? 'border-red-500/50' : 'border-white/5'}`}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-400/80 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Capacity (persons) *</label>
          <input
            type="number"
            min="1"
            placeholder="Maximum guests"
            value={formData.capacity}
            onChange={(e) => {
              setFormData({ ...formData, capacity: e.target.value });
              if (errors.capacity) setErrors({ ...errors, capacity: null });
            }}
            className={`w-full bg-[#001526] border rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 transition-all ${errors.capacity ? 'border-red-500/50' : 'border-white/5'}`}
            disabled={isSubmitting}
          />
          {errors.capacity && <p className="text-red-400/80 text-xs mt-1">{errors.capacity}</p>}
        </div>

        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Description *</label>
          <textarea
            rows={4}
            placeholder="Describe your boat's features (min 20 chars)"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: null });
            }}
            className={`w-full bg-[#001526] border rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 resize-none transition-all ${errors.description ? 'border-red-500/50' : 'border-white/5'}`}
            disabled={isSubmitting}
          />
          {errors.description && <p className="text-red-400/80 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Existing Images */}
        {boat && formData.existingImages.length > 0 && (
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Current Images</label>
            <div className="grid grid-cols-3 gap-3">
              {formData.existingImages.map((img, idx) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#001526]">
                  <img 
                    src={img.url.startsWith('http') ? img.url : `https://hook.runasp.net${img.url}`} 
                    alt={`Boat ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  {img.isMainImage && (
                    <span className="absolute bottom-1 left-1 bg-sky-500/90 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Main</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx, img.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-500 transition-colors"
                    disabled={isSubmitting}
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            {boat ? "Add New Images (Optional)" : "Images (Exactly 3) *"}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => (
              <ImageUploadBox
                key={idx}
                index={idx}
                image={formData.images[idx]}
                onUpload={handleImageUpload}
                onRemove={removeNewImage}
              />
            ))}
          </div>
          {errors.images && <p className="text-red-400/80 text-xs mt-2">{errors.images}</p>}
        </div>

      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm transition-all" disabled={isSubmitting}>
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 transition-all flex items-center gap-2">
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {boat ? (isSubmitting ? "Updating..." : "Update Boat") : (isSubmitting ? "Saving..." : "Save Boat")}
        </button>
      </div>
    </div>
  );
};

export default BoatWizard;