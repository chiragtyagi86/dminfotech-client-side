import { StrictMode } from 'react'
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteConfigProvider } from './context/SiteConfigContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <HelmetProvider>
    <SiteConfigProvider>
      <App />
    </SiteConfigProvider>
    </HelmetProvider>
  </StrictMode>,
)
