import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * PWAInstallBanner
 * Shows a sleek bottom banner when the app can be installed as a PWA.
 * Automatically appears when Chrome fires `beforeinstallprompt`.
 */
export function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handleInstallable = (e: Event) => {
      const customE = e as CustomEvent<{ prompt: BeforeInstallPromptEvent }>
      setInstallPrompt(customE.detail.prompt as BeforeInstallPromptEvent)
    }

    const handleInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('pwa-installable', handleInstallable)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('pwa-installable', handleInstallable)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (installed || dismissed || !installPrompt) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '12px 16px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        background: 'linear-gradient(135deg, #1a1d2e 0%, #0d0f1a 100%)',
        borderTop: '1px solid rgba(255,215,0,0.2)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.4s ease-out',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #ffd700, #22c55e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Smartphone size={22} color="#0d0f1a" />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
          Install Trading Aura
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
          Add to home screen for the full app experience
        </div>
      </div>

      {/* Install button */}
      <button
        onClick={handleInstall}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
          color: '#0d0f1a',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <Download size={14} />
        Install
      </button>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          padding: 4,
          flexShrink: 0,
        }}
        aria-label="Dismiss install prompt"
      >
        <X size={18} />
      </button>
    </div>
  )
}
