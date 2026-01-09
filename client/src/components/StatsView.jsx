import React from 'react';

const StatsView = ({ routes }) => {
    const total = routes.length;
    const sent = routes.filter(r => r.status === 'sent').length;
    return (
        <div className="p-6 pt-12 pb-32 animate-fade-in">
            <header className="mb-10"><h1 className="text-4xl font-display font-bold text-white mb-1 uppercase italic">Tu Progreso</h1></header>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-2xl"><div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Rutas Creadas</div><div className="text-4xl font-display font-bold text-white">{total}</div></div>
                <div className="bg-green-900/20 border border-green-800/50 p-5 rounded-2xl"><div className="text-green-500 text-[10px] font-bold uppercase tracking-widest mb-1">Encadenadas</div><div className="text-4xl font-display font-bold text-green-400">{sent}</div></div>
            </div>
        </div>
    );
};

export default StatsView;
