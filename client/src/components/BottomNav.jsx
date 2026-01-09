import React from 'react';
import Icon from './Icon';

const BottomNav = ({ activeTab, onTabChange }) => (
    <div className="bottom-nav bg-[#0f172a]/95 backdrop-blur-lg flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 h-[70px] shrink-0">
        <button onClick={() => onTabChange('home')} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-500'}`}>
            <Icon name="home" size={20} /><span className="text-[9px] font-bold uppercase tracking-wider">Inicio</span>
        </button>
        <button onClick={() => onTabChange('routes')} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 ${activeTab === 'routes' ? 'text-blue-400' : 'text-slate-500'}`}>
            <Icon name="route" size={20} /><span className="text-[9px] font-bold uppercase tracking-wider">Rutas</span>
        </button>
        <button onClick={() => onTabChange('stats')} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 ${activeTab === 'stats' ? 'text-blue-400' : 'text-slate-500'}`}>
            <Icon name="stats" size={20} /><span className="text-[9px] font-bold uppercase tracking-wider">Stats</span>
        </button>
    </div>
);

export default BottomNav;
