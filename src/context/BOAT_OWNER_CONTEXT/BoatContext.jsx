import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as boatService from "../../services/BoatOwnerService.jsx/boats.service";
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const BoatContext = createContext();

export const useBoats = () => {
    const context = useContext(BoatContext);
    if (!context) {
        throw new Error('useBoats must be used within a BoatProvider');
    }
    return context;
};

export const BoatProvider = ({ children }) => {
    const { user, isLoading: authLoading } = useAuth();
    const [boats, setBoats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Bulletproof role check
    const userRoles = Array.isArray(user?.role) 
        ? user.role.map(r => r?.toLowerCase()) 
        : [user?.role?.toLowerCase()];
    
    const isBoatOwner = userRoles.includes("boatowner") || userRoles.includes("admin");

    const fetchBoats = useCallback(async () => {
        if (!isBoatOwner) {
            setLoading(false);
            setBoats([]);
            setErrorType(null);
            return;
        }

        setLoading(true);
        setError(null);
        setErrorType(null);
        
        try {
            const data = await boatService.getMyBoats();
            setBoats(data || []);
        } catch (err) {
            console.error("Fetch boats error:", err);
            const errorCode = err.response?.data?.code;
            const errorMessage = err.response?.data?.description || err.response?.data?.message;
            
            if (errorCode === "Boat.NoOwnerProfile" || errorMessage?.includes("boat owner profile")) {
                setErrorType("no_profile");
                setError("You need to create a boat owner profile first. Please contact support.");
            } else if (err.response?.status === 401) {
                setErrorType("unauthorized");
                setError("Please login to view your boats");
            } else if (err.response?.status === 403) {
                setErrorType("forbidden");
                setError("You don't have permission to view boats");
            } else {
                setErrorType("general");
                setError("Failed to load boats");
                toast.error('Failed to load boats');
            }
            setBoats([]);
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
        return new File([u8arr], `boat-image-${Date.now()}-${index}.jpg`, { type: mime });
    }, []);

    const createBoat = useCallback(async (boatData) => {
        if (!isBoatOwner) {
            toast.error('Only Boat Owners can create boats');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("Name", boatData.name);
            formData.append("Description", boatData.description);
            formData.append("Capacity", parseInt(boatData.capacity));
            
            if (boatData.images && boatData.images.length > 0) {
                let mainImageIndex = 0;
                boatData.images.forEach((img, idx) => {
                    if (img) {
                        const imageFile = convertBase64ToFile(img, idx);
                        formData.append("Images", imageFile);
                        if (idx === 0) mainImageIndex = idx;
                    }
                });
                formData.append("MainImageIndex", mainImageIndex);
            }

            const newBoat = await boatService.createBoat(formData);
            setBoats(prev => [...prev, newBoat]);
            toast.success(`Boat "${boatData.name}" created successfully`);
            return newBoat;
        } catch (err) {
            console.error("Create boat error:", err);
            if (err.response?.data?.code === "Boat.NoOwnerProfile") {
                toast.error("You need to create a boat owner profile first. Please contact support.");
            } else {
                const message = err.response?.data?.message || err.message || "Failed to create boat";
                toast.error(message);
            }
            throw err;
        }
    }, [isBoatOwner, convertBase64ToFile]);

    const updateBoat = useCallback(async (id, boatData) => {
        if (!isBoatOwner) {
            toast.error('Only Boat Owners can update boats');
            return;
        }

        try {
            // 1. Update basic text info first
            const textFormData = new FormData();
            textFormData.append("Name", boatData.name);
            textFormData.append("Description", boatData.description);
            textFormData.append("Capacity", parseInt(boatData.capacity));
            
            await boatService.updateBoat(id, textFormData);

            // 2. Update images if modified
            const hasNewImages = boatData.newImages && boatData.newImages.length > 0;
            const hasDeletedImages = boatData.imagesToDelete && boatData.imagesToDelete.length > 0;
            
            if (hasNewImages || hasDeletedImages || boatData.mainImageId) {
                const imageFormData = new FormData();
                
                if (hasDeletedImages) {
                    boatData.imagesToDelete.forEach(imageId => {
                        imageFormData.append("ImageIdsToDelete", imageId);
                    });
                }
                
                if (hasNewImages) {
                    boatData.newImages.forEach((img, idx) => {
                        if (img) {
                            const imageFile = convertBase64ToFile(img, idx);
                            imageFormData.append("NewImages", imageFile);
                        }
                    });
                }

                if (boatData.mainImageId) {
                    imageFormData.append("MainImageId", boatData.mainImageId);
                }

                await boatService.updateBoatImages(id, imageFormData);
            }

            await fetchBoats();
            toast.success('Boat updated successfully');
            return true;
        } catch (err) {
            console.error("Update boat error:", err);
            const message = err.response?.data?.message || err.message || "Failed to update boat";
            toast.error(message);
            throw err;
        }
    }, [isBoatOwner, convertBase64ToFile, fetchBoats]);

    const deleteBoat = useCallback(async (id) => {
        if (!isBoatOwner) return;
        try {
            await boatService.deleteBoat(id);
            setBoats(prev => prev.filter(boat => boat.id !== id));
            toast.success('Boat deleted successfully');
        } catch (err) {
            console.error("Delete boat error:", err);
            toast.error(err.response?.data?.message || "Failed to delete boat");
            throw err;
        }
    }, [isBoatOwner]);

    const getBoat = useCallback(async (id) => {
        if (!isBoatOwner) return null;
        try {
            return await boatService.getBoatById(id);
        } catch (err) {
            toast.error('Failed to fetch boat details');
            throw err;
        }
    }, [isBoatOwner]);

    const filteredBoats = React.useMemo(() => {
        if (!isBoatOwner) return [];
        return boats.filter(boat => 
            boat.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [boats, searchTerm, isBoatOwner]);

    const totalPages = Math.ceil(filteredBoats.length / itemsPerPage);
    const paginatedBoats = React.useMemo(() => {
        return filteredBoats.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredBoats, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (!authLoading) {
            if (isBoatOwner) {
                fetchBoats();
            } else {
                setLoading(false);
                setBoats([]);
                setError(null);
                setErrorType(null);
            }
        }
    }, [isBoatOwner, authLoading, fetchBoats]);

    const value = React.useMemo(() => ({
        boats: paginatedBoats,
        allBoats: boats,
        loading: loading || authLoading,
        error,
        errorType,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        isBoatOwner,
        fetchBoats,
        getBoat,
        createBoat,
        updateBoat,
        deleteBoat
    }), [paginatedBoats, boats, loading, authLoading, error, errorType, searchTerm, currentPage, totalPages, 
        isBoatOwner, fetchBoats, getBoat, createBoat, updateBoat, deleteBoat]);

    return (
        <BoatContext.Provider value={value}>
            {children}
        </BoatContext.Provider>
    );
};