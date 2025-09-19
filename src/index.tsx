import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './app/App';
import './app/styles/index.scss';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
