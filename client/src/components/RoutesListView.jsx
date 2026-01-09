import React, { useState } from 'react';
import Icon from './Icon';
import SafeImage from './SafeImage';
import { GRADING_SYSTEMS } from '../utils/constants';

const RoutesListView = ({ routes, onSelectRoute }) => {
    const [filter, setFilter] = useState('');
    const filteredRoutes = routes.filter(r => r.title.toLowerCase().includes(filter.toLowerCase()) || r.grade.toLowerCase().includes(filter.toLowerCase()));
    return (
        <div className="p-6 pt-8 pb-4 animate-fade-in flex flex-col h-full bg-[#0f172a] overflow-hidden">
            <div className="mb-6 sticky top-0 z-10 bg-[#0f172a]/95 pb-2 backdrop-blur shrink-0">
                <header className="mb-4"><h1 className="text-4xl font-display font-bold text-white mb-1 uppercase italic">Tus Rutas</h1></header>
                <div className="relative"><Icon name="search" className="absolute left-3 top-3 text-slate-500" size={18} /><input type="text" placeholder="Buscar ruta o grado..." className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20" value={filter} onChange={e => setFilter(e.target.value)} /></div>
            </div>
            {filteredRoutes.length === 0 ? <div className="text-center py-20 opacity-50"><p className="text-slate-500 font-medium">No se encontraron rutas.</p></div> :
                <div className="grid grid-cols-1 gap-4 mt-2 overflow-y-auto w-full pb-20 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                    {filteredRoutes.map(route => {
                        const thumbUrl = route.images?.[0]?.url || route.image;
                        return (
                            <div key={route.id} onClick={() => onSelectRoute(route)} className="bg-slate-800/40 p-3 rounded-2xl border border-white/5 flex gap-4 cursor-pointer hover:bg-slate-800/80 transition-all group active:scale-[0.98]">
                                <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                    <SafeImage src={thumbUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {route.status === 'sent' && (
                                        <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5 shadow-lg">
                                            <Icon name="check" size={10} strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white text-base truncate group-hover:text-blue-400 transition-colors">{route.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{GRADING_SYSTEMS[route.gradingSystem]?.label.split('(')[0]}</span>
                                            {route.sent_count > 0 && (
                                                <span className="text-[10px] bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-bold flex items-center gap-1">
                                                    <Icon name="target" size={10} /> {route.sent_count} {route.sent_count === 1 ? 'VEZ' : 'VECES'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className={`px-2.5 py-0.5 rounded-lg font-display font-black text-sm border-2 ${route.grade.includes('V8') || route.grade.includes('7c') ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-blue-400 border-blue-500/20 bg-blue-500/5'}`}>{route.grade}</div>
                                        <Icon name="arrowRight" size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>}
        </div>
    );
};

export default RoutesListView;
