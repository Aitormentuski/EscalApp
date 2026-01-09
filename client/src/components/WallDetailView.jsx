import React, { useState } from 'react';
import SafeImage from './SafeImage';
import Icon from './Icon';
import { GRADING_SYSTEMS } from '../utils/constants';

const WallDetailView = ({ wall, routes, onBack, onAddRoute, onSelectRoute }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const toggleImage = (img) => {
        setSelectedImages(prev =>
            prev.find(i => i.path === img.path)
                ? prev.filter(i => i.path !== img.path)
                : [...prev, img]
        );
    };

    const handleConfirm = () => {
        if (selectedImages.length === 0) return;
        onAddRoute(selectedImages);
        setIsSelecting(false);
    };

    const handleAddClick = () => {
        if (!wall.images || wall.images.length <= 1) {
            onAddRoute(wall.images && wall.images.length > 0 ? [wall.images[0]] : [{ url: wall.image, path: wall.image_path }]);
        } else {
            setIsSelecting(true);
            setSelectedImages([]); // Start fresh
        }
    };

    return (
        <div className="animate-fade-in bg-[#0f172a] min-h-screen">
            <div className="relative h-72 shrink-0">
                <SafeImage src={wall.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between">
                    <button onClick={onBack} className="bg-black/50 backdrop-blur p-2 rounded-full text-white border border-white/10 hover:bg-black/70 pointer-events-auto active:scale-95">
                        <Icon name="arrowLeft" />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-4xl font-display font-bold text-white uppercase italic leading-none mb-2 text-shadow">{wall.name}</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="bg-blue-600 px-2 py-0.5 rounded font-bold">{routes.length} RUTAS</span>
                        {wall.images?.length > 1 && <span className="bg-slate-700 px-2 py-0.5 rounded font-bold uppercase">{wall.images.length} FOTOS</span>}
                    </div>
                </div>
                {!isSelecting && (
                    <button onClick={handleAddClick} className="absolute -bottom-7 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] z-10 hover:scale-110 transition-transform border-4 border-[#0f172a] pointer-events-auto">
                        <Icon name="plus" size={28} />
                    </button>
                )}
            </div>

            <div className="p-4 mt-8 space-y-3 pb-32">
                {routes.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <Icon name="route" size={40} className="mx-auto mb-2 text-slate-600" />
                        <p className="text-sm">Muro virgen. Crea la primera línea.</p>
                    </div>
                )}
                {routes.map(r => (
                    <div key={r.id} onClick={() => onSelectRoute(r)} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center cursor-pointer hover:bg-slate-700/50 transition-colors pointer-events-auto">
                        <div className="flex items-center gap-4">
                            <div className="font-display font-bold text-xl text-blue-400 w-10 text-center">{r.grade}</div>
                            <div>
                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                    {r.title} {r.status === 'sent' && <Icon name="check" size={12} className="text-green-500" />}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase">{GRADING_SYSTEMS[r.gradingSystem]?.label}</p>
                            </div>
                        </div>
                        <Icon name="route" size={16} className="text-slate-600" />
                    </div>
                ))}
            </div>

            {/* Selector de imágenes */}
            {isSelecting && (
                <div className="absolute inset-0 z-50 bg-[#0f172a] flex flex-col animate-fade-in overflow-hidden border-b border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                        <h3 className="text-xl font-bold text-white uppercase italic">Elegir Fotos</h3>
                        <button onClick={() => setIsSelecting(false)} className="text-slate-400 p-2"><Icon name="x" /></button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        <p className="text-sm text-slate-400 mb-6 font-medium">Selecciona las imágenes de la colección que usarás para esta ruta:</p>
                        <div className="grid grid-cols-2 gap-4 pb-10">
                            {wall.images?.map((img, idx) => {
                                const isSelected = selectedImages.find(i => i.path === img.path);
                                return (
                                    <div
                                        key={img.path}
                                        onClick={() => toggleImage(img)}
                                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 ${isSelected ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-800 grayscale'}`}
                                    >
                                        <SafeImage src={img.url} className="w-full h-full object-cover" />
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'bg-blue-500 border-blue-400' : 'bg-black/50 border-white/20'}`}>
                                            {isSelected && <Icon name="check" size={14} className="text-white" />}
                                        </div>
                                        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-[10px] text-white font-bold border border-white/10">FOTO #{idx + 1}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                        <div className="flex gap-3 max-w-md mx-auto">
                            <button
                                onClick={() => setIsSelecting(false)}
                                className="bg-slate-800 text-slate-400 px-6 py-4 rounded-xl font-bold active:scale-95 border border-slate-700 hover:bg-slate-700 transition-colors"
                            >
                                <Icon name="x" />
                            </button>
                            <button
                                disabled={selectedImages.length === 0}
                                onClick={handleConfirm}
                                className={`flex-1 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${selectedImages.length > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/40' : 'bg-slate-800 text-slate-500 grayscale cursor-not-allowed'}`}
                            >
                                {selectedImages.length > 0 && <Icon name="check" size={20} />}
                                {selectedImages.length === 0 ? 'ELIGE AL MENOS UNA' : 'ACEPTAR'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WallDetailView;
