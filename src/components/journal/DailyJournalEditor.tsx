import React, { useState, useRef } from 'react';
import type { DailyJournalEntry, DailyBias } from '../../types';
import { Calendar, Save, CheckCircle2, Star, Upload, Image as ImageIcon, X, ZoomIn, Link as LinkIcon, Plus } from 'lucide-react';

interface DailyJournalEditorProps {
  initialJournal: DailyJournalEntry;
  onSave: (updated: DailyJournalEntry) => void;
}

export const DailyJournalEditor: React.FC<DailyJournalEditorProps> = ({
  initialJournal,
  onSave,
}) => {
  const [journal, setJournal] = useState<DailyJournalEntry>(initialJournal);
  const [saveNotification, setSaveNotification] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (field: keyof DailyJournalEntry, value: any) => {
    setJournal(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...journal, updatedAt: new Date().toISOString() });
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  // Image Upload Logic via FileReader (Base64)
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setJournal(prev => {
            const currentScreenshots = prev.screenshots || [];
            if (!currentScreenshots.includes(result)) {
              return { ...prev, screenshots: [...currentScreenshots, result] };
            }
            return prev;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    setJournal(prev => {
      const current = prev.screenshots || [];
      return { ...prev, screenshots: [...current, url] };
    });
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setJournal(prev => ({
      ...prev,
      screenshots: (prev.screenshots || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const biases: DailyBias[] = ['Bullish', 'Bearish', 'Neutral'];

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Top Controls Bar */}
      <div className="terminal-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
              Daily Trading Journal
            </h3>
            <p className="text-xs theme-text-secondary font-medium">
              Private workspace journal for market analysis, chart screenshots & self-reflection
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] theme-text-primary text-xs font-bold rounded-lg border border-[var(--border-color)] transition shadow-xs"
          >
            Save Draft
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg shadow-md transition"
          >
            <Save size={15} />
            <span>Save Journal</span>
          </button>
        </div>
      </div>

      {saveNotification && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono-numeric flex items-center space-x-2 font-bold animate-in fade-in shadow-xs">
          <CheckCircle2 size={16} />
          <span>Daily Journal entry saved successfully!</span>
        </div>
      )}

      {/* Primary Configuration Row: Date, Asset, Daily Bias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Selector */}
        <div className="terminal-card p-4 shadow-xs">
          <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider mb-2">
            Journal Date
          </label>
          <input
            type="date"
            value={journal.date}
            onChange={e => handleTextChange('date', e.target.value)}
            className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs font-mono-numeric theme-text-primary outline-none focus:border-blue-500 font-bold"
          />
        </div>

        {/* Primary Asset */}
        <div className="terminal-card p-4 shadow-xs">
          <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider mb-2">
            Primary Asset Studied
          </label>
          <select
            value={journal.asset}
            onChange={e => handleTextChange('asset', e.target.value)}
            className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs font-mono-numeric theme-text-primary outline-none focus:border-blue-500 cursor-pointer font-bold"
          >
            <option value="XAUUSD">XAUUSD (Gold Spot)</option>
            <option value="BTCUSDT">BTCUSDT (Bitcoin)</option>
            <option value="EURUSD">EURUSD</option>
            <option value="GBPUSD">GBPUSD</option>
            <option value="NAS100">NAS100</option>
            <option value="ETHUSDT">ETHUSDT</option>
          </select>
        </div>

        {/* Daily Bias Picker */}
        <div className="terminal-card p-4 shadow-xs">
          <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider mb-2">
            Daily Bias
          </label>
          <div className="flex items-center space-x-2">
            {biases.map(b => (
              <button
                key={b}
                onClick={() => handleTextChange('bias', b)}
                className={`flex-1 py-2 text-xs font-bold font-mono-numeric rounded-lg border transition ${
                  journal.bias === b
                    ? b === 'Bullish'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50'
                      : b === 'Bearish'
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50'
                    : 'bg-[var(--bg-subpanel)] theme-text-secondary border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Market Analysis Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider border-b border-[var(--border-color)] pb-2">
          Technical Market Analysis
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Higher Timeframe Analysis */}
          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary flex items-center justify-between">
              <span>Higher Timeframe Analysis (Daily / 4H)</span>
            </label>
            <textarea
              rows={3}
              value={journal.htfAnalysis}
              onChange={e => handleTextChange('htfAnalysis', e.target.value)}
              placeholder="Describe daily/4H order flow, major supply/demand zones..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>

          {/* Market Structure */}
          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              Market Structure (1H / 15m)
            </label>
            <textarea
              rows={3}
              value={journal.marketStructure}
              onChange={e => handleTextChange('marketStructure', e.target.value)}
              placeholder="Structure shifts, higher highs, lower lows, FVGs..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>

          {/* Liquidity */}
          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              Liquidity Zones
            </label>
            <textarea
              rows={3}
              value={journal.liquidity}
              onChange={e => handleTextChange('liquidity', e.target.value)}
              placeholder="Equal highs/lows, Asian session high/low liquidity pools..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>

          {/* Key Levels */}
          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              Key Levels & Support / Resistance
            </label>
            <textarea
              rows={3}
              value={journal.keyLevels}
              onChange={e => handleTextChange('keyLevels', e.target.value)}
              placeholder="Key levels (e.g. 4,410 support, 4,455 resistance)..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>
        </div>
      </div>

      {/* Execution Plan & Review Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider border-b border-[var(--border-color)] pb-2">
          Execution Plan & Daily Review
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              Session Expectations
            </label>
            <textarea
              rows={3}
              value={journal.sessionExpectations}
              onChange={e => handleTextChange('sessionExpectations', e.target.value)}
              placeholder="What do you expect London & NY sessions to do?"
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>

          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              Trading Plan
            </label>
            <textarea
              rows={3}
              value={journal.tradingPlan}
              onChange={e => handleTextChange('tradingPlan', e.target.value)}
              placeholder="Specific entry criteria, risk rules, and execution conditions..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>

          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              What I Expected vs What Actually Happened
            </label>
            <textarea
              rows={3}
              value={journal.whatActuallyHappened}
              onChange={e => handleTextChange('whatActuallyHappened', e.target.value)}
              placeholder="Compare planned expectations with real session behavior..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>

          <div className="terminal-card p-4 space-y-2 shadow-xs">
            <label className="text-xs font-extrabold theme-text-primary">
              Mistakes & Lessons Learned
            </label>
            <textarea
              rows={3}
              value={journal.lessonsLearned}
              onChange={e => handleTextChange('lessonsLearned', e.target.value)}
              placeholder="Key psychological mistakes or trading takeaways..."
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-3 text-xs theme-text-primary outline-none focus:border-blue-500 resize-none font-sans font-medium"
            />
          </div>
        </div>
      </div>

      {/* Ratings & Screenshot Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Mood & Discipline Ratings */}
        <div className="lg:col-span-5 terminal-card p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider border-b border-[var(--border-color)] pb-2">
            Trader Psychology Ratings
          </h4>

          <div className="flex items-center justify-between text-xs font-bold">
            <span className="theme-text-primary">Mood / Focus Rating</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleTextChange('moodRating', star)}
                  className="p-1 hover:scale-110 transition cursor-pointer"
                >
                  <Star
                    size={18}
                    className={star <= journal.moodRating ? 'text-amber-500 fill-amber-500' : 'theme-text-muted'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <span className="theme-text-primary">Discipline & Rule Adherence</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleTextChange('disciplineRating', star)}
                  className="p-1 hover:scale-110 transition cursor-pointer"
                >
                  <Star
                    size={18}
                    className={star <= journal.disciplineRating ? 'text-blue-500 fill-blue-500' : 'theme-text-muted'}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Screenshot Upload & Gallery */}
        <div className="lg:col-span-7 terminal-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider flex items-center space-x-2">
              <ImageIcon size={15} className="text-blue-500" />
              <span>Chart Screenshots & Analysis Images ({journal.screenshots?.length || 0})</span>
            </h4>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-md shadow-xs transition flex items-center space-x-1"
            >
              <Upload size={13} />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 text-center transition cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                : 'border-[var(--border-color)] hover:border-blue-500/50 bg-[var(--bg-subpanel)]'
            }`}
          >
            <Upload size={24} className="mx-auto text-blue-500 mb-1.5 animate-bounce" />
            <span className="text-xs font-extrabold theme-text-primary block">
              Drag & drop chart screenshots here, or click to choose files
            </span>
            <span className="text-[10px] theme-text-secondary block mt-1 font-medium">
              Supports PNG, JPG, WebP images from TradingView or charts
            </span>
          </div>

          {/* URL Input Bar */}
          <div className="flex items-center space-x-2 font-mono-numeric text-xs">
            <div className="relative flex-1">
              <LinkIcon size={14} className="absolute left-3 top-2.5 theme-text-secondary" />
              <input
                type="url"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                placeholder="Or paste direct image URL (e.g. https://...)..."
                className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg pl-8 pr-3 py-1.5 theme-text-primary text-xs outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] theme-text-primary font-bold rounded-lg border border-[var(--border-color)] flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add URL</span>
            </button>
          </div>

          {/* Uploaded Screenshots Gallery */}
          {journal.screenshots && journal.screenshots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {journal.screenshots.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-subpanel)] aspect-video shadow-xs"
                >
                  <img
                    src={imgUrl}
                    alt={`Chart screenshot ${idx + 1}`}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setPreviewImage(imgUrl)}
                      className="p-1.5 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                      title="Enlarge Image"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 transition"
                      title="Remove Image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 text-white bg-slate-800 rounded-full hover:bg-slate-700 transition"
            >
              <X size={20} />
            </button>
            <img
              src={previewImage}
              alt="Enlarged Chart View"
              className="max-w-full max-h-[85vh] rounded-lg border border-slate-700 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
