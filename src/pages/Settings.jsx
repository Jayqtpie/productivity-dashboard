import { useState, useEffect, useRef } from 'react';
import { exportAllData, importAllData, clearAllData, setSetting } from '../lib/db';
import { getLocation, setupLocation, clearLocation } from '../lib/prayerTimes';
import SectionBar from '../components/SectionBar';
import Footer from '../components/Footer';
import { Palette, Download, Upload, Trash2, Share2, Printer, Info, Smartphone, MapPin } from 'lucide-react';

const THEMES = [
  { id: 'teal', label: 'Teal', primary: '#1A535C', bg: '#FAF0E6', desc: 'Classic brand' },
  { id: 'slate', label: 'Slate', primary: '#334155', bg: '#F8FAFC', desc: 'Cool & modern' },
  { id: 'rose', label: 'Rose', primary: '#9B4D6A', bg: '#FDF2F6', desc: 'Soft & elegant' },
];

export default function Settings({ theme, onThemeChange }) {
  const [showReset, setShowReset] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
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
    const data = await exportAllData();
    const dailyCount = data.dailyPages?.length || 0;
    const habitsWeeks = data.habits?.length || 0;
    const goalsData = data.goals?.[0];
    const goalsSet = goalsData?.goals?.filter(g => g.text?.trim()).length || 0;

    const text = [
      'Productivity Dashboard — Progress',
      `Daily entries: ${dailyCount}`,
      `Habit weeks tracked: ${habitsWeeks}`,
      `Goals set: ${goalsSet}/3`,
      '',
      'Powered by GuidedBarakah',
    ].join('\n');

    if (navigator.share) {
      await navigator.share({ title: 'My Productivity Progress', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Progress summary copied to clipboard!');
    }
  };

  const handleReset = async () => {
    await clearAllData();
    window.location.reload();
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="geo-pattern py-9" style={{ background: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="spaced-caps text-center mb-1" style={{ color: 'var(--accent)' }}>Settings</p>
          <h1 className="text-xl font-extrabold text-white text-center">Preferences</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Theme Selector */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <SectionBar variant="primary" icon={<Palette size={15} />}>Theme</SectionBar>
          <div className="card-body">
            <div className="grid grid-cols-3 gap-2.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTheme(t.id)}
                  className="rounded-xl p-3 text-center transition-all border-2"
                  style={{
                    borderColor: theme === t.id ? t.primary : '#E2E8F0',
                    background: theme === t.id ? `${t.primary}08` : 'transparent',
                  }}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    <span className="w-5 h-5 rounded-full" style={{ background: t.primary }} />
                    <span className="w-5 h-5 rounded-full" style={{ background: '#C9A84C' }} />
                    <span className="w-5 h-5 rounded-full border border-[#E2E8F0]" style={{ background: t.bg }} />
                  </div>
                  <p className="text-xs font-bold" style={{ color: theme === t.id ? t.primary : 'var(--body)' }}>{t.label}</p>
                  <p className="text-[0.6rem] text-[var(--muted)]">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prayer Times */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SectionBar variant="gold" icon={<MapPin size={15} />}>Prayer Times</SectionBar>
          <div className="card-body">
            {!locationLoaded ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              </div>
            ) : location ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                    {location.city || 'Location enabled'}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Prayer times shown on daily pages</p>
                </div>
                <button
                  onClick={handleRemoveLocation}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                  Enable location to see prayer times next to your salah tracker.
                </p>
                <button
                  onClick={handleEnableLocation}
                  disabled={locationLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-60"
                  style={{ background: 'var(--accent)' }}
                >
                  {locationLoading ? 'Getting location...' : 'Enable Prayer Times'}
                </button>
                <p className="text-[0.6rem] text-[var(--muted)] mt-2 leading-relaxed">
                  Prayer times may not be completely accurate. Please verify with your local masjid.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Export & Backup */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <SectionBar variant="gold" icon={<Download size={15} />}>Export & Backup</SectionBar>
          <div className="card-body space-y-2.5">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--bg)] transition-colors text-left"
            >
              <Printer size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <p className="text-sm font-semibold">Print This Page</p>
                <p className="text-xs text-[var(--muted)]">Print current view with browser print</p>
              </div>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--bg)] transition-colors text-left"
            >
              <Share2 size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <p className="text-sm font-semibold">Share Progress</p>
                <p className="text-xs text-[var(--muted)]">Share a summary of your stats</p>
              </div>
            </button>

            <div className="border-t border-[#E2E8F0] pt-2.5">
              <button
                onClick={handleExportJson}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--bg)] transition-colors text-left"
              >
                <Download size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="text-sm font-semibold">
                    {exportDone ? 'Downloaded!' : 'Backup Data (JSON)'}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Download all your data as a file</p>
                </div>
              </button>

              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--bg)] transition-colors text-left"
              >
                <Upload size={18} style={{ color: 'var(--olive-gold)' }} />
                <div>
                  <p className="text-sm font-semibold">
                    {importing ? 'Importing...' : 'Restore from Backup'}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Import a previously exported backup</p>
                </div>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Install PWA */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SectionBar variant="gold" icon={<Smartphone size={15} />}>Install App</SectionBar>
          <div className="card-body">
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              <strong>iPhone/iPad:</strong> Tap the Share button in Safari, then &ldquo;Add to Home Screen.&rdquo;
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
              <strong>Android:</strong> Tap the menu (&vellip;) in Chrome, then &ldquo;Install app&rdquo; or &ldquo;Add to Home screen.&rdquo;
            </p>
          </div>
        </div>

        {/* About */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SectionBar variant="dark" icon={<Info size={15} />}>About</SectionBar>
          <div className="card-body text-center">
            <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>Productivity Dashboard</p>
            <p className="text-xs text-[var(--muted)] mt-1">by GuidedBarakah</p>
            <p className="text-xs text-[var(--muted)] mt-1">www.guidedbarakah.com</p>
            <p className="text-[0.65rem] text-[var(--muted)] mt-2">&copy; GuidedBarakah 2026. All rights reserved.</p>
            <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed">
              All data stays on your device. No server, no sync, no cloud. Your privacy is protected.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <SectionBar variant="dark" icon={<Trash2 size={15} />}>Reset</SectionBar>
          <div className="card-body">
            {!showReset ? (
              <button
                onClick={() => setShowReset(true)}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-red-500 border-2 border-red-200 hover:bg-red-50 transition-colors"
              >
                Reset All Data
              </button>
            ) : (
              <div className="space-y-2.5">
                <p className="text-sm text-red-600 font-medium text-center">
                  This will permanently delete all your data. Are you sure?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReset(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-[#E2E8F0] hover:bg-[var(--bg)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
