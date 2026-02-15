import { useState, useMemo, useCallback } from 'react';
import { useAutoSave } from '../hooks/useAutoSave';
import {
  HABITS, DAYS_OF_WEEK, DAY_LABELS, getSectionVerse,
  getDefaultHabits, getMonday, formatDate
} from '../lib/data';
import SectionBar from '../components/SectionBar';
import SavedToast from '../components/SavedToast';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, Trophy, CheckSquare } from 'lucide-react';

function getWeekOf(offset = 0) {
  const mon = getMonday();
  mon.setDate(mon.getDate() + offset * 7);
  return formatDate(mon);
}

function scoreClass(pct) {
  if (pct >= 80) return 'score-green';
  if (pct >= 60) return 'score-gold';
  return 'score-red';
}

function scoreBgClass(pct) {
  if (pct >= 80) return 'score-bg-green';
  if (pct >= 60) return 'score-bg-gold';
  return 'score-bg-red';
}

export default function Habits() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekOf = useMemo(() => getWeekOf(weekOffset), [weekOffset]);

  const { data, update, loaded, showSaved } = useAutoSave(
    'habits', weekOf, () => getDefaultHabits(weekOf)
  );

  const weekLabel = useMemo(() => {
    const d = new Date(weekOf + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [weekOf]);

  const todayDayIndex = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    return day === 0 ? 6 : day - 1;
  }, []);

  const isCurrentWeek = weekOffset === 0;

  // Compute scores
  const { totalDone, totalPossible, dailyScores, habitScores } = useMemo(() => {
    if (!data?.habits) return { totalDone: 0, totalPossible: 0, dailyScores: [], habitScores: [] };

    let totalDone = 0;
    const totalPossible = HABITS.length * 7;
    const dailyScores = DAYS_OF_WEEK.map(() => 0);
    const habitScores = [];

    HABITS.forEach((habit) => {
      const h = data.habits[habit.id];
      if (!h) return;
      let habitDone = 0;
      DAYS_OF_WEEK.forEach((day, di) => {
        if (h[day]) {
          totalDone++;
          dailyScores[di]++;
          habitDone++;
        }
      });
      habitScores.push(habitDone);
    });

    return { totalDone, totalPossible, dailyScores, habitScores };
  }, [data]);

  const overallPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  const toggleHabit = useCallback((habitId, day) => {
    update((prev) => ({
      ...prev,
      habits: {
        ...prev.habits,
        [habitId]: {
          ...prev.habits[habitId],
          [day]: !prev.habits[habitId][day],
        },
      },
    }));
  }, [update]);

  if (!loaded || !data) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 rounded-full border-[3px] border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Header */}
      <div className="geo-pattern py-9" style={{ background: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="spaced-caps text-center mb-1" style={{ color: 'var(--accent)' }}>Habit Tracker</p>
          <h1 className="text-xl font-extrabold text-white text-center mb-1">Weekly Habits</h1>
          <p className="text-center text-xs text-white/50 italic leading-relaxed max-w-xs mx-auto mb-5">
            {getSectionVerse('habits')}
          </p>

          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWeekOffset(o => o - 1)}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <p className="text-white text-sm font-bold">Week of {weekLabel}</p>
              {isCurrentWeek && (
                <p className="text-white/40 text-[0.65rem] font-semibold mt-0.5">Current Week</p>
              )}
            </div>
            <button
              onClick={() => setWeekOffset(o => o + 1)}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Weekly Scorecard */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <SectionBar variant="gold" icon={<Trophy size={15} />}>Weekly Scorecard</SectionBar>
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Overall Completion</span>
              <span className={`text-2xl font-extrabold ${scoreClass(overallPct)}`}>{overallPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${overallPct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[var(--muted)]">{totalDone} of {totalPossible} habits completed</span>
              <span className={`text-xs font-bold ${scoreClass(overallPct)}`}>
                {overallPct >= 80 ? 'Excellent!' : overallPct >= 60 ? 'Good progress' : 'Keep going!'}
              </span>
            </div>
          </div>
        </div>

        {/* Habit Grid */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
          <SectionBar variant="primary" icon={<CheckSquare size={15} />}>Sunnah Habits</SectionBar>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold text-[var(--muted)] py-2 pl-4 pr-2 w-[40%]">Habit</th>
                  {DAY_LABELS.map((label, i) => (
                    <th
                      key={label}
                      className="text-center text-[0.65rem] font-bold py-2 px-0.5"
                      style={{
                        color: isCurrentWeek && i === todayDayIndex ? 'var(--primary)' : 'var(--muted)',
                      }}
                    >
                      <span
                        className="inline-block px-1.5 py-0.5 rounded"
                        style={{
                          background: isCurrentWeek && i === todayDayIndex ? 'rgba(26,83,92,0.08)' : 'transparent',
                        }}
                      >
                        {label}
                      </span>
                    </th>
                  ))}
                  <th className="text-center text-[0.6rem] font-bold text-[var(--muted)] py-2 pr-3 pl-1 w-10">
                    <span className="opacity-60">#</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {HABITS.map((habit, hi) => {
                  const h = data.habits[habit.id] || {};
                  const habitDone = habitScores[hi] || 0;
                  const habitPct = Math.round((habitDone / 7) * 100);
                  return (
                    <tr
                      key={habit.id}
                      className="border-t border-[#F1F5F9] animate-fade-in-up"
                      style={{ animationDelay: `${0.15 + hi * 0.03}s` }}
                    >
                      <td className="text-xs font-medium py-2.5 pl-4 pr-2 leading-tight">{habit.label}</td>
                      {DAYS_OF_WEEK.map((day, di) => (
                        <td key={day} className="text-center py-2.5 px-0.5">
                          <input
                            type="checkbox"
                            className="habit-check"
                            checked={!!h[day]}
                            onChange={() => toggleHabit(habit.id, day)}
                            aria-label={`${habit.label} ${DAY_LABELS[di]}`}
                            style={
                              isCurrentWeek && di === todayDayIndex
                                ? { borderColor: !h[day] ? 'var(--accent)' : undefined }
                                : undefined
                            }
                          />
                        </td>
                      ))}
                      <td className="text-center py-2.5 pr-3 pl-1">
                        <span
                          className={`text-[0.65rem] font-extrabold inline-block min-w-[1.8rem] py-0.5 rounded ${scoreClass(habitPct)} ${scoreBgClass(habitPct)}`}
                        >
                          {habitDone}/7
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#E2E8F0]">
                  <td className="text-xs font-bold py-2.5 pl-4 pr-2" style={{ color: 'var(--primary)' }}>Daily Total</td>
                  {dailyScores.map((score, i) => {
                    const pct = Math.round((score / HABITS.length) * 100);
                    return (
                      <td key={i} className="text-center py-2.5 px-0.5">
                        <span
                          className={`text-[0.65rem] font-extrabold inline-block min-w-[1.8rem] py-0.5 rounded ${scoreClass(pct)} ${scoreBgClass(pct)}`}
                        >
                          {score}/{HABITS.length}
                        </span>
                      </td>
                    );
                  })}
                  <td className="text-center py-2.5 pr-3 pl-1">
                    <span
                      className={`text-[0.65rem] font-extrabold inline-block min-w-[1.8rem] py-0.5 rounded ${scoreClass(overallPct)} ${scoreBgClass(overallPct)}`}
                    >
                      {totalDone}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <Footer />
      </div>

      <SavedToast show={showSaved} />
    </div>
  );
}
