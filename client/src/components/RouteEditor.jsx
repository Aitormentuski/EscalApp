import React, { useState, useRef } from 'react';
import ZoomPanWrapper from './ZoomPanWrapper';
import Icon from './Icon';
import { HOLD_TYPES, GRADING_SYSTEMS, AVAILABLE_TAGS } from '../utils/constants';

const RouteEditor = ({ wall, initialData, onSave, onCancel }) => {
    // Determine images to use: either from initialData (editing) or passed from WallDetail (new)
    const images = initialData?.images || (wall.images?.length > 0 ? wall.images : [{ url: wall.image, path: wall.image_path }]);
    const [activeIdx, setActiveIdx] = useState(0);

    const [holds, setHolds] = useState(() => {
        if (!initialData?.holds) return {};
        if (Array.isArray(initialData.holds)) {
            return { [images[0].path]: initialData.holds };
        }
        return initialData.holds;
    });

    const [selectedTool, setSelectedTool] = useState('normal');
    const [localImages, setLocalImages] = useState(images);
    const [isSelectingImages, setIsSelectingImages] = useState(false);

    const [metadata, setMetadata] = useState({
        title: initialData?.title || '',
        gradingSystem: initialData?.gradingSystem || 'v_scale',
        grade: initialData?.grade || 'V3',
        description: initialData?.description || '',
        status: initialData?.status || 'project',
        tags: initialData?.tags || [],
        images: localImages // Consolidate images here
    });
    const [isSaving, setIsSaving] = useState(false);
    const imgRef = useRef(null);

    const activeImage = localImages[activeIdx] || localImages[0] || { url: wall.image, path: wall.image_path };
    const currentHolds = (activeImage && holds[activeImage.path]) || [];

    const handleSystemChange = (e) => setMetadata({ ...metadata, gradingSystem: e.target.value, grade: GRADING_SYSTEMS[e.target.value].grades[0] });

    const handleContentClick = (e) => {
        if (selectedTool === 'eraser' || !imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
            const newHold = { id: Date.now(), x, y, type: selectedTool };
            setHolds(prev => ({
                ...prev,
                [activeImage.path]: [...(prev[activeImage.path] || []), newHold]
            }));
        }
    };

    const handleHoldClick = (e, holdId) => {
        e.stopPropagation();
        const hList = holds[activeImage.path] || [];
        let newHList;
        if (selectedTool === 'eraser') {
            newHList = hList.filter(h => h.id !== holdId);
        } else {
            newHList = hList.map(h => h.id === holdId ? { ...h, type: selectedTool } : h);
        }
        setHolds(prev => ({ ...prev, [activeImage.path]: newHList }));
    };

    const totalHoldsCount = Object.values(holds).reduce((acc, curr) => acc + curr.length, 0);

    const toggleTag = (tag) => {
        setMetadata(prev => {
            const newTags = prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag];
            return { ...prev, tags: newTags };
        });
    };

    return (
        <div className="absolute inset-0 flex flex-col z-40 bg-[#0f172a] animate-fade-in">
            <div className="absolute top-0 left-0 right-0 p-4 pt-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <button onClick={onCancel} className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-full px-4 py-2 text-white text-xs font-bold pointer-events-auto active:bg-slate-700">CANCELAR</button>
                <div className="bg-blue-600/20 backdrop-blur px-3 py-1 rounded-full border border-blue-500/30"><span className="text-xs font-bold text-blue-300 uppercase tracking-widest">EDICIÓN</span></div>
                <button onClick={() => totalHoldsCount > 0 ? setIsSaving(true) : alert('Marca agarres primero')} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-900/30 transition-transform active:scale-95 pointer-events-auto">GUARDAR</button>
            </div>

            <ZoomPanWrapper className="flex-1" key={activeImage.path} onContentClick={handleContentClick}>
                <div className="relative w-full max-w-4xl shadow-2xl">
                    <img ref={imgRef} src={activeImage.url} className="w-full h-auto object-contain select-none pointer-events-none" />
                    {currentHolds.map(h => (
                        <div key={h.id} onPointerUp={(e) => handleHoldClick(e, h.id)} className={`absolute w-6 h-6 md:w-8 md:h-8 -ml-3 -mt-3 rounded-full border-[3px] ${HOLD_TYPES[h.type.toUpperCase()].color} bg-transparent cursor-pointer z-20 shadow-sm pointer-events-auto`} style={{ left: `${h.x}%`, top: `${h.y}%` }}></div>
                    ))}
                </div>
            </ZoomPanWrapper>

            {/* Selector de fotos de la colección */}
            {images.length > 1 && (
                <div className="absolute top-20 left-4 right-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none z-40 pointer-events-auto">
                    {images.map((img, idx) => (
                        <button
                            key={img.path}
                            onClick={() => setActiveIdx(idx)}
                            className={`flex-shrink-0 w-16 h-12 rounded-lg border-2 overflow-hidden transition-all ${idx === activeIdx ? 'border-blue-500 scale-110 shadow-lg' : 'border-slate-800'}`}
                        >
                            <img src={img.url} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="absolute bottom-6 left-4 flex flex-col gap-3 z-40 pointer-events-auto">
                {[HOLD_TYPES.START_FOOT, HOLD_TYPES.START_HAND, HOLD_TYPES.NORMAL, HOLD_TYPES.TOP].map(type => (
                    <button key={type.id} onClick={() => setSelectedTool(type.id)} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${selectedTool === type.id ? 'bg-white ring-2 ring-blue-500 scale-110' : 'bg-black/60 backdrop-blur border border-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 ${type.color} bg-transparent`}></div>
                    </button>
                ))}
                <div className="h-2"></div>
                <button onClick={() => setSelectedTool('eraser')} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${selectedTool === 'eraser' ? 'bg-red-500 text-white scale-110' : 'bg-black/60 backdrop-blur border border-white/20 text-gray-300'}`}><Icon name="trash" size={20} /></button>
            </div>

            {isSaving && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSaving(false)}></div>
                    <div className="relative bg-slate-900 border border-white/10 w-full max-w-xs rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[80vh] overflow-hidden animate-pop">
                        <div className="p-5 flex items-center justify-between border-b border-slate-800 bg-slate-800/50">
                            <h3 className="text-lg font-display font-bold text-white uppercase italic">Guardar Ruta</h3>
                            <button onClick={() => setIsSaving(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><Icon name="x" size={24} /></button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-5">
                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Nombre de la línea</label>
                                <input autoFocus type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white text-base focus:border-blue-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20" value={metadata.title} onChange={e => setMetadata({ ...metadata, title: e.target.value })} placeholder="Ej. El gran dinámico" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Sistema</label>
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white text-sm outline-none cursor-pointer" value={metadata.gradingSystem} onChange={handleSystemChange}>
                                        {Object.entries(GRADING_SYSTEMS).map(([key, system]) => <option key={key} value={key}>{system.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Grado estimado</label>
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white text-base font-bold outline-none cursor-pointer" value={metadata.grade} onChange={e => setMetadata({ ...metadata, grade: e.target.value })}>
                                        {GRADING_SYSTEMS[metadata.gradingSystem].grades.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Estilo y Etiquetas</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_TAGS.map(tag => (
                                        <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${metadata.tags.includes(tag) ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{tag}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Fotos de la Ruta ({localImages.length})</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                    {localImages.map(img => (
                                        <div key={img.path} className="w-16 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0">
                                            <img src={img.url} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <button onClick={() => setIsSelectingImages(true)} className="w-16 h-12 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500 transition-all shrink-0">
                                        <Icon name="plus" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                            <button
                                onClick={() => onSave({ ...metadata, holds, images: localImages })}
                                className="w-full py-3 bg-emerald-600 rounded-xl font-bold text-white shadow-xl hover:bg-emerald-500 active:scale-[0.98] transition-all uppercase tracking-widest text-[11px]"
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <Icon name="check" size={16} />
                                    <span>Publicar Ruta</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isSelectingImages && (
                <div className="absolute inset-0 z-[110] bg-[#0f172a] flex flex-col animate-fade-in overflow-hidden">
                    <div className="p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
                        <h3 className="text-xl font-bold text-white uppercase italic">Editar Fotos</h3>
                        <button onClick={() => setIsSelectingImages(false)} className="text-slate-400 p-2"><Icon name="x" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                        <div className="grid grid-cols-2 gap-4">
                            {wall.images?.map((img, idx) => {
                                const isSelected = localImages.some(li => li.path === img.path);
                                return (
                                    <div
                                        key={img.path}
                                        onClick={() => {
                                            if (isSelected) setLocalImages(prev => prev.filter(li => li.path !== img.path));
                                            else if (localImages.length < 10) setLocalImages(prev => [...prev, img]);
                                        }}
                                        className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-blue-500 scale-[0.98] shadow-lg shadow-blue-500/20' : 'border-slate-800 opacity-60'}`}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" />
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border ${isSelected ? 'bg-blue-500 border-blue-400' : 'bg-black/50 border-white/20'}`}>
                                            {isSelected && <Icon name="check" size={14} className="text-white" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                        <button onClick={() => setIsSelectingImages(false)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm">
                            LISTO ({localImages.length})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteEditor;
