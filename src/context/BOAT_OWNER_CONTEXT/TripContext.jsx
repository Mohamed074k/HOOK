import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as tripService from "../../services/BoatOwnerService.jsx/trips.service";
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import { useBoats } from './BoatContext';

const TripContext = createContext();

export const useTrips = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrips must be used within a TripProvider');
    }
    return context;
};

export const TripProvider = ({ children }) => {
    const { user, isLoading: authLoading } = useAuth();
    const { boats, isBoatOwner } = useBoats();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const fetchTrips = useCallback(async () => {
        if (!isBoatOwner) {
            setLoading(false);
            setTrips([]);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const data = await tripService.getMyTrips();
            setTrips(data || []);
        } catch (err) {
            console.error("Fetch trips error:", err);
            if (err.response?.status === 401) {
                setError("Please login to view your trips");
            } else if (err.response?.status === 403) {
                setError("You don't have permission to view trips");
            } else {
                setError("Failed to load trips");
                toast.error('Failed to load trips');
            }
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, [isBoatOwner]);

    const convertBase64ToFile = useCallback((base64, index) => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], `trip-image-${Date.now()}-${index}.jpg`, { type: mime });
    }, []);

    const createTrip = useCallback(async (tripData) => {
        if (!isBoatOwner) {
            toast.error('Only Boat Owners can create trips');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("Title", tripData.title);
            formData.append("ShortDescription", tripData.shortDescription || "");
            formData.append("DetailedDescription", tripData.detailedDescription || "");
            formData.append("LocationName", tripData.locationName);
            formData.append("Address", tripData.address || "");
            formData.append("Latitude", tripData.latitude || 0);
            formData.append("Longitude", tripData.longitude || 0);
            formData.append("PricePerPerson", parseFloat(tripData.pricePerPerson));
            formData.append("MaxParticipants", parseInt(tripData.maxParticipants));
            formData.append("IsGuided", tripData.options?.guidedTrip || false);
            formData.append("HasEquipmentRental", tripData.options?.equipmentRental || false);
            formData.append("HasSnorkeling", tripData.options?.snorkeling || false);
            formData.append("BoatId", tripData.boatId);
            
            if (tripData.coverPreview && !tripData.coverPreview.startsWith('http')) {
                const imageFile = convertBase64ToFile(tripData.coverPreview, 0);
                formData.append("Images", imageFile);
                formData.append("MainImageIndex", 0);
            }
            
            if (tripData.galleryPreviews && tripData.galleryPreviews.length > 0) {
                tripData.galleryPreviews.forEach((img, idx) => {
                    if (img && !img.startsWith('http')) {
                        const imageFile = convertBase64ToFile(img, idx + 1);
                        formData.append("Images", imageFile);
                    }
                });
            }

            const newTrip = await tripService.createTrip(formData);
            
            if (tripData.availableDates && tripData.availableDates.length > 0) {
                // Supports explicit endDate calculation during simultaneous creation
                const datesData = {
                    dates: tripData.availableDates.map(date => {
                        const start = new Date(date);
                        const end = new Date(start.getTime() + 86400000); // Defaults +24h if wizard input omits span

                        return {
                            startDate: start.toISOString(),
                            endDate: end.toISOString(),
                            availableSeats: Number(tripData.maxParticipants) || 0
                        };
                    })
                };
                
                try {
                    await tripService.addTripDates(newTrip.id, datesData);
                } catch (dateError) {
                    console.error("Error adding dates:", dateError);
                    toast.warning("Trip created but dates could not be added. Please add dates later.");
                }
            }
            
            await fetchTrips();
            toast.success(`Trip "${tripData.title}" created successfully`);
            return newTrip;
        } catch (err) {
            console.error("Create trip error:", err);
            const message = err.response?.data?.title || err.response?.data?.message || err.message || "Failed to create trip";
            toast.error(message);
            throw err;
        }
    }, [isBoatOwner, convertBase64ToFile, fetchTrips]);

    const updateTrip = useCallback(async (id, tripData) => {
        if (!isBoatOwner) {
            toast.error('Only Boat Owners can update trips');
            return;
        }

        try {
            const textFormData = new FormData();
            textFormData.append("Title", tripData.title);
            textFormData.append("ShortDescription", tripData.shortDescription || "");
            textFormData.append("DetailedDescription", tripData.detailedDescription || "");
            textFormData.append("LocationName", tripData.locationName);
            textFormData.append("Address", tripData.address || "");
            textFormData.append("Latitude", tripData.latitude || 0);
            textFormData.append("Longitude", tripData.longitude || 0);
            textFormData.append("PricePerPerson", parseFloat(tripData.pricePerPerson));
            textFormData.append("MaxParticipants", parseInt(tripData.maxParticipants));
            textFormData.append("IsGuided", tripData.options?.guidedTrip || false);
            textFormData.append("HasEquipmentRental", tripData.options?.equipmentRental || false);
            textFormData.append("HasSnorkeling", tripData.options?.snorkeling || false);
            
            await tripService.updateTrip(id, textFormData);

            const hasNewCover = tripData.newCoverPreview && !tripData.coverPreview?.startsWith('http');
            const hasNewGallery = tripData.newGalleryPreviews && tripData.newGalleryPreviews.length > 0;
            const hasDeletedImages = tripData.imagesToDelete && tripData.imagesToDelete.length > 0;
            
            if (hasNewCover || hasNewGallery || hasDeletedImages || tripData.mainImageId) {
                const imageFormData = new FormData();
                
                if (hasDeletedImages) {
                    tripData.imagesToDelete.forEach(imageId => {
                        imageFormData.append("ImageIdsToDelete", imageId);
                    });
                }
                
                if (hasNewCover) {
                    const imageFile = convertBase64ToFile(tripData.newCoverPreview, 0);
                    imageFormData.append("NewImages", imageFile);
                }
                
                if (hasNewGallery) {
                    tripData.newGalleryPreviews.forEach((img, idx) => {
                        if (img && !img.startsWith('http')) {
                            const imageFile = convertBase64ToFile(img, idx + 1);
                            imageFormData.append("NewImages", imageFile);
                        }
                    });
                }

                if (tripData.mainImageId) {
                    imageFormData.append("MainImageId", tripData.mainImageId);
                }

                await tripService.updateTripImages(id, imageFormData);
            }

            await fetchTrips();
            toast.success('Trip updated successfully');
            return true;
        } catch (err) {
            console.error("Update trip error:", err);
            const message = err.response?.data?.title || err.response?.data?.message || err.message || "Failed to update trip";
            toast.error(message);
            throw err;
        }
    }, [isBoatOwner, convertBase64ToFile, fetchTrips]);

    // Updated Payload Schema Method
    const addNewTripDates = useCallback(async (id, datesArray) => {
        try {
            const payload = {
                dates: datesArray.map(d => ({
                    startDate: new Date(d.startDate).toISOString(),
                    endDate: new Date(d.endDate).toISOString(),
                    availableSeats: Number(d.availableSeats) || 0
                }))
            };
            await tripService.addTripDates(id, payload);
            await fetchTrips();
            return true;
        } catch (err) {
            console.error("Add dates error:", err);
            throw err;
        }
    }, [fetchTrips]);

    const toggleDateStatus = useCallback(async (dateId, isActive) => {
        try {
            await tripService.toggleDateStatus(dateId, isActive);
            await fetchTrips(); 
            toast.success(`Date ${isActive ? 'activated' : 'deactivated'} successfully`);
            return true;
        } catch (err) {
            console.error("Toggle date status error:", err);
            const responseData = err.response?.data;
            const isUnrefundedError = responseData?.code === "Trip.DateHasUnrefundedBookings" || 
                                   (responseData?.description || "").toLowerCase().includes("refund");

            if (isUnrefundedError) {
                toast.error("Cannot deactivate date. You must refund all payments first.");
            } else {
                toast.error(responseData?.title || responseData?.message || "Failed to update date status");
            }
            throw err;
        }
    }, [fetchTrips]);

    const deleteTripDate = useCallback(async (dateId) => {
        try {
            await tripService.hardDeleteTripDate(dateId);
            await fetchTrips(); 
            toast.success('Date deleted permanently');
            return true;
        } catch (err) {
            console.error("Delete date error:", err);
            const responseData = err.response?.data;
            const status = err.response?.status;
            
            const isUnrefundedError = responseData?.code === "Trip.DateHasUnrefundedBookings" || 
                                     (responseData?.description || "").toLowerCase().includes("refund");
            const isServerDependencyError = status === 500;

            if (!isUnrefundedError && !isServerDependencyError) {
                toast.error(responseData?.title || responseData?.message || "Failed to delete date");
            }
            
            throw err; 
        }
    }, [fetchTrips]);

    const deleteTrip = useCallback(async (id) => {
        if (!isBoatOwner) return;
        try {
            await tripService.deleteTrip(id);
            setTrips(prev => prev.filter(trip => trip.id !== id));
            toast.success('Trip deleted successfully');
        } catch (err) {
            console.error("Delete trip error:", err);
            toast.error(err.response?.data?.title || err.response?.data?.message || "Failed to delete trip");
            throw err;
        }
    }, [isBoatOwner]);

    const getTrip = useCallback(async (id) => {
        if (!isBoatOwner) return null;
        try {
            return await tripService.getTripById(id);
        } catch (err) {
            toast.error('Failed to fetch trip details');
            throw err;
        }
    }, [isBoatOwner]);

    const filteredTrips = React.useMemo(() => {
        if (!isBoatOwner) return [];
        return trips.filter(trip => 
            trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [trips, searchTerm, isBoatOwner]);

    const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
    const paginatedTrips = React.useMemo(() => {
        return filteredTrips.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredTrips, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (!authLoading && isBoatOwner) {
            fetchTrips();
        } else if (!authLoading && !isBoatOwner) {
            setLoading(false);
            setTrips([]);
        }
    }, [isBoatOwner, authLoading, fetchTrips]);

    const value = React.useMemo(() => ({
        trips: paginatedTrips,
        allTrips: trips,
        loading: loading || authLoading,
        error,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        isBoatOwner,
        fetchTrips,
        getTrip,
        createTrip,
        updateTrip,
        addNewTripDates,
        toggleDateStatus, 
        deleteTripDate,
        deleteTrip
    }), [
        paginatedTrips, trips, loading, authLoading, error, searchTerm, 
        currentPage, totalPages, isBoatOwner, fetchTrips, getTrip, 
        createTrip, updateTrip, addNewTripDates, toggleDateStatus, deleteTripDate, deleteTrip
    ]);

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    );
};