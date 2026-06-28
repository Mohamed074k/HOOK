// src/components/BOAT_OWNER_COMPONENTS/TripWizard.jsx
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Check, X, Upload, ImagePlus, Trash2,
  Compass, Fish, Waves, MapPin, Users, Loader2,
} from "lucide-react";
import { useBoats } from "../../context/BOAT_OWNER_CONTEXT/BoatContext";
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Trip Location" },
  { id: 3, label: "Boat & Pricing" },
  { id: 4, label: "Media" },
];

const defaultForm = {
  title: "",
  shortDescription: "",
  detailedDescription: "",
  locationName: "",
  address: "",
  latitude: "",
  longitude: "",
  boatId: "",
  pricePerPerson: "",
  maxParticipants: "",
  options: {
    guidedTrip: false,
    equipmentRental: false,
    snorkeling: false,
  },
  coverPreview: null,
  newCoverPreview: null,
  galleryPreviews: [],
  newGalleryPreviews: [],
  imagesToDelete: [],
  mainImageId: null,
  existingImages: [],
};

const Label = ({ children }) => (
  <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
    {children}
  </label>
);

const Input = ({ label, ...props }) => (
  <div>
    {label && <Label>{label}</Label>}
    <input
      {...props}
      className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20
        focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    {label && <Label>{label}</Label>}
    <select
      {...props}
      className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm
        focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200 appearance-none"
    >
      {children}
    </select>
  </div>
);

const Textarea = ({ label, rows = 4, ...props }) => (
  <div>
    {label && <Label>{label}</Label>}
    <textarea
      {...props}
      rows={rows}
      className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20
        focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200 resize-none"
    />
  </div>
);

const Step1 = ({ form, set }) => (
  <div className="space-y-5">
    <Input 
      label="Trip Title *" 
      placeholder="e.g., Deep Sea Adventure — Gulf of Mexico" 
      value={form.title} 
      onChange={e => set("title", e.target.value)} 
    />
    
    <Textarea 
      label="Short Description *" 
      rows={2}
      placeholder="Quick summary that appears in the card" 
      value={form.shortDescription} 
      onChange={e => set("shortDescription", e.target.value)} 
    />
    
    <Textarea 
      label="Detailed Description *" 
      rows={6}
      placeholder="Complete trip description including: trip type, duration, expected experience, what's included, what to bring, etc."
      value={form.detailedDescription} 
      onChange={e => set("detailedDescription", e.target.value)} 
    />
  </div>
);

const Step2 = ({ form, set }) => (
  <div className="space-y-5">
    <Input 
      label="Location Name *" 
      placeholder="e.g., Hurghada Marina, Key Biscayne Bay" 
      value={form.locationName} 
      onChange={e => set("locationName", e.target.value)} 
    />
    
    <Input 
      label="Address *" 
      placeholder="Street address for navigation" 
      value={form.address} 
      onChange={e => set("address", e.target.value)} 
    />
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input 
        label="Latitude (Optional)" 
        placeholder="e.g., 25.2048" 
        value={form.latitude} 
        onChange={e => set("latitude", e.target.value)} 
      />
      <Input 
        label="Longitude (Optional)" 
        placeholder="e.g., 55.2708" 
        value={form.longitude} 
        onChange={e => set("longitude", e.target.value)} 
      />
    </div>
  </div>
);

const Step3 = ({ form, set, boats, loadingBoats }) => {
  const selectedBoat = boats.find(b => b.id === form.boatId);
  const maxCapacity = selectedBoat?.capacity || 0;
  
  const handleBoatChange = (e) => {
    set("boatId", e.target.value);
    if (form.maxParticipants > maxCapacity) {
      set("maxParticipants", "");
    }
  };
  
  return (
    <div className="space-y-5">
      <Select 
        label="Select Boat *" 
        value={form.boatId} 
        onChange={handleBoatChange}
      >
        <option value="">Select a boat...</option>
        {boats.map(boat => (
          <option key={boat.id} value={boat.id}>
            {boat.name} (Capacity: {boat.capacity})
          </option>
        ))}
      </Select>
      
      {loadingBoats && (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={24} className="text-sky-400 animate-spin" />
        </div>
      )}
      
      {selectedBoat && (
        <div className="bg-teal-400/5 border border-teal-400/15 rounded-xl p-3">
          <p className="text-[#a3cbf2]/50 text-xs flex items-center gap-1">
            <Users size={12} /> Selected boat capacity: <span className="text-teal-400 font-bold">{selectedBoat.capacity}</span> persons
          </p>
        </div>
      )}
      
      <div className="relative">
        <Label>Price per Person ($) *</Label>
        <span className="absolute left-4 top-[calc(1.5rem+0.375rem)] text-[#a3cbf2]/40 text-sm pointer-events-none">$</span>
        <input
          type="number" 
          min="0.01" 
          step="0.01"
          placeholder="0.00" 
          value={form.pricePerPerson}
          onChange={e => set("pricePerPerson", e.target.value)}
          className="w-full bg-[#001526] border border-white/5 rounded-xl pl-8 pr-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
        />
      </div>
      
      <div>
        <Label>Max Participants *</Label>
        <input
          type="number"
          min="1"
          max={maxCapacity || undefined}
          placeholder={`Max ${maxCapacity || '?'} persons`}
          value={form.maxParticipants}
          onChange={e => set("maxParticipants", e.target.value)}
          className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
        />
        {form.maxParticipants && maxCapacity && parseInt(form.maxParticipants) > maxCapacity && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span>⚠️</span> Max participants cannot exceed boat capacity ({maxCapacity})
          </p>
        )}
      </div>
      
      {form.pricePerPerson && form.maxParticipants && (
        <div className="bg-sky-400/5 border border-sky-400/15 rounded-xl p-4">
          <p className="text-[#a3cbf2]/50 text-xs mb-1">Estimated revenue per trip</p>
          <p className="text-sky-400 font-black text-2xl">
            ${(parseFloat(form.pricePerPerson || 0) * parseInt(form.maxParticipants || 0)).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

const Step4 = ({ form, set, isEditing }) => {
  const coverRef = useRef(null);
  const galleryRef = useRef(null);
  
  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5MB Max File Size Verification to fix backend error
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image size must be less than 5MB");
      if (coverRef.current) coverRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      set("newCoverPreview", ev.target.result);
      set("coverPreview", ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // 5MB Max File Size Verification to fix backend error
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        set("newGalleryPreviews", prev => [...(prev || []), ev.target.result]);
        set("galleryPreviews", prev => [...(prev || []), ev.target.result]);
      };
      reader.readAsDataURL(file);
    });

    if (galleryRef.current) galleryRef.current.value = "";
  };
  
  const removeExistingImage = (imageId) => {
    set("imagesToDelete", [...form.imagesToDelete, imageId]);
    set("existingImages", form.existingImages.filter(img => img.id !== imageId));
  };
  
  const removeNewGalleryImage = (idx) => {
    set("newGalleryPreviews", (form.newGalleryPreviews || []).filter((_, i) => i !== idx));
    set("galleryPreviews", (form.galleryPreviews || []).filter((_, i) => i !== idx + form.existingImages.length));
  };
  
  const setAsMainImage = (imageId) => {
    set("mainImageId", imageId);
  };
  
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl;
    return `https://hook.runasp.net${imageUrl}`;
  };
  
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <Label>Cover Image *</Label>
        <div
          onClick={() => coverRef.current?.click()}
          className={`relative mt-1 w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden ${
            form.coverPreview
              ? "border-sky-400/30"
              : "border-white/10 hover:border-sky-400/30 hover:bg-sky-400/5"
          }`}
        >
          {form.coverPreview ? (
            <>
              <img src={getImageUrl(form.coverPreview)} alt="cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Upload size={16} /> Change Cover
                </div>
              </div>
            </>
          ) : (
            <>
              <ImagePlus className="text-[#a3cbf2]/30" size={32} />
              <p className="text-[#a3cbf2]/40 text-sm mt-2">Click to upload cover image</p>
              <p className="text-[#a3cbf2]/20 text-xs mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
      </div>
      
      {/* Photo Gallery */}
      <div>
        <Label>Photo Gallery</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
          {form.existingImages.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-sky-400/30 transition-all">
              <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setAsMainImage(img.id)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    form.mainImageId === img.id
                      ? "bg-sky-500 text-white"
                      : "bg-white/20 text-white hover:bg-sky-500/80"
                  }`}
                >
                  {form.mainImageId === img.id ? "Main" : "Set Main"}
                </button>
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={11} className="text-white" />
                </button>
              </div>
              {img.isMainImage && !form.mainImageId && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-sky-500 rounded-md text-white text-[10px] font-bold">
                  MAIN
                </div>
              )}
              {form.mainImageId === img.id && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-sky-500 rounded-md text-white text-[10px] font-bold">
                  MAIN
                </div>
              )}
            </div>
          ))}
          
          {(form.newGalleryPreviews || []).map((src, i) => (
            <div key={`new-${i}`} className="relative group aspect-square rounded-xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-end p-1">
                <button
                  type="button"
                  onClick={() => removeNewGalleryImage(i)}
                  className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <Trash2 size={11} className="text-white" />
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-sky-400/30 hover:bg-sky-400/5 flex flex-col items-center justify-center gap-1 transition-all duration-200 text-[#a3cbf2]/30 hover:text-[#a3cbf2]/60"
          >
            <ImagePlus size={18} />
            <span className="text-xs">Add</span>
          </button>
        </div>
        <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
        <p className="text-[#a3cbf2]/20 text-xs mt-2">
          Upload up to 10 photos. Images must be under 5MB.
        </p>
      </div>
    </div>
  );
};

const TripWizard = ({ trip = null, onClose, onSave }) => {
  const { boats, loading: loadingBoats } = useBoats();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => {
    if (trip) {
      return {
        title: trip.title || "",
        shortDescription: trip.shortDescription || "",
        detailedDescription: trip.detailedDescription || "",
        locationName: trip.locationName || "",
        address: trip.address || "",
        latitude: trip.latitude || "",
        longitude: trip.longitude || "",
        boatId: trip.boatId || "",
        pricePerPerson: trip.pricePerPerson || "",
        maxParticipants: trip.maxParticipants || "",
        options: {
          guidedTrip: trip.isGuided || false,
          equipmentRental: trip.hasEquipmentRental || false,
          snorkeling: trip.hasSnorkeling || false,
        },
        coverPreview: trip.mainImageUrl || null,
        newCoverPreview: null,
        galleryPreviews: trip.images?.filter(img => !img.isMainImage).map(img => img.imageUrl) || [],
        newGalleryPreviews: [],
        imagesToDelete: [],
        mainImageId: trip.images?.find(img => img.isMainImage)?.id || null,
        existingImages: trip.images || [],
      };
    }
    return { ...defaultForm };
  });
  
  const selectedBoat = boats.find(b => b.id === form.boatId);
  const maxCapacity = selectedBoat?.capacity || 0;
  
  const set = (key, val) =>
    setForm(prev => ({
      ...prev,
      [key]: typeof val === "function" ? val(prev[key]) : val,
    }));
  
  // Comprehensive Step Validation Function
  const validateStep = () => {
    if (step === 1) {
      if (!form.title.trim()) return "Trip title is required";
      if (!form.shortDescription.trim()) return "Short description is required";
      if (!form.detailedDescription.trim()) return "Detailed description is required";
      return null;
    }
    if (step === 2) {
      if (!form.locationName.trim()) return "Location name is required";
      if (!form.address.trim()) return "Address field is required";
      return null;
    }
    if (step === 3) {
      if (!form.boatId) return "Please select a boat";
      if (!form.pricePerPerson || parseFloat(form.pricePerPerson) <= 0) return "Valid price per person is required";
      if (!form.maxParticipants || parseInt(form.maxParticipants) <= 0) return "Valid max participants value is required";
      if (parseInt(form.maxParticipants) > maxCapacity) {
        return "Max participants cannot exceed boat capacity";
      }
      return null;
    }
    if (step === 4) {
      if (!form.coverPreview && !form.mainImageId) return "Please upload a cover image";
      return null;
    }
    return null;
  };
  
  const handleNext = () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }
    setStep(s => s + 1);
  };

  const handleStepClick = (targetStep) => {
    // Prevent skipping forward past incomplete fields
    if (targetStep > step) {
      let tempStep = step;
      while (tempStep < targetStep) {
        const error = validateStep();
        if (error) {
          toast.error(`Complete Step ${tempStep} requirements: ${error}`);
          return;
        }
        tempStep++;
      }
    }
    setStep(targetStep);
  };
  
  const handleSave = async () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }
    
    setSaving(true);
    try {
      const submitData = {
        ...form,
        pricePerPerson: parseFloat(form.pricePerPerson),
        maxParticipants: parseInt(form.maxParticipants),
        latitude: form.latitude ? parseFloat(form.latitude) : 0,
        longitude: form.longitude ? parseFloat(form.longitude) : 0,
      };
      
      await onSave(submitData);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };
  
  const stepContent = [
    <Step1 key={1} form={form} set={set} />,
    <Step2 key={2} form={form} set={set} />,
    <Step3 key={3} form={form} set={set} boats={boats} loadingBoats={loadingBoats} />,
    <Step4 key={4} form={form} set={set} isEditing={!!trip} />,
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">
            {trip ? "Edit Trip" : "Add New Trip"}
          </h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Stepper Timeline Header */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 min-w-0">
              <button
                type="button"
                onClick={() => handleStepClick(s.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all duration-300 ${
                  s.id < step
                    ? "bg-sky-500 text-white cursor-pointer hover:bg-sky-400"
                    : s.id === step
                    ? "bg-sky-500/20 text-sky-400 ring-2 ring-sky-400/30"
                    : "bg-[#001526] text-[#a3cbf2]/30"
                }`}
              >
                {s.id < step ? <Check size={13} /> : s.id}
              </button>
              <span className={`ml-1.5 text-xs font-medium truncate hidden sm:block transition-colors ${
                s.id === step ? "text-sky-400" : s.id < step ? "text-[#a3cbf2]/60" : "text-[#a3cbf2]/20"
              }`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                  s.id < step ? "bg-sky-500/50" : "bg-white/5"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-6 transition-all duration-300">
        <div key={step} className="animate-[fadeUp_0.25s_ease-out]">
          {stepContent[step - 1]}
        </div>
      </div>
      
      {/* Options Row */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-[#cee5ff] mb-4">Extra Options</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { key: "guidedTrip", label: "Guided Trip", icon: Compass },
            { key: "equipmentRental", label: "Equipment Rental", icon: Fish },
            { key: "snorkeling", label: "Snorkeling", icon: Waves },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => set("options", { ...form.options, [opt.key]: !form.options[opt.key] })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                form.options[opt.key]
                  ? "bg-sky-500/15 text-sky-400 border border-sky-400/20"
                  : "bg-[#001526] text-[#a3cbf2]/40 border border-white/5 hover:border-white/10 hover:text-[#a3cbf2]/70"
              }`}
            >
              <opt.icon size={14} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer Navigation Area */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 hover:border-white/10 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          {step > 1 ? "Back" : "Cancel"}
        </button>
        
        <div className="flex items-center gap-2">
          {step === STEPS.length ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {saving ? "Saving..." : (trip ? "Update Trip" : "Create Trip")}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-200"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TripWizard;