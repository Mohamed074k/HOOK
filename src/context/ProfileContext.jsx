// src/context/ProfileContext.js
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

    const convertBase64ToFile = useCallback((base64) => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], `profile-${Date.now()}.jpg`, { type: mime });
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
                const imageFile = convertBase64ToFile(profileData.profilePicture);
                formData.append("Image", imageFile);
            }

            const updatedProfile = await profileService.updateProfile(formData);
            setProfile(updatedProfile);
            toast.success('Profile updated successfully');
            return updatedProfile;
        } catch (err) {
            console.error("Update profile error:", err);
            // Extract error message from response
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
            // Extract the specific error message from the response
            let errorMessage = "Failed to change password";
            
            // Try to get error message from different response formats
            if (err.response?.data?.title) {
                errorMessage = err.response.data.title;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                errorMessage = errors[0];
            } else if (err.response?.status === 400) {
                // Common error for wrong password
                errorMessage = "Current password is incorrect";
            }
            
            toast.error(errorMessage);
            throw err;
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchProfile();
        } else if (!authLoading && !user) {
            setLoading(false);
            setProfile(null);
        }
    }, [user, authLoading, fetchProfile]);

    const value = React.useMemo(() => ({
        profile,
        loading: loading || authLoading,
        error,
        fetchProfile,
        updateProfile,
        changePassword
    }), [profile, loading, authLoading, error, fetchProfile, updateProfile, changePassword]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};