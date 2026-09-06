import React, { useState } from 'react';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { Settings, Save, CheckCircle2, User, Sliders, Database, Shield } from 'lucide-react';
import type { UserSettings } from '../types';

interface SettingsPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ workspace }) => {
  const [settings, setSettings] = useState<UserSettings>(workspace.userSettings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    workspace.updateSettings(settings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
            <Settings className="theme-text-secondary" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Configure terminal preferences, default risk parameters, chart appearance, and profile.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg shadow-md transition"
        >
          <Save size={15} />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono-numeric font-bold flex items-center space-x-2">
          <CheckCircle2 size={16} />
          <span>Settings updated successfully!</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* General Settings */}
        <div className="terminal-card p-5 space-y-4">
          <h3 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
            <Sliders size={15} className="text-blue-600 dark:text-blue-400" />
            <span>General Preferences</span>
          </h3>

          <div className="space-y-3 font-mono-numeric">
            <div>
              <label className="block theme-text-secondary font-bold mb-1">Default Market Symbol</label>
              <select
                value={settings.general.defaultMarket}
                onChange={e =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultMarket: e.target.value },
                  })
                }
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary outline-none font-bold"
              >
                <option value="XAUUSD">XAUUSD (Gold)</option>
                <option value="BTCUSDT">BTCUSDT (Bitcoin)</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
              </select>
            </div>

            <div>
              <label className="block theme-text-secondary font-bold mb-1">Default Chart Timeframe</label>
              <select
                value={settings.general.defaultTimeframe}
                onChange={e =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultTimeframe: e.target.value as any },
                  })
                }
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary outline-none font-bold"
              >
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1H">1H</option>
                <option value="4H">4H</option>
              </select>
            </div>

            <div>
              <label className="block theme-text-secondary font-bold mb-1">Base Currency</label>
              <input
                type="text"
                value={settings.general.currency}
                onChange={e =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, currency: e.target.value },
                  })
                }
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* Trading Risk & Session Preferences */}
        <div className="terminal-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2 border-b border-[#2a2e39] pb-2">
            <Shield size={15} className="text-emerald-400" />
            <span>Trading Risk & Execution Defaults</span>
          </h3>

          <div className="space-y-3 font-mono-numeric">
            <div>
              <label className="block text-slate-400 mb-1">Default Risk Percentage per Trade (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.trading.defaultRiskPercentage}
                onChange={e =>
                  setSettings({
                    ...settings,
                    trading: {
                      ...settings.trading,
                      defaultRiskPercentage: parseFloat(e.target.value) || 1,
                    },
                  })
                }
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none font-bold"
              />
            </div>

            <div>
              <label className="block theme-text-secondary mb-1">Default Session</label>
              <select
                value={settings.trading.defaultSession}
                onChange={e =>
                  setSettings({
                    ...settings,
                    trading: { ...settings.trading, defaultSession: e.target.value as any },
                  })
                }
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none"
              >
                <option value="Asia">Asia Session</option>
                <option value="London">London Session</option>
                <option value="New York">New York Session</option>
              </select>
            </div>

            <div>
              <label className="block theme-text-secondary mb-1">Default Playbook Strategy</label>
              <input
                type="text"
                value={settings.trading.defaultStrategy}
                onChange={e =>
                  setSettings({
                    ...settings,
                    trading: { ...settings.trading, defaultStrategy: e.target.value },
                  })
                }
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none font-sans"
              />
            </div>
          </div>
        </div>

        {/* Data Import / Export Section */}
        <div className="terminal-card p-5 space-y-4">
          <h3 className="text-xs font-bold theme-text-primary uppercase tracking-wider flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
            <Database size={15} className="text-amber-500" />
            <span>Workspace Data Management</span>
          </h3>

          <p className="theme-text-secondary text-xs font-sans">
            Export all personal trade logs, daily journals, and backtesting campaign records into JSON or CSV.
          </p>

          <div className="flex space-x-3 pt-2">
            <button className="px-4 py-2 bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-primary rounded border border-[var(--border-color)] font-mono-numeric transition">
              Export Full Workspace Data
            </button>
            <button className="px-4 py-2 bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-primary rounded border border-[var(--border-color)] font-mono-numeric transition">
              Import Backup File
            </button>
          </div>
        </div>

        {/* Account & Profile */}
        <div className="terminal-card p-5 space-y-4">
          <h3 className="text-xs font-bold theme-text-primary uppercase tracking-wider flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
            <User size={15} className="text-indigo-400" />
            <span>Profile & Account</span>
          </h3>

          <div className="flex items-center space-x-4">
            <img
              src={settings.profile.avatar}
              alt={settings.profile.name}
              className="w-12 h-12 rounded-full object-cover border border-blue-500"
            />
            <div>
              <div className="font-bold text-slate-100 text-sm font-sans">{settings.profile.name}</div>
              <div className="text-slate-400 text-xs font-mono-numeric">{settings.profile.email}</div>
              <div className="text-[10px] text-blue-400 font-semibold font-mono-numeric">{settings.profile.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
