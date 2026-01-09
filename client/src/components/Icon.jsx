import React from 'react';
import { Home, Route, BarChart2, ArrowLeft, Trash2, Plus, Minus, Camera, Edit2, X, Search, Copy, Check, Settings, Download, Upload } from 'lucide-react';

const Icon = ({ name, size = 20, className = "" }) => {
    const icons = {
        home: <Home size={size} className={className} />,
        route: <Route size={size} className={className} />,
        stats: <BarChart2 size={size} className={className} />,
        arrowLeft: <ArrowLeft size={size} className={className} />,
        trash: <Trash2 size={size} className={className} />,
        plus: <Plus size={size} className={className} />,
        minus: <Minus size={size} className={className} />,
        camera: <Camera size={size} className={className} />,
        pencil: <Edit2 size={size} className={className} />,
        x: <X size={size} className={className} />,
        search: <Search size={size} className={className} />,
        copy: <Copy size={size} className={className} />,
        check: <Check size={size} className={className} />,
        settings: <Settings size={size} className={className} />,
        download: <Download size={size} className={className} />,
        upload: <Upload size={size} className={className} />
    };
    return icons[name] || null;
};

export default Icon;
