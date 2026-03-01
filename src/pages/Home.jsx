import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, getAllData } from '../lib/db';
import { getLocation, setupLocation } from '../lib/prayerTimes';
import {
  HABITS, DAYS_OF_WEEK, HADITHS, getSectionVerse,
  getToday, getMonday, formatDate, formatReadableDate
} from '../lib/data';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import {
  CalendarDays, CheckSquare, Target, Flame, BookOpen,
  ArrowRight, MapPin, ChevronDown
} from 'lucide-react';

function getDayIndex(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / (1000 * 60 * 60 * 24));
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const HOW_TO_STEPS = [
  { n: 1, title: 'Set Your Intention', desc: 'Start each day by writing your niyyah on the Daily page.' },
  { n: 2, title: 'Track Your Salah', desc: 'Log each prayer as on-time or late, and rate your khushu.' },
  { n: 3, title: 'Plan Your Time', desc: 'Use the time-block planner to structure your day around salah.' },
  { n: 4, title: 'Build Habits', desc: 'Track 10 Sunnah-inspired habits weekly on the Habits page.' },
  { n: 5, title: 'Set Goals', desc: 'Define 3 goals with both dunya and akhirah dimensions.' },
  { n: 6, title: 'Reflect Weekly', desc: 'Every week, review what went well and set next week\'s priorities.' },
];

export default function Home() {
  const navigate = useNavigate();
  const today = getToday();
  const todayReadable = formatReadableDate(today);
  const [stats, setStats] = useState(null);
  const [daysLogged, setDaysLogged] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [howToOpen, setHowToOpen] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const dayIndex = getDayIndex(today);
  const hadith = HADITHS[dayIndex % HADITHS.length];

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

  useEffect(() => {
    async function loadStats() {
      const dailyPage = await getData('dailyPages', today);
      const salahDone = dailyPage
        ? Object.values(dailyPage.salah).filter(s => s.done).length
        : 0;
      const hasNiyyah = !!dailyPage?.niyyah;

      const weekOf = formatDate(getMonday());
      const habitsData = await getData('habits', weekOf);
      let habitsDone = 0;
      const habitsTotal = HABITS.length * 7;
      if (habitsData?.habits) {
        HABITS.forEach((h) => {
          const habit = habitsData.habits[h.id];
          if (habit) {
            DAYS_OF_WEEK.forEach((day) => {
              if (habit[day]) habitsDone++;
            });
          }
        });
      }
      const habitsPct = habitsTotal > 0 ? Math.round((habitsDone / habitsTotal) * 100) : 0;

      let streak = 0;
      const allDaily = await getAllData('dailyPages');
      const logged = allDaily.filter((page) => {
        const hasSalah = Object.values(page.salah || {}).some(s => s.done);
        return page.niyyah || hasSalah || page.quran?.surah || page.muhasabahResponse;
      }).length;

      if (allDaily.length > 0) {
        const dates = allDaily.map(d => d.id).sort().reverse();
        const todayDate = new Date(today + 'T00:00:00');
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(todayDate);
          checkDate.setDate(checkDate.getDate() - i);
          const checkStr = formatDate(checkDate);
          if (dates.includes(checkStr)) {
            const page = allDaily.find(d => d.id === checkStr);
            const hasSalah = Object.values(page.salah || {}).some(s => s.done);
            const hasContent = page.niyyah || hasSalah || page.quran?.surah || page.muhasabahResponse;
            if (hasContent) {
              streak++;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      const goalsData = await getData('goals', 'goals');
      const goalsSet = goalsData
        ? goalsData.goals.filter(g => g.text.trim()).length
        : 0;

      const quranPages = dailyPage?.quran?.pages ? parseInt(dailyPage.quran.pages) || 0 : 0;

      setStats({ salahDone, hasNiyyah, habitsPct, habitsDone, streak, goalsSet, quranPages });
      setDaysLogged(logged);
      setHowToOpen(logged === 0);
      setDataLoaded(true);
    }
    loadStats();
  }, [today]);

  const isNewUser = dataLoaded && daysLogged === 0;
  const isEarlyUser = dataLoaded && daysLogged > 0 && daysLogged <= 3;

  return (
    <div className="animate-fade-in">
      {/* Hero Header — rounded bottom, logo below text */}
      <div className="geo-pattern rounded-b-3xl px-5 py-10 text-center text-white" style={{ background: 'var(--primary)' }}>
        <p className="spaced-caps mb-2" style={{ color: 'var(--accent)' }}>Productivity Dashboard</p>
        {isNewUser ? (
          <>
            <h1 className="text-3xl font-extrabold mb-1">Welcome</h1>
            <p className="text-white/70 text-sm">by GuidedBarakah</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-1">Assalamu Alaikum</h1>
            <p className="text-white/70 text-sm">{getTimeGreeting()} — {todayReadable}</p>
          </>
        )}
        <img src={logo} alt="GuidedBarakah" className="w-20 h-20 mx-auto mt-4 object-contain" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {!stats ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 rounded-full border-[3px] border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* Location Prompt — shown early (before content) */}
            {locationLoaded && !location && (
              <div className="card animate-fade-in-up">
                <div className="card-body text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <MapPin size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--primary)' }}>Auto-fill Prayer Times</p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                    Enable location to see prayer times next to your salah tracker on the daily page.
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
                    Prayer times are based on your general location and may not be completely accurate. Please verify with your local masjid.
                  </p>
                </div>
              </div>
            )}

            {/* Welcome Letter — only for new/early users */}
            {(isNewUser || isEarlyUser) && (
              <div className="animate-fade-in-up card card-body" style={{ animationDelay: '0.05s' }}>
                <p className="text-[var(--body)] leading-relaxed mb-4">
                  <span className="font-bold text-[var(--primary)]">Assalamu alaikum,</span>
                </p>
                <p className="text-sm leading-relaxed text-[var(--body)]">
                  If you're using this dashboard, it means you're serious about building a life of purpose and productivity. You're not just planning your days — you're planning to grow.
                </p>
                <p className="text-sm leading-relaxed text-[var(--body)] mt-3">
                  This dashboard was designed to give you structure without rigidity, accountability without guilt, and a system that works with your faith — not against it. Every page is built around the rhythms of your day: the five daily prayers that anchor your schedule, the habits that compound over time, and the reflections that keep you aligned with your purpose.
                </p>
              </div>
            )}

            {/* Progress indicator — returning users */}
            {!isNewUser && (
              <div className="animate-fade-in-up card card-body" style={{ animationDelay: '0.05s' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>Your Journey</span>
                  <span className="text-xs text-[var(--muted)]">{daysLogged} {daysLogged === 1 ? 'day' : 'days'} logged</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, Math.round((daysLogged / 30) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {/* How to Use — section bar style with icon */}
            <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={() => setHowToOpen(!howToOpen)}
                className="section-bar section-bar-primary w-full justify-between cursor-pointer border-none text-left"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span>✸</span>
                  <span>HOW TO USE THIS DASHBOARD</span>
                </div>
                <ChevronDown
                  size={18}
                  className="transition-transform duration-200"
                  style={{ transform: howToOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {howToOpen && (
                <div className="card-body space-y-3">
                  {HOW_TO_STEPS.map((step) => (
                    <div key={step.n} className="flex gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'var(--primary)' }}
                      >
                        {step.n}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[var(--body)]">{step.title}</span>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Returning User: Stats + Quick Actions */}
            {!isNewUser && (
              <>
                {/* Streak & Quick Stats */}
                <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <div className="card">
                    <div className="card-body text-center py-4">
                      <Flame size={22} className="mx-auto mb-1" style={{ color: 'var(--accent)' }} />
                      <p className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{stats.streak}</p>
                      <p className="text-[0.65rem] text-[var(--muted)] font-semibold uppercase tracking-wider">Day Streak</p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body text-center py-4">
                      <CalendarDays size={22} className="mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                      <p className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{stats.salahDone}/5</p>
                      <p className="text-[0.65rem] text-[var(--muted)] font-semibold uppercase tracking-wider">Salah Today</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
                  <div className="card">
                    <div className="card-body text-center py-3">
                      <CheckSquare size={18} className="mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
                      <p className="text-lg font-extrabold" style={{ color: 'var(--primary)' }}>{stats.habitsPct}%</p>
                      <p className="text-[0.6rem] text-[var(--muted)] font-semibold uppercase tracking-wider">Habits</p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body text-center py-3">
                      <BookOpen size={18} className="mx-auto mb-1" style={{ color: 'var(--olive-gold)' }} />
                      <p className="text-lg font-extrabold" style={{ color: 'var(--primary)' }}>{stats.quranPages}</p>
                      <p className="text-[0.6rem] text-[var(--muted)] font-semibold uppercase tracking-wider">Pages</p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body text-center py-3">
                      <Target size={18} className="mx-auto mb-1" style={{ color: 'var(--accent)' }} />
                      <p className="text-lg font-extrabold" style={{ color: 'var(--primary)' }}>{stats.goalsSet}/3</p>
                      <p className="text-[0.6rem] text-[var(--muted)] font-semibold uppercase tracking-wider">Goals</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2.5 animate-fade-in-up" style={{ animationDelay: '0.22s' }}>
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Quick Actions</h2>

                  <button
                    onClick={() => navigate(`/daily/${today}`)}
                    className="card w-full text-left transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="card-body flex items-center gap-3 py-3.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--primary)', color: '#fff' }}
                      >
                        <CalendarDays size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold">Today's Plan</h3>
                        <p className="text-xs text-[var(--muted)]">
                          {stats.hasNiyyah ? 'Continue your day' : 'Set your niyyah for today'}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--muted)]" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/habits')}
                    className="card w-full text-left transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="card-body flex items-center gap-3 py-3.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--secondary)', color: '#fff' }}
                      >
                        <CheckSquare size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold">Track Habits</h3>
                        <p className="text-xs text-[var(--muted)]">{stats.habitsPct}% this week</p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--muted)]" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/reflect/goals')}
                    className="card w-full text-left transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="card-body flex items-center gap-3 py-3.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--accent)', color: '#2D2D2D' }}
                      >
                        <Target size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold">My Goals</h3>
                        <p className="text-xs text-[var(--muted)]">{stats.goalsSet} of 3 goals set</p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--muted)]" />
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* Daily Hadith */}
            <div className="hadith-block animate-fade-in-up" style={{ animationDelay: '0.28s' }}>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--body)' }}>
                &ldquo;{hadith.text}&rdquo;
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                — {hadith.source}
              </p>
            </div>

            {/* Bismillah motivational line */}
            <p className="text-center text-[var(--accent)] font-bold text-lg animate-fade-in-up" style={{ animationDelay: '0.33s' }}>
              Let's begin. Bismillah.
            </p>

            {/* Bottom CTAs */}
            <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '0.36s' }}>
              {isNewUser ? (
                <>
                  <p className="text-xs text-center text-[var(--muted)] italic">
                    Start by setting your intention for today — everything flows from niyyah.
                  </p>
                  <button
                    onClick={() => navigate(`/daily/${today}`)}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    Start Today's Plan
                  </button>
                  <button
                    onClick={() => navigate('/reflect/goals')}
                    className="w-full py-3 rounded-xl font-bold text-sm border-2"
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)', background: 'transparent' }}
                  >
                    Set My Goals
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate(`/daily/${today}`)}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'var(--primary)' }}
                  >
                    Go to Today's Page
                  </button>
                </>
              )}
            </div>
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
