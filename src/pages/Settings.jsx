import { useState, useEffect, useRef } from 'react';
import { exportAllData, importAllData, clearAllData, setSetting } from '../lib/db';
import { getLocation, setupLocation, clearLocation } from '../lib/prayerTimes';
import Footer from '../components/Footer';
import { Upload, Trash2, Info, Smartphone, Printer, Share2, HardDriveDownload, FileDown, MapPin, Check, ChevronDown } from 'lucide-react';

const THEMES = [
  { id: 'teal', label: 'Teal', primary: '#1A535C', secondary: '#1F6F7A', bg: '#FAF0E6', desc: 'Classic brand' },
  { id: 'slate', label: 'Slate', primary: '#334155', secondary: '#475569', bg: '#F8FAFC', desc: 'Cool & modern' },
  { id: 'rose', label: 'Rose', primary: '#9B4D6A', secondary: '#B5637F', bg: '#FDF2F6', desc: 'Soft & elegant' },
];

export default function Settings({ theme, onThemeChange }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [isStandalone] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
  const fileRef = useRef(null);

  useEffect(() => {
    getLocation().then((loc) => {
      if (loc) setLocation(loc);
      setLocationLoaded(true);
    });
  }, []);

  const handleEnableLocation = async () => {
    setLocationLoading(true);
    try {
      const loc = await setupLocation();
      setLocation(loc);
    } catch (err) {
      alert(err.message);
    }
    setLocationLoading(false);
  };

  const handleRemoveLocation = async () => {
    await clearLocation();
    setLocation(null);
  };

  const handleTheme = async (id) => {
    onThemeChange(id);
    await setSetting('theme', id);
  };

  const handleExportJson = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const handleImportJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      window.location.reload();
    } catch {
      alert('Invalid backup file. Please select a valid JSON backup.');
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleShare = async () => {
    const { shareProgress } = await import('../lib/shareProgress');
    await shareProgress();
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const { generatePdf } = await import('../lib/exportPdf');
      await generatePdf();
    } catch (err) {
      alert('Error generating PDF. Please try again.');
      console.error(err);
    }
    setPdfLoading(false);
  };

  const handleReset = async () => {
    await clearAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <div className="geo-pattern rounded-b-3xl px-5 py-9 text-center text-white" style={{ background: 'var(--primary)' }}>
        <p className="spaced-caps text-[var(--accent)] mb-1">Personalise</p>
        <h1 className="text-2xl font-extrabold">Settings</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Theme Selector */}
        <div className="card animate-fade-in-up">
          <div className="section-bar section-bar-primary">
            <span>✸</span> <span>THEME</span>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTheme(t.id)}
                  className="rounded-xl p-3 text-center transition-all hover:scale-[1.03]"
                  style={{
                    border: theme === t.id ? `3px solid ${t.primary}` : '2px solid #E2E8F0',
                    background: t.bg,
                  }}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: t.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: t.secondary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: '#C9A84C' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: t.primary }}>{t.label}</span>
                  {theme === t.id && <p className="text-[0.6rem] text-[var(--accent)] font-bold mt-1">Active</p>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Install PWA */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="section-bar section-bar-gold">
            <Smartphone size={16} /> <span>INSTALL APP</span>
          </div>
          <div className="card-body">
            {isStandalone ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
                  <Check size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>App installed</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  <strong>iPhone/iPad:</strong> Tap the Share button in Safari, then &ldquo;Add to Home Screen.&rdquo;
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
                  <strong>Android:</strong> Tap the menu (⋮) in Chrome, then &ldquo;Install app&rdquo; or &ldquo;Add to Home screen.&rdquo;
                </p>
              </>
            )}
          </div>
        </div>

        {/* Prayer Times */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="section-bar section-bar-gold">
            <MapPin size={16} /> <span>PRAYER TIMES</span>
          </div>
          <div className="card-body">
            {!locationLoaded ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              </div>
            ) : location ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <MapPin size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{location.city || 'Location set'}</p>
                    <p className="text-[0.65rem] text-[var(--muted)]">Prayer times shown on daily pages</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveLocation}
                  className="text-xs text-[var(--muted)] underline hover:text-red-500 transition-colors"
                >
                  Remove location
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[var(--body)] leading-relaxed mb-3">
                  Enable location to see prayer times next to your salah tracker.
                </p>
                <button
                  onClick={handleEnableLocation}
                  disabled={locationLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-60"
                  style={{ background: 'var(--primary)' }}
                >
                  {locationLoading ? 'Getting location...' : 'Enable Prayer Times'}
                </button>
                <p className="text-[0.6rem] text-[var(--muted)] mt-2 leading-relaxed text-center">
                  Prayer times may not be completely accurate. Please verify with your local masjid.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Downloads & Sharing — Collapsible */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <button
            onClick={() => setDownloadsOpen(!downloadsOpen)}
            className="section-bar section-bar-primary w-full justify-between cursor-pointer border-none text-left"
            type="button"
          >
            <div className="flex items-center gap-2">
              <span>●</span>
              <span>DOWNLOADS & SHARING</span>
            </div>
            <ChevronDown size={18} className="transition-transform duration-200" style={{ transform: downloadsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {downloadsOpen && (
            <div className="card-body space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Your Journey</p>
                <button onClick={handleDownloadPdf} disabled={pdfLoading} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 disabled:opacity-60" style={{ border: '1.5px solid #E2E8F0' }}>
                  <FileDown size={18} style={{ color: 'var(--primary)' }} />
                  <div className="text-left flex-1">
                    <span className="text-sm font-bold block">Export as PDF</span>
                    <span className="text-xs text-[var(--muted)]">Branded PDF export of your entire journey</span>
                  </div>
                  {pdfLoading && <span className="text-xs text-[var(--muted)] animate-pulse">Creating...</span>}
                </button>
                <button onClick={() => window.print()} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50" style={{ border: '1.5px solid #E2E8F0' }}>
                  <Printer size={18} style={{ color: 'var(--primary)' }} />
                  <div className="text-left">
                    <span className="text-sm font-bold block">Print This Page</span>
                    <span className="text-xs text-[var(--muted)]">Print or save as PDF using your browser</span>
                  </div>
                </button>
                <button onClick={handleShare} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50" style={{ border: '1.5px solid #E2E8F0' }}>
                  <Share2 size={18} style={{ color: 'var(--primary)' }} />
                  <div className="text-left">
                    <span className="text-sm font-bold block">Share Progress</span>
                    <span className="text-xs text-[var(--muted)]">Share a summary via WhatsApp, iMessage, or other apps</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Management — Collapsible */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => setDataOpen(!dataOpen)}
            className="section-bar section-bar-dark w-full justify-between cursor-pointer border-none text-left"
            type="button"
          >
            <div className="flex items-center gap-2">
              <span>●</span>
              <span>DATA MANAGEMENT</span>
            </div>
            <ChevronDown size={18} className="transition-transform duration-200" style={{ transform: dataOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {dataOpen && (
            <div className="card-body space-y-3">
              <button onClick={handleExportJson} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50" style={{ border: '1.5px solid #E2E8F0' }}>
                <HardDriveDownload size={18} style={{ color: 'var(--primary)' }} />
                <div className="text-left">
                  <span className="text-sm font-bold block">{exportDone ? 'Downloaded!' : 'Backup Data'}</span>
                  <span className="text-xs text-[var(--muted)]">Download a backup file to restore later</span>
                </div>
              </button>
              <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50" style={{ border: '1.5px solid #E2E8F0' }}>
                <Upload size={18} style={{ color: 'var(--primary)' }} />
                <div className="text-left">
                  <span className="text-sm font-bold block">{importing ? 'Importing...' : 'Restore Backup'}</span>
                  <span className="text-xs text-[var(--muted)]">Restore from a previously downloaded backup</span>
                </div>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
              <button onClick={() => setShowResetConfirm(true)} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-red-50" style={{ border: '1.5px solid #FCA5A5' }}>
                <Trash2 size={18} className="text-red-500" />
                <div className="text-left">
                  <span className="text-sm font-bold block text-red-600">Reset All Data</span>
                  <span className="text-xs text-[var(--muted)]">Clear all entries and start fresh</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* About */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="section-bar section-bar-dark">
            <Info size={16} /> <span>ABOUT</span>
          </div>
          <div className="card-body text-center">
            <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>Productivity Dashboard</p>
            <p className="text-xs text-[var(--muted)] mt-1">by GuidedBarakah</p>
            <p className="text-xs text-[var(--muted)] mt-1">www.guidedbarakah.com</p>
            <p className="text-[0.65rem] text-[var(--muted)] mt-2">&copy; GuidedBarakah 2026. All rights reserved.</p>
            <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed">
              All data stays on your device. No server, no sync, no cloud. Your privacy is protected.
            </p>
            <p className="text-xs text-[var(--muted)] mt-2">
              Need help? <a href="mailto:jay@guidedbarakah.com" className="underline" style={{ color: 'var(--accent)' }}>jay@guidedbarakah.com</a>
            </p>
          </div>
        </div>

        <Footer />
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-red-600 mb-2">Reset All Data?</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Are you sure? This will delete all your entries, habits, goals, and tracker data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-bold" style={{ border: '1.5px solid #E2E8F0' }}>
                Cancel
              </button>
              <button onClick={handleReset} className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-red-500">
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
