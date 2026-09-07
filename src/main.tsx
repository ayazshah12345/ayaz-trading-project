import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[Trading Aura] Service Worker registered:', registration.scope)

        // Check for updates every 60 seconds
        setInterval(() => registration.update(), 60_000)
      })
      .catch((err) => {
        console.warn('[Trading Aura] Service Worker registration failed:', err)
      })
  })
}

// PWA install prompt handler — store it for use in UI
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  deferredInstallPrompt = e as BeforeInstallPromptEvent

  // Dispatch a custom event so any component can show the install button
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: { prompt: e } }))
})

window.addEventListener('appinstalled', () => {
  console.log('[Trading Aura] App installed as PWA ✓')
  deferredInstallPrompt = null
})

export { deferredInstallPrompt }
