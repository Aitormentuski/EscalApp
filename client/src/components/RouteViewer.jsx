import React, { useMemo, useState } from 'react';
import ZoomPanWrapper from './ZoomPanWrapper';
import SafeImage from './SafeImage';
import Icon from './Icon';
import { HOLD_TYPES, GRADING_SYSTEMS } from '../utils/constants';

const RouteViewer = ({ wall, route, onBack, onEdit, onUpdateStatus, onFork, onDelete }) => {
    const isSent = route.status === 'sent';
    const [isCelebrating, setIsCelebrating] = useState(false);

    // Determine images to use
    const images = route.images || (wall.images?.length > 0 ? wall.images : [{ url: wall.image, path: wall.image_path }]);
    const [activeIdx, setActiveIdx] = useState(0);
    const activeImage = images[activeIdx];

    const currentHolds = useMemo(() => {
        if (!route.holds) return [];
        if (Array.isArray(route.holds)) {
            return activeIdx === 0 ? route.holds : [];
        }
        return route.holds[activeImage.path] || [];
    }, [route.holds, activeImage, activeIdx]);

    const handleCelebrate = () => {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 1000);
        onUpdateStatus('sent');
    };

    return (
        <div className="absolute inset-0 flex flex-col z-40 bg-[#0f172a] animate-fade-in overflow-hidden">
            <div className="absolute top-0 left-0 right-0 p-4 pt-4 flex justify-between items-center z-40 pointer-events-none">
                <button onClick={onBack} className="bg-black/50 backdrop-blur border border-white/10 rounded-full p-2 text-white pointer-events-auto hover:bg-black/70 active:scale-95">
                    <Icon name="arrowLeft" />
                </button>
                <div className="flex gap-2 pointer-events-auto">
                    <button onClick={onFork} className="bg-slate-700/80 backdrop-blur rounded-full p-3 text-white shadow-lg active:scale-95"><Icon name="copy" size={20} /></button>
                    <button onClick={onEdit} className="bg-blue-600 rounded-full p-3 text-white shadow-lg active:bg-blue-700"><Icon name="pencil" size={20} /></button>
                    <button onClick={() => { if (confirm('¿Borrar ruta?')) onDelete(route.id); }} className="bg-red-600/80 rounded-full p-3 text-white shadow-lg active:bg-red-700"><Icon name="trash" size={20} /></button>
                </div>
            </div>

            <ZoomPanWrapper className="flex-1" key={activeImage.path}>
                <div className="relative w-full max-w-4xl shadow-2xl">
                    <SafeImage src={activeImage.url} className="w-full h-auto object-contain select-none pointer-events-none" />
                    {currentHolds.map(h => (
                        <div key={h.id} className={`absolute w-6 h-6 md:w-8 md:h-8 -ml-3 -mt-3 rounded-full border-[3px] ${HOLD_TYPES[h.type.toUpperCase()]?.color || 'border-white'} bg-transparent z-20 shadow-sm pointer-events-none`} style={{ left: `${h.x}%`, top: `${h.y}%` }}></div>
                    ))}
                </div>
            </ZoomPanWrapper>

            {/* Selector de fotos (si hay varias) */}
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

            {/* Botón Flotante de Encadenado - Movido a la izquierda para evitar zoom controls */}
            <div className="absolute bottom-24 left-6 z-50">
                <button
                    onClick={handleCelebrate}
                    className={`group relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isSent ? 'bg-green-500 text-white shadow-green-500/40 border-4 border-white/20' : 'bg-slate-800 text-slate-400 border-2 border-slate-700'} ${isCelebrating ? 'animate-celebrate' : ''}`}
                >
                    <Icon name="check" size={32} strokeWidth={isSent ? 4 : 2} className={isSent ? 'scale-110' : 'opacity-40'} />
                    {isCelebrating && (
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="confetti" style={{
                                    transform: `rotate(${i * 30}deg) translateY(-40px)`,
                                    animation: `celebrate-pop 0.6s ${i * 0.02}s ease-out forwards`,
                                    background: i % 2 === 0 ? '#3b82f6' : '#10b981'
                                }} />
                            ))}
                        </div>
                    )}
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-8 pb-4 px-6 z-30 pointer-events-none">
                <div className="flex items-end gap-4 mb-2 pointer-events-auto">
                    <div className="text-4xl font-display font-bold text-blue-500 text-shadow shrink-0">{route.grade}</div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-display font-bold text-white uppercase italic text-shadow leading-tight mb-0.5 truncate">{route.title}</h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-[8px] border border-white/10 text-slate-400 font-bold uppercase tracking-tighter">{GRADING_SYSTEMS[route.gradingSystem]?.label.split('(')[0]}</span>
                            {route.sent_count > 0 && <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[8px] border border-green-500/30 font-bold uppercase tracking-tighter">{route.sent_count} ENCADENADO</span>}
                        </div>
                    </div>
                </div>
                {route.description && <p className="text-[10px] text-slate-400 italic line-clamp-1 pointer-events-auto opacity-60">{route.description}</p>}
            </div>
        </div>
    );
};

export default RouteViewer;
