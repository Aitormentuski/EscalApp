import React, { useRef, useState } from 'react';
import SafeImage from './SafeImage';
import Icon from './Icon';
import { compressImage } from '../utils/helpers';
import { GRADING_SYSTEMS } from '../utils/constants';

const HomeView = ({ walls, routes, onSelectWall, onSelectRoute, onUploadWall, onImport, onExport }) => {
    const fileInputRef = useRef(null);
    const importInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setIsProcessing(true);
            try {
                const processedFiles = await Promise.all(
                    files.slice(0, 10).map(async (file) => {
                        const compressedBlob = await compressImage(file);
                        return new File([compressedBlob], file.name, { type: 'image/jpeg' });
                    })
                );
                onUploadWall(processedFiles);
            } catch (error) {
                console.error(error);
                alert("Error procesando imágenes");
            }
            setIsProcessing(false);
        }
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target.result);
                onImport(json);
                setShowSettings(false);
                alert("Datos importados correctamente");
            } catch (err) { alert("Archivo inválido"); }
        };
        reader.readAsText(file);
    };

    const latestRoutes = routes?.slice(0, 4) || [];

    return (
        <div className="h-full overflow-y-auto pb-24 animate-fade-in bg-[#0f172a] scrollbar-thin scrollbar-thumb-slate-700">
            <div className="relative h-48 bg-slate-900 overflow-hidden flex items-end shrink-0">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1597585090176-4c9f7d23f79e?q=80&w=1000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
                <div className="absolute top-4 right-4 z-20"><button onClick={() => setShowSettings(true)} className="p-2 bg-slate-800/50 backdrop-blur rounded-full text-white hover:bg-slate-700 shadow-lg"><Icon name="settings" size={20} /></button></div>
                <div className="relative z-10 p-6 w-full">
                    <h1 className="text-3xl font-display font-bold text-white uppercase italic leading-none text-shadow">
                        ESCAL<span className="text-blue-400">APP</span>
                    </h1>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* ÚLTIMAS RUTAS - Super Compactas y Horizontales */}
                {latestRoutes.length > 0 && (
                    <section>
                        <header className="flex justify-between items-center mb-3 px-1">
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Últimos Desafíos</h2>
                            <span className="text-[8px] font-bold text-blue-500/50 uppercase tracking-tighter">Desliza para ver más →</span>
                        </header>
                        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none px-1 snap-x">
                            {latestRoutes.map(route => (
                                <div key={route.id} onClick={() => onSelectRoute(route)} className="flex-none w-16 group cursor-pointer snap-start">
                                    <div className="aspect-square relative rounded-xl overflow-hidden border border-white/5 shadow-2xl mb-1.5 active:scale-90 transition-all">
                                        <SafeImage src={route.images?.[0]?.url || route.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-md px-1 py-0.5 text-[6px] font-black shadow-lg">#{route.grade}</div>
                                    </div>
                                    <div className="px-0.5">
                                        <div className="text-[7px] font-black text-white truncate uppercase italic leading-tight">{route.title}</div>
                                        <div className="text-[6px] font-bold text-slate-500 uppercase tracking-tighter truncate">{(GRADING_SYSTEMS[route.gradingSystem]?.label || 'Boulder').split('(')[0]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* MUROS SUBIDOS - 2 columnas */}
                <section>
                    <header className="mb-4">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Tus Colecciones</h2>
                    </header>
                    <div className="grid grid-cols-2 gap-4">
                        {walls.map(wall => (
                            <div key={wall.id} onClick={() => onSelectWall(wall)} className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/5 transform transition-all active:scale-95">
                                <SafeImage src={wall.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 pr-2">
                                    <h3 className="font-display font-bold text-white text-xs uppercase italic tracking-wider truncate">{wall.name}</h3>
                                    <div className="text-[8px] text-blue-400 font-bold uppercase mt-0.5">VER COLECCIÓN</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <div className="fixed bottom-24 right-6 z-30 pointer-events-auto">
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
                <button onClick={() => fileInputRef.current.click()} className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:scale-110 transition-all border border-blue-400/50">{isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Icon name="camera" size={24} />}</button>
            </div>
            {showSettings && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">Configuración</h3><button onClick={() => setShowSettings(false)} className="text-slate-400"><Icon name="x" /></button></div>
                        <div className="space-y-3">
                            <button onClick={onExport} className="w-full py-4 bg-slate-700 rounded-xl flex items-center justify-center gap-3 text-white font-bold hover:bg-slate-600"><Icon name="download" /> Exportar Copia de Seguridad</button>
                            <input type="file" ref={importInputRef} className="hidden" accept=".json" onChange={handleImportFile} />
                            <button onClick={() => importInputRef.current.click()} className="w-full py-4 bg-slate-700 rounded-xl flex items-center justify-center gap-3 text-white font-bold hover:bg-slate-600"><Icon name="upload" /> Importar Datos</button>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-6">v19.0 - Stable</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeView;
