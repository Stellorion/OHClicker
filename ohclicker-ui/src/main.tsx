import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PositionOverlay } from './components/overlay/PositionOverlay.tsx'

const root = new URLSearchParams(window.location.search).has('position-overlay')
  ? <PositionOverlay />
  : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {root}
  </StrictMode>,
)