import { useState, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Check, X, Upload, ImagePlus, Trash2, Calendar as CalendarIcon,
  Compass, Fish, Waves, Umbrella, MapPin, Users, DollarSign, Clock, Info,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Trip Location" },
  { id: 3, label: "Boat & Pricing" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Media" },
];

// Mock boats data - in real app, this would come from your boats module
const MOCK_BOATS = [
  { id: "1", name: "Sea Hunter", capacity: 6, image: null },
  { id: "2", name: "Flat Master", capacity: 4, image: null },
  { id: "3", name: "Sunset Dream", capacity: 8, image: null },
  { id: "4", name: "North Star", capacity: 4, image: null },
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
  availableDates: [],
  options: {
    guidedTrip: false,
    equipmentRental: false,
    snorkeling: false,
  },
  coverPreview: null,
  galleryPreviews: [],
};

/* ── Reusable field components ── */
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

/* ── Step 1: Basic Info ── */
const Step1 = ({ form, set }) => (
  <div className="space-y-5">
    <Input 
      label="Trip Title" 
      placeholder="e.g. Deep Sea Adventure — Gulf of Mexico" 
      value={form.title} 
      onChange={e => set("title", e.target.value)} 
      required
    />
    
    <Textarea 
      label="Short Description" 
      rows={2}
      placeholder="Quick summary that appears in the card (e.g., 'Full-day offshore fishing for blue marlin and tuna')" 
      value={form.shortDescription} 
      onChange={e => set("shortDescription", e.target.value)} 
    />
    
    <Textarea 
      label="Detailed Description" 
      rows={6}
      placeholder="Complete trip description including: fishing type, trip duration, expected experience, what's included, what to bring, etc."
      value={form.detailedDescription} 
      onChange={e => set("detailedDescription", e.target.value)} 
    />
    <p className="text-[#a3cbf2]/20 text-xs -mt-2">
      Include details like: type of fishing, duration, experience level needed, gear provided, etc.
    </p>
  </div>
);

/* ── Step 2: Trip Location ── */
const Step2 = ({ form, set }) => (
  <div className="space-y-5">
    <Input 
      label="Location Name" 
      placeholder="e.g., Hurghada Marina, Key Biscayne Bay" 
      value={form.locationName} 
      onChange={e => set("locationName", e.target.value)} 
      required
    />
    
    <Input 
      label="Address (Optional)" 
      placeholder="Street address for navigation" 
      value={form.address} 
      onChange={e => set("address", e.target.value)} 
    />
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input 
        label="Latitude" 
        placeholder="e.g., 25.2048" 
        value={form.latitude} 
        onChange={e => set("latitude", e.target.value)} 
      />
      <Input 
        label="Longitude" 
        placeholder="e.g., 55.2708" 
        value={form.longitude} 
        onChange={e => set("longitude", e.target.value)} 
      />
    </div>
    
    <div className="bg-sky-400/5 border border-sky-400/15 rounded-xl p-4">
      <p className="text-[#a3cbf2]/50 text-xs flex items-center gap-1">
        <MapPin size={12} /> Coordinates help customers find the exact meeting point
      </p>
    </div>
  </div>
);

/* ── Step 3: Boat & Pricing ── */
const Step3 = ({ form, set, boats }) => {
  const selectedBoat = boats.find(b => b.id === form.boatId);
  const maxCapacity = selectedBoat?.capacity || 0;
  
  const handleBoatChange = (e) => {
    set("boatId", e.target.value);
    // Reset max participants if exceeds new boat capacity
    if (form.maxParticipants > maxCapacity) {
      set("maxParticipants", "");
    }
  };
  
  return (
    <div className="space-y-5">
      <Select 
        label="Select Boat" 
        value={form.boatId} 
        onChange={handleBoatChange}
        required
      >
        <option value="">Select a boat...</option>
        {boats.map(boat => (
          <option key={boat.id} value={boat.id}>
            {boat.name} (Capacity: {boat.capacity})
          </option>
        ))}
      </Select>
      
      {selectedBoat && (
        <div className="bg-teal-400/5 border border-teal-400/15 rounded-xl p-3">
          <p className="text-[#a3cbf2]/50 text-xs flex items-center gap-1">
            <Users size={12} /> Selected boat capacity: <span className="text-teal-400 font-bold">{selectedBoat.capacity}</span> persons
          </p>
        </div>
      )}
      
      <div className="relative">
        <Label>Price per Person ($)</Label>
        <span className="absolute left-4 top-[calc(1.5rem+0.375rem)] text-[#a3cbf2]/40 text-sm pointer-events-none">$</span>
        <input
          type="number" 
          min="0" 
          placeholder="0.00" 
          value={form.pricePerPerson}
          onChange={e => set("pricePerPerson", e.target.value)}
          className="w-full bg-[#001526] border border-white/5 rounded-xl pl-8 pr-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
          required
        />
      </div>
      
      <div>
        <Label>Max Participants</Label>
        <input
          type="number"
          min="1"
          max={maxCapacity || undefined}
          placeholder={`Max ${maxCapacity || '?'} persons`}
          value={form.maxParticipants}
          onChange={e => set("maxParticipants", e.target.value)}
          className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200"
          required
        />
        {form.maxParticipants && maxCapacity && parseInt(form.maxParticipants) > maxCapacity && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span className="text-red-400">⚠️</span> Max participants cannot exceed boat capacity ({maxCapacity})
          </p>
        )}
        {maxCapacity > 0 && (
          <p className="text-[#a3cbf2]/30 text-xs mt-1">
            Maximum allowed: {maxCapacity} persons (based on boat capacity)
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

/* ── Step 4: Schedule (Available Dates) ── */
const Step4 = ({ form, set }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempDate, setTempDate] = useState(null);
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDay = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const isDateSelected = (day) => {
    const dateKey = formatDateKey(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    return form.availableDates.includes(dateKey);
  };
  
  const toggleDate = (day) => {
    const dateKey = formatDateKey(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    const current = form.availableDates;
    if (current.includes(dateKey)) {
      set("availableDates", current.filter(d => d !== dateKey));
    } else {
      set("availableDates", [...current, dateKey]);
    }
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDay(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const cells = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  
  const removeDate = (dateKey) => {
    set("availableDates", form.availableDates.filter(d => d !== dateKey));
  };
  
  return (
    <div className="space-y-5">
      <div>
        <Label>Available Dates</Label>
        <p className="text-[#a3cbf2]/30 text-xs mb-3">Select all dates when this trip is available for booking</p>
        
        {/* Calendar */}
        <div className="bg-[#001526] rounded-xl p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[#cee5ff] font-medium text-sm">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[#a3cbf2]/30 text-xs py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const isSelected = isDateSelected(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDate(day)}
                  className={`aspect-square rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center
                    ${isSelected 
                      ? "bg-sky-500 text-white" 
                      : "bg-[#002238] text-[#a3cbf2]/60 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Selected Dates List */}
      {form.availableDates.length > 0 && (
        <div>
          <Label>Selected Dates ({form.availableDates.length})</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {form.availableDates.map(dateKey => {
              const [year, month, day] = dateKey.split('-');
              return (
                <span
                  key={dateKey}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-sky-400/10 text-sky-400 text-xs"
                >
                  <CalendarIcon size={10} />
                  {month}/{day}/{year}
                  <button
                    type="button"
                    onClick={() => removeDate(dateKey)}
                    className="ml-1 text-sky-400/60 hover:text-sky-300"
                  >
                    <X size={10} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Step 5: Media ── */
const Step5 = ({ form, set }) => {
  const coverRef = useRef(null);
  const galleryRef = useRef(null);
  
  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("coverPreview", ev.target.result);
    reader.readAsDataURL(file);
  };
  
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => set("galleryPreviews", prev => [...(prev || []), ev.target.result]);
      reader.readAsDataURL(file);
    });
  };
  
  const removeGallery = (idx) => {
    set("galleryPreviews", (form.galleryPreviews || []).filter((_, i) => i !== idx));
  };
  
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <Label>Cover Image</Label>
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
              <img src={form.coverPreview} alt="cover" className="w-full h-full object-cover" />
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
              <p className="text-[#a3cbf2]/20 text-xs mt-1">PNG, JPG up to 10MB</p>
            </>
          )}
        </div>
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
      </div>
      
      {/* Gallery */}
      <div>
        <Label>Photo Gallery</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
          {(form.galleryPreviews || []).map((src, i) => (
            <div key={`${src.slice(-20)}-${i}`} className="relative group aspect-square rounded-xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-end p-1">
                <button
                  type="button"
                  onClick={() => removeGallery(i)}
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
          Upload up to 10 photos
        </p>
      </div>
    </div>
  );
};

/* ── Main Wizard ── */
const TripWizard = ({ trip = null, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(
    trip
      ? { ...defaultForm, ...trip }
      : defaultForm
  );
  
  const selectedBoat = MOCK_BOATS.find(b => b.id === form.boatId);
  const maxCapacity = selectedBoat?.capacity || 0;
  
  const set = (key, val) =>
    setForm(prev => ({
      ...prev,
      [key]: typeof val === "function" ? val(prev[key]) : val,
    }));
  
  const validateStep = () => {
    if (step === 1) {
      if (!form.title) return "Trip title is required";
      return null;
    }
    if (step === 2) {
      if (!form.locationName) return "Location name is required";
      return null;
    }
    if (step === 3) {
      if (!form.boatId) return "Please select a boat";
      if (!form.pricePerPerson) return "Price per person is required";
      if (!form.maxParticipants) return "Max participants is required";
      if (parseInt(form.maxParticipants) > maxCapacity) {
        return "Max participants cannot exceed boat capacity";
      }
      return null;
    }
    if (step === 4) {
      if (form.availableDates.length === 0) return "Please select at least one available date";
      return null;
    }
    return null;
  };
  
  const handleNext = () => {
    const error = validateStep();
    if (error) {
      alert(error);
      return;
    }
    setStep(s => s + 1);
  };
  
  const handleSave = (status) => {
    // Final validation
    if (!form.title) { alert("Trip title is required"); return; }
    if (!form.locationName) { alert("Location name is required"); return; }
    if (!form.boatId) { alert("Please select a boat"); return; }
    if (!form.pricePerPerson) { alert("Price per person is required"); return; }
    if (!form.maxParticipants) { alert("Max participants is required"); return; }
    if (parseInt(form.maxParticipants) > maxCapacity) { alert("Max participants cannot exceed boat capacity"); return; }
    if (form.availableDates.length === 0) { alert("Please select at least one available date"); return; }
    
    onSave({ ...form, status });
  };
  
  const stepContent = [
    <Step1 key={1} form={form} set={set} />,
    <Step2 key={2} form={form} set={set} />,
    <Step3 key={3} form={form} set={set} boats={MOCK_BOATS} />,
    <Step4 key={4} form={form} set={set} />,
    <Step5 key={5} form={form} set={set} />,
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
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
      
      {/* Progress Bar */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => s.id < step && setStep(s.id)}
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
      
      {/* Step Content */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-6 transition-all duration-300">
        <div key={step} className="animate-[fadeUp_0.25s_ease-out]">
          {stepContent[step - 1]}
        </div>
      </div>
      
      {/* Extra Options Section - displayed in Step 3 or as separate */}
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
      
      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 hover:border-white/10 text-sm font-medium transition-all duration-200"
        >
          <ChevronLeft size={16} />
          {step > 1 ? "Back" : "Cancel"}
        </button>
        
        <div className="flex items-center gap-2">
          {step === STEPS.length ? (
            <>
              <button
                onClick={() => handleSave("Draft")}
                className="px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave("Active")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-200"
              >
                <Check size={15} /> Publish Trip
              </button>
            </>
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