import React, { useState } from 'react';

const SafeImage = ({ src, alt, className, ...props }) => {
    const [error, setError] = useState(false);
    if (error) return <div className={`bg-slate-800 flex items-center justify-center ${className}`} {...props}><span className="text-4xl">🧗</span></div>;
    return <img src={src} alt={alt} className={className} onError={() => setError(true)} {...props} />;
};

export default SafeImage;
