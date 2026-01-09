export const APP_STORAGE_KEY = 'spraywall_v19_clean';

export const HOLD_TYPES = {
    START_FOOT: { id: 'start_foot', color: 'border-blue-500', label: 'P' },
    START_HAND: { id: 'start_hand', color: 'border-emerald-500', label: 'M' },
    NORMAL: { id: 'normal', color: 'border-yellow-400', label: 'R' },
    TOP: { id: 'top', color: 'border-rose-600', label: 'T' },
    ERASER: { id: 'eraser', color: 'border-gray-400', label: 'X' }
};

export const GRADING_SYSTEMS = {
    'v_scale': { label: 'Boulder (V-Scale)', grades: ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12+'] },
    'font_scale': { label: 'Boulder (Font)', grades: ['4', '5', '6A', '6A+', '6B', '6B+', '6C', '6C+', '7A', '7A+', '7B', '7C', '8A', '8B+'] },
    'french_sport': { label: 'Deportiva', grades: ['4', '5a', '6a', '6a+', '6b', '6c', '7a', '7a+', '7b', '7c', '8a', '9a'] }
};

export const AVAILABLE_TAGS = ['Regleta', 'Romo', 'Pinza', 'Dinámico', 'Equilibrio', 'Físico', 'Técnico', 'Resistencia', 'Placa', 'Desplome'];
