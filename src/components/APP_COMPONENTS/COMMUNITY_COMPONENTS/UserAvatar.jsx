import React, { useState } from 'react';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${import.meta.env.VITE_API_URL || 'https://hook.runasp.net'}${url}`;
};

const UserAvatar = ({ url, name, className }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (url && !imgError) {
    return (
      <img 
        src={getImageUrl(url)} 
        alt={name} 
        onError={() => setImgError(true)}
        className={`object-cover ${className}`} 
      />
    );
  }
  
  return (
    <div className={`flex items-center justify-center bg-sky-500/20 border border-sky-400/30 text-sky-400 font-bold uppercase ${className}`}>
      {initial}
    </div>
  );
};

export default UserAvatar;