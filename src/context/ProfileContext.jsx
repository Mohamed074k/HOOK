import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as profileService from "../services/profile.service";
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export const ProfileProvider = ({ children }) => {
    const { user, isLoading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Application statuses - stored locally after submission
    const [boatOwnerStatus, setBoatOwnerStatus] = useState(() => {
      // Try to load from localStorage on initial load
      const saved = localStorage.getItem('boatOwnerStatus');
      return saved ? JSON.parse(saved) : null;
    });
    const [sellerStatus, setSellerStatus] = useState(() => {
      const saved = localStorage.getItem('sellerStatus');
      return saved ? JSON.parse(saved) : null;
    });
    const [checkingStatus, setCheckingStatus] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Fetch profile error:", err);
            if (err.response?.status === 401) {
                setError("Please login to view your profile");
            } else {
                setError("Failed to load profile");
                toast.error('Failed to load profile');
            }
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const convertBase64ToFile = useCallback((base64, filename = 'image.jpg') => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }, []);

    const updateProfile = useCallback(async (profileData) => {
        try {
            const formData = new FormData();
            formData.append("FirstName", profileData.firstName || "");
            formData.append("LastName", profileData.lastName || "");
            formData.append("PhoneNumber", profileData.phoneNumber || "");
            formData.append("Governorate", profileData.governorate || "");
            formData.append("Bio", profileData.bio || "");
            
            if (profileData.profilePicture && !profileData.profilePicture.startsWith('http')) {
                const imageFile = convertBase64ToFile(profileData.profilePicture, 'profile.jpg');
                formData.append("Image", imageFile);
            }

            const updatedProfile = await profileService.updateProfile(formData);
            setProfile(updatedProfile);
            toast.success('Profile updated successfully');
            return updatedProfile;
        } catch (err) {
            console.error("Update profile error:", err);
            let errorMessage = "Failed to update profile";
            if (err.response?.data?.title) {
                errorMessage = err.response.data.title;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                errorMessage = errors[0];
            }
            toast.error(errorMessage);
            throw err;
        }
    }, [convertBase64ToFile]);

    const changePassword = useCallback(async (currentPassword, newPassword) => {
        try {
            await profileService.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully');
            return true;
        } catch (err) {
            console.error("Change password error:", err);
            let errorMessage = "Failed to change password";
            
            if (err.response?.data?.title) {
                errorMessage = err.response.data.title;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                errorMessage = errors[0];
            } else if (err.response?.status === 400) {
                errorMessage = "Current password is incorrect";
            }
            
            toast.error(errorMessage);
            throw err;
        }
    }, []);

// Submit Boat Owner Application
const submitBoatOwnerApplication = useCallback(async (applicationData) => {
    try {
        const formData = new FormData();
        formData.append("NationalIdNumber", applicationData.nationalIdNumber);
        formData.append("BoatLicenseNumber", applicationData.boatLicenseNumber);
        formData.append("InstaPayNumber", applicationData.instaPayNumber || "");
        formData.append("VodafoneCashNumber", applicationData.vodafoneCashNumber || "");
        
        if (applicationData.nationalIdImage && !applicationData.nationalIdImage.startsWith('http')) {
            const imageFile = convertBase64ToFile(applicationData.nationalIdImage, 'national-id.jpg');
            formData.append("NationalIdImage", imageFile);
        }
        
        if (applicationData.boatLicenseImage && !applicationData.boatLicenseImage.startsWith('http')) {
            const imageFile = convertBase64ToFile(applicationData.boatLicenseImage, 'boat-license.jpg');
            formData.append("BoatLicenseImage", imageFile);
        }

        const response = await profileService.applyForBoatOwner(formData);
        
        // Store the application status locally and in localStorage
        const statusData = {
            status: 1, // Pending
            message: response.message || "Application submitted successfully",
            submittedAt: new Date().toISOString()
        };
        setBoatOwnerStatus(statusData);
        localStorage.setItem('boatOwnerStatus', JSON.stringify(statusData));
        
        toast.success(response.message || "Boat owner application submitted successfully!");
        return response;
    } catch (err) {
        console.error("Boat owner application error:", err);
        
        let errorMessage = "Failed to submit application";
        
        // Check for detail field (common in 500 errors with Exception type)
        if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
        }
        // Check for description field (custom API errors)
        else if (err.response?.data?.description) {
            errorMessage = err.response.data.description;
        }
        // Handle validation errors (errors object with field-specific messages)
        else if (err.response?.data?.errors) {
            const errorsObj = err.response.data.errors;
            const allErrors = Object.values(errorsObj).flat();
            if (allErrors.length > 0) {
                errorMessage = allErrors[0];
            }
        }
        // Handle standard error title
        else if (err.response?.data?.title) {
            errorMessage = err.response.data.title;
        }
        // Handle simple message
        else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        
        toast.error(errorMessage);
        throw err;
    }
}, [convertBase64ToFile]);

// Submit Seller Application
const submitSellerApplication = useCallback(async (applicationData) => {
    try {
        const formData = new FormData();
        formData.append("SellerName", applicationData.sellerName);
        formData.append("PhoneNumber", applicationData.phoneNumber);
        formData.append("Governorate", applicationData.governorate);
        formData.append("City", applicationData.city);
        formData.append("Address", applicationData.address);
        
        if (applicationData.nationalIdImage && !applicationData.nationalIdImage.startsWith('http')) {
            const imageFile = convertBase64ToFile(applicationData.nationalIdImage, 'national-id.jpg');
            formData.append("NationalIdImage", imageFile);
        }
        
        if (applicationData.storeImage && !applicationData.storeImage.startsWith('http')) {
            const imageFile = convertBase64ToFile(applicationData.storeImage, 'store.jpg');
            formData.append("StoreImage", imageFile);
        }

        const response = await profileService.applyForSeller(formData);
        
        // Store the application status locally and in localStorage
        const statusData = {
            status: 1, // Pending
            message: response.message || "Application submitted successfully",
            submittedAt: new Date().toISOString()
        };
        setSellerStatus(statusData);
        localStorage.setItem('sellerStatus', JSON.stringify(statusData));
        
        toast.success(response.message || "Seller application submitted successfully!");
        return response;
    } catch (err) {
        console.error("Seller application error:", err);
        
        let errorMessage = "Failed to submit application";
        
        // Check for detail field (common in 500 errors with Exception type)
        if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
        }
        // Check for description field (custom API errors)
        else if (err.response?.data?.description) {
            errorMessage = err.response.data.description;
        }
        // Handle validation errors (errors object with field-specific messages)
        else if (err.response?.data?.errors) {
            const errorsObj = err.response.data.errors;
            const allErrors = Object.values(errorsObj).flat();
            if (allErrors.length > 0) {
                errorMessage = allErrors[0];
            }
        }
        // Handle standard error title
        else if (err.response?.data?.title) {
            errorMessage = err.response.data.title;
        }
        // Handle simple message
        else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        
        toast.error(errorMessage);
        throw err;
    }
}, [convertBase64ToFile]);

    // Clear statuses on logout
    const clearStatuses = useCallback(() => {
        setBoatOwnerStatus(null);
        setSellerStatus(null);
        localStorage.removeItem('boatOwnerStatus');
        localStorage.removeItem('sellerStatus');
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchProfile();
            // Don't fetch statuses from API - just use localStorage
        } else if (!authLoading && !user) {
            setLoading(false);
            setProfile(null);
            clearStatuses();
        }
    }, [user, authLoading, fetchProfile, clearStatuses]);

    const value = React.useMemo(() => ({
        profile,
        loading: loading || authLoading,
        error,
        fetchProfile,
        updateProfile,
        changePassword,
        // Application statuses and functions
        boatOwnerStatus,
        sellerStatus,
        checkingStatus,
        submitBoatOwnerApplication,
        submitSellerApplication,
        refreshStatuses: () => {}, // No-op function since we can't fetch from API
        clearStatuses
    }), [profile, loading, authLoading, error, fetchProfile, updateProfile, changePassword, 
        boatOwnerStatus, sellerStatus, checkingStatus, submitBoatOwnerApplication, 
        submitSellerApplication, clearStatuses]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};