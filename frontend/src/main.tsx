import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "sonner"
import './index.css'
import App from './App.tsx'
import StoreProvider from './components/provider/StoreProvider.tsx'
import { ThemeProvider } from './components/landing/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <Toaster />
        <App />
      </ThemeProvider>
    </StoreProvider>
  </StrictMode>,
)
