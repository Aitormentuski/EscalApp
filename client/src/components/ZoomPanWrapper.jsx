import React, { useState, useRef } from 'react';
import Icon from './Icon';

const ZoomPanWrapper = ({ children, onContentClick, className }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const isClick = useRef(true);

    const handlePointerDown = (e) => {
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragStart.current = { x: clientX, y: clientY };
        isClick.current = true;
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const dx = clientX - dragStart.current.x;
        const dy = clientY - dragStart.current.y;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isClick.current = false;
        if (scale > 1) setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        dragStart.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        if (isClick.current && onContentClick) onContentClick(e);
    };

    const zoomIn = () => setScale(p => Math.min(p + 0.5, 4));
    const zoomOut = () => setScale(p => { const n = Math.max(p - 0.5, 1); if (n === 1) setPosition({ x: 0, y: 0 }); return n; });
    const resetZoom = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

    return (
        <div className={`relative overflow-hidden w-full h-full bg-stone-900 touch-none ${className}`}
            onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}
            onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp}>
            <div style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
                className="w-full h-full flex items-center justify-center cursor-crosshair">
                {children}
            </div>
            <div className="absolute bottom-6 right-4 flex flex-col gap-3 z-30 pointer-events-auto">
                {scale > 1 && <button onClick={resetZoom} className="bg-blue-600/90 p-2 rounded-full text-white shadow-lg animate-fade-in text-[10px] font-bold w-10 h-10 flex items-center justify-center border border-white/20">1x</button>}
                <button onClick={zoomIn} className="bg-black/60 backdrop-blur p-2 rounded-full text-white border border-white/20 shadow-lg w-10 h-10 flex items-center justify-center active:bg-black"><Icon name="plus" /></button>
                <button onClick={zoomOut} className="bg-black/60 backdrop-blur p-2 rounded-full text-white border border-white/20 shadow-lg w-10 h-10 flex items-center justify-center active:bg-black"><Icon name="minus" /></button>
            </div>
        </div>
    );
};

export default ZoomPanWrapper;
