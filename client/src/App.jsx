import React, { useState, useEffect, useMemo } from 'react';
import Icon from './components/Icon';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import WallDetailView from './components/WallDetailView';
import RouteEditor from './components/RouteEditor';
import RouteViewer from './components/RouteViewer';
import RoutesListView from './components/RoutesListView';
import StatsView from './components/StatsView';

function App() {
    const [walls, setWalls] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [activeTab, setActiveTab] = useState('home');
    const [activeWallId, setActiveWallId] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [viewMode, setViewMode] = useState('none');
    const [viewSource, setViewSource] = useState(null); // 'home' or 'detail'

    // Fetch initial data
    useEffect(() => {
        fetch('/api/walls')
            .then(res => res.json())
            .then(data => setWalls(data))
            .catch(err => console.error("Failed to fetch walls", err));

        fetch('/api/routes')
            .then(res => res.json())
            .then(data => setRoutes(data))
            .catch(err => console.error("Failed to fetch routes", err));
    }, []);

    const activeWall = useMemo(() => walls.find(w => w.id === activeWallId), [walls, activeWallId]);
    const wallRoutes = useMemo(() => activeWallId ? routes.filter(r => r.wallId === activeWallId) : [], [routes, activeWallId]);

    const handleUploadWall = async (files) => {
        const filesArray = Array.isArray(files) ? files : [files];
        const formData = new FormData();
        filesArray.forEach(file => {
            formData.append('images', file);
        });
        formData.append('name', `Muro #${walls.length + 1}`);

        try {
            const res = await fetch('/api/walls', { method: 'POST', body: formData });
            const newWall = await res.json();
            setWalls(prev => [newWall, ...prev]);
        } catch (error) {
            console.error(error);
            alert("Error uploading wall");
        }
    };

    const handleSaveRoute = async (data) => {
        const method = selectedRoute && selectedRoute.id ? 'PUT' : 'POST';
        const url = selectedRoute && selectedRoute.id ? `/api/routes/${selectedRoute.id}` : '/api/routes';

        const payload = {
            ...data,
            wallId: activeWallId || selectedRoute?.wallId,
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const savedRoute = await res.json();

            setRoutes(prev => {
                if (method === 'PUT') return prev.map(r => r.id === savedRoute.id ? savedRoute : r);
                return [savedRoute, ...prev];
            });

            setSelectedRoute(savedRoute);
            setViewMode('viewer');
        } catch (error) {
            console.error(error);
            alert("Error saving route");
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedRoute) return;
        const updatedRoute = {
            ...selectedRoute,
            status,
            sent_count: status === 'sent' ? (selectedRoute.sent_count || 0) + 1 : (selectedRoute.sent_count || 0)
        };

        // Optimistic update
        setRoutes(prev => prev.map(r => r.id === selectedRoute.id ? updatedRoute : r));
        setSelectedRoute(updatedRoute);

        try {
            await fetch(`/api/routes/${selectedRoute.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRoute)
            });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleForkRoute = () => {
        if (!selectedRoute) return;
        const forkedRoute = { ...selectedRoute, id: null, title: `${selectedRoute.title} (Copia)`, status: 'project' };
        setSelectedRoute(forkedRoute);
        setViewMode('editor');
    };

    const handleDeleteRoute = async (id) => {
        if (!confirm('¿Borrar ruta?')) return;
        try {
            await fetch(`/api/routes/${id}`, { method: 'DELETE' });
            setRoutes(prev => prev.filter(r => r.id !== id));
            setViewMode('none');
        } catch (error) {
            console.error(error);
            alert("Error deleting route");
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify({ walls, routes });
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'spraywall_backup.json');
        linkElement.click();
    };

    const handleImport = (json) => {
        // Import currently just updates local state, but in full backend mode, 
        // we'd probably want to batch POST these to server.
        // For now, let's just warn or try to sync.
        // Implementing full sync is complex, so I'll leave it as "Local View" update for now
        // or disabled.
        alert("Import is not fully supported in backend mode yet.");
    };

    const handleTabChange = (tab) => { setActiveTab(tab); setViewMode('none'); if (tab === 'home') setActiveWallId(null); };

    // Common Bottom Nav


    return (
        <div className="app-layout bg-[#0f172a] h-screen flex flex-col overflow-hidden">
            <div className="app-content flex-1 relative overflow-hidden">
                {viewMode === 'editor' && activeWall ?
                    <div className="absolute inset-0 z-40 bg-[#0f172a]"><RouteEditor wall={activeWall} initialData={selectedRoute} onSave={handleSaveRoute} onCancel={() => selectedRoute && selectedRoute.id ? setViewMode('viewer') : setViewMode('none')} /></div>
                    : viewMode === 'viewer' && activeWall && selectedRoute ?
                        <div className="absolute inset-0 z-40 bg-[#0f172a]"><RouteViewer wall={activeWall} route={selectedRoute} onBack={() => { setViewMode('none'); if (viewSource === 'home') setActiveWallId(null); }} onEdit={() => setViewMode('editor')} onUpdateStatus={handleUpdateStatus} onFork={handleForkRoute} onDelete={handleDeleteRoute} /></div>
                        : activeWallId && activeTab === 'home' ?
                            <WallDetailView wall={activeWall} routes={wallRoutes} onBack={() => setActiveWallId(null)} onAddRoute={(selectedImages) => { setSelectedRoute({ images: selectedImages }); setViewMode('editor'); }} onSelectRoute={(r) => { setSelectedRoute(r); setViewSource('detail'); setViewMode('viewer'); }} />
                            : (
                                <div className="h-full relative overflow-hidden">
                                    {activeTab === 'home' && <HomeView walls={walls} routes={routes} onSelectWall={(w) => setActiveWallId(w.id)} onSelectRoute={(r) => { setSelectedRoute(r); setActiveWallId(r.wallId); setViewSource('home'); setViewMode('viewer'); }} onUploadWall={handleUploadWall} onExport={handleExport} onImport={handleImport} />}
                                    {activeTab === 'routes' && <RoutesListView routes={routes} onSelectRoute={(r) => { setSelectedRoute(r); setActiveWallId(r.wallId); setViewSource('list'); setViewMode('viewer'); }} />}
                                    {activeTab === 'stats' && <div className="h-full overflow-y-auto"><StatsView routes={routes} /></div>}
                                </div>
                            )}
            </div>
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
    );
}

export default App;
