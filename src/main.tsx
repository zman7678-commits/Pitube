import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for smartphone offline support and instant loading
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
