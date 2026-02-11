import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/visibility-fixes.css'
import './styles/dark-mode.css'
import App from './App.jsx'
import { ToastProvider } from './Components/Toast/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { PersonalizationProvider } from './context/PersonalizationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <PersonalizationProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </PersonalizationProvider>
      </ToastProvider>
    </LanguageProvider>
  </StrictMode>,
)
