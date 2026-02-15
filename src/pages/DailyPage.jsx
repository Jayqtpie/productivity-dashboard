import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPrayerTimesForDate } from '../lib/prayerTimes';
import { useAutoSave } from '../hooks/useAutoSave';
import {
  SALAH_BLOCKS, MUHASABAH, MUHASABAH_QUESTIONS, HADITHS,
  getSectionVerse, getDefaultDailyPage, getToday, formatDate, getMonday
} from '../lib/data';
import SectionBar from '../components/SectionBar';
import StarRating from '../components/StarRating';
import SavedToast from '../components/SavedToast';
import Footer from '../components/Footer';
import {
  Sun, Clock, BookOpen, Heart, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, AlarmClock
} from 'lucide-react';

const TIME_RANGES = [
  { id: 'fajr', label: 'Fajr — Dhuhr', icon: '🌅' },
  { id: 'dhuhr', label: 'Dhuhr — Asr', icon: '☀️' },
  { id: 'asr', label: 'Asr — Maghrib', icon: '🌤️' },
  { id: 'maghrib', label: 'Maghrib — Isha', icon: '🌅' },
  { id: 'isha', label: 'Isha — Sleep', icon: '🌙' },
];

function formatTime12h(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function getDayIndex(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getWeekDates(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const monday = getMonday(d);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    dates.push(formatDate(day));
  }
  return dates;
}

function shiftWeek(dateStr, direction) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + direction * 7);
  return formatDate(d);
}

export default function DailyPage() {
  const { date: paramDate } = useParams();
  const navigate = useNavigate();
  const today = getToday();
  const currentDate = paramDate || today;

  const { data, update, loaded, showSaved } = useAutoSave(
    'dailyPages', currentDate, () => getDefaultDailyPage(currentDate)
  );

  const [prayerTimes, setPrayerTimes] = useState(null);

  useEffect(() => {
    if (loaded && currentDate) {
      getPrayerTimesForDate(currentDate).then(setPrayerTimes);
    }
  }, [loaded, currentDate]);

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const dayIndex = useMemo(() => getDayIndex(currentDate), [currentDate]);
  const hadith = HADITHS[dayIndex % HADITHS.length];
  const muhasabahPrompt = MUHASABAH[dayIndex % MUHASABAH.length];

  const salahDone = data ? Object.values(data.salah).filter(s => s.done).length : 0;
  const isToday = currentDate === today;

  const goToDate = (d) => navigate(`/daily/${d}`, { replace: true });
  const goWeek = (dir) => goToDate(shiftWeek(currentDate, dir));

  if (!loaded || !data) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 rounded-full border-[3px] border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const readableDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div>
      {/* Hero Header */}
      <div className="geo-pattern pt-10 pb-6" style={{ background: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="spaced-caps text-center mb-1" style={{ color: 'var(--accent)' }}>Daily Planner</p>
          <h1 className="text-xl font-extrabold text-white text-center mb-1">{readableDate}</h1>
          {isToday && (
            <p className="text-center text-xs font-semibold tracking-wide text-white/60 mb-3">Today</p>
          )}
          <p className="text-center text-xs text-white/50 italic leading-relaxed max-w-xs mx-auto">
            {getSectionVerse('daily')}
          </p>

          {/* Date Navigation Strip */}
          <div className="flex items-center gap-1 mt-5">
            <button
              onClick={() => goWeek(-1)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 flex justify-between gap-0.5">
              {weekDates.map((d) => {
                const dayObj = new Date(d + 'T00:00:00');
                const dayLabel = dayObj.toLocaleDateString('en-GB', { weekday: 'narrow' });
                const dayNum = dayObj.getDate();
                const isActive = d === currentDate;
                const isTodayDate = d === today;
                return (
                  <button
                    key={d}
                    onClick={() => goToDate(d)}
                    className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    <span className="text-[0.6rem] font-bold uppercase">{dayLabel}</span>
                    <span className="text-sm font-extrabold leading-none">{dayNum}</span>
                    {isTodayDate && (
                      <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: 'var(--accent)' }} />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => goWeek(1)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Salah Progress Mini Bar */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>Salah Progress</span>
            <span className="text-xs font-extrabold" style={{ color: 'var(--accent)' }}>{salahDone}/5</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${(salahDone / 5) * 100}%` }} />
          </div>
        </div>

        {/* Niyyah */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SectionBar variant="gold" icon={<Sun size={15} />}>Today's Intention (Niyyah)</SectionBar>
          <div className="card-body">
            <textarea
              value={data.niyyah}
              onChange={(e) => update({ niyyah: e.target.value })}
              placeholder="What is your primary intention for today?"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        {/* Salah Tracker */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <SectionBar variant="primary" icon={<AlarmClock size={15} />}>Salah Tracker</SectionBar>
          <div className="card-body space-y-3">
            {SALAH_BLOCKS.map((salah) => {
              const s = data.salah[salah.id];
              const timeStr = prayerTimes ? formatTime12h(prayerTimes[salah.id]) : '';
              return (
                <div key={salah.id} className="flex items-center justify-between">
                  <span className="text-sm font-semibold min-w-[4.5rem]">
                    {salah.label}
                    {timeStr && (
                      <span className="ml-1.5 text-xs font-medium" style={{ color: 'var(--accent)' }}>{timeStr}</span>
                    )}
                  </span>
                  <div className="on-time-toggle">
                    <button
                      type="button"
                      className={s.done && s.onTime === true ? 'yes' : ''}
                      onClick={() => update({
                        salah: { ...data.salah, [salah.id]: { done: true, onTime: true } }
                      })}
                    >
                      On time
                    </button>
                    <button
                      type="button"
                      className={s.done && s.onTime === false ? 'no' : ''}
                      onClick={() => update({
                        salah: { ...data.salah, [salah.id]: { done: true, onTime: false } }
                      })}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      className={!s.done ? '' : ''}
                      style={!s.done && s.onTime === null ? {} : (s.done ? {} : { borderColor: '#CBD5E1', color: 'var(--muted)' })}
                      onClick={() => update({
                        salah: { ...data.salah, [salah.id]: { done: false, onTime: null } }
                      })}
                    >
                      {s.done ? (
                        <CheckCircle2 size={12} className="inline" />
                      ) : (
                        <XCircle size={12} className="inline opacity-40" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <StarRating
                value={data.khushu}
                onChange={(v) => update({ khushu: v })}
                label="Khushu Rating"
              />
            </div>
          </div>
        </div>

        {/* Time-Block Planner */}
        {TIME_RANGES.map((block, i) => (
          <div
            key={block.id}
            className="card animate-fade-in-up"
            style={{ animationDelay: `${0.2 + i * 0.04}s` }}
          >
            <SectionBar variant="secondary" icon={<Clock size={14} />}>
              <span className="mr-1">{block.icon}</span> {block.label}
            </SectionBar>
            <div className="card-body">
              <textarea
                value={data.timeBlocks[block.id].tasks}
                onChange={(e) => update({
                  timeBlocks: {
                    ...data.timeBlocks,
                    [block.id]: { ...data.timeBlocks[block.id], tasks: e.target.value }
                  }
                })}
                placeholder={`What will you focus on during ${block.label.toLowerCase()}?`}
                rows={2}
                className="text-sm"
              />
            </div>
          </div>
        ))}

        {/* Quran Log */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
          <SectionBar variant="olive" icon={<BookOpen size={15} />}>Quran Log</SectionBar>
          <div className="card-body space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] mb-1 block">Surah</label>
                <input
                  type="text"
                  value={data.quran.surah}
                  onChange={(e) => update({ quran: { ...data.quran, surah: e.target.value } })}
                  placeholder="e.g. Al-Baqarah"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] mb-1 block">Pages Read</label>
                <input
                  type="number"
                  value={data.quran.pages}
                  onChange={(e) => update({ quran: { ...data.quran, pages: e.target.value } })}
                  placeholder="0"
                  min="0"
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted)] mb-1 block">Notes / Reflections</label>
              <textarea
                value={data.quran.notes}
                onChange={(e) => update({ quran: { ...data.quran, notes: e.target.value } })}
                placeholder="Any ayah that stood out, tafsir notes..."
                rows={2}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Muhasabah */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <SectionBar variant="gold" icon={<Heart size={15} />}>Nightly Muhasabah</SectionBar>
          <div className="card-body space-y-3">
            <p className="text-xs text-[var(--muted)] font-medium mb-2">Quick self-check:</p>
            {MUHASABAH_QUESTIONS.map((q, i) => (
              <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="custom-check mt-0.5"
                  checked={data.muhasabahAnswers[i] || false}
                  onChange={() => {
                    const answers = [...data.muhasabahAnswers];
                    answers[i] = !answers[i];
                    update({ muhasabahAnswers: answers });
                  }}
                />
                <span className="text-sm leading-snug">{q}</span>
              </label>
            ))}

            <div className="pt-3 border-t border-[#E2E8F0]">
              <div className="hadith-block mb-3">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--body)' }}>
                  {muhasabahPrompt}
                </p>
              </div>
              <textarea
                value={data.muhasabahResponse}
                onChange={(e) => update({ muhasabahResponse: e.target.value })}
                placeholder="Your reflection..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Daily Hadith */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
          <div className="hadith-block">
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--body)' }}>
              &ldquo;{hadith.text}&rdquo;
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              — {hadith.source}
            </p>
          </div>
        </div>

        <Footer />
      </div>

      <SavedToast show={showSaved} />
    </div>
  );
}
