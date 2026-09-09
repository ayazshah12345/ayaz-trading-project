import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register PWA Service Worker with auto-update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[Trading Aura] Service Worker registered:', registration.scope)

        // Check for updates immediately and periodically
        registration.update()
        setInterval(() => registration.update(), 15_000)
      })
      .catch((err) => {
        console.warn('[Trading Aura] Service Worker registration failed:', err)
      })
  })

  // When a new service worker takes over, reload the window automatically
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true
      window.location.reload()
    }
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
