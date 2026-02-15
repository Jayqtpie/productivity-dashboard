import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAutoSave } from '../hooks/useAutoSave';
import { getDefaultWeeklyReview, getMonday, formatDate } from '../lib/data';
import SectionBar from '../components/SectionBar';
import SavedToast from '../components/SavedToast';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, ThumbsUp, TrendingUp, ListChecks, HandHeart, BookHeart, Lightbulb } from 'lucide-react';

function shiftWeek(weekOf, direction) {
  const d = new Date(weekOf + 'T00:00:00');
  d.setDate(d.getDate() + direction * 7);
  const mon = getMonday(d);
  return formatDate(mon);
}

export default function WeeklyReview() {
  const { weekOf: paramWeekOf } = useParams();
  const [currentWeekOf, setCurrentWeekOf] = useState(
    paramWeekOf || formatDate(getMonday())
  );

  const { data, update, loaded, showSaved } = useAutoSave(
    'weeklyReviews', currentWeekOf, () => getDefaultWeeklyReview(currentWeekOf)
  );

  const weekLabel = useMemo(() => {
    const d = new Date(currentWeekOf + 'T00:00:00');
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    const fmt = (dt) => dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `${fmt(d)} — ${fmt(end)}`;
  }, [currentWeekOf]);

  const isCurrentWeek = currentWeekOf === formatDate(getMonday());

  const goWeek = (dir) => setCurrentWeekOf(shiftWeek(currentWeekOf, dir));

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
          <p className="spaced-caps text-center mb-1" style={{ color: 'var(--accent)' }}>Jumu'ah Review</p>
          <h1 className="text-xl font-extrabold text-white text-center mb-1">Weekly Reflection</h1>
          {isCurrentWeek && (
            <p className="text-center text-xs font-semibold tracking-wide text-white/60 mb-3">This Week</p>
          )}

          {/* Week Navigation */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => goWeek(-1)}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} />
            </button>
            <p className="text-white text-sm font-bold">{weekLabel}</p>
            <button
              onClick={() => goWeek(1)}
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

        {/* What Went Well */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <SectionBar variant="primary" icon={<ThumbsUp size={15} />}>What Went Well</SectionBar>
          <div className="card-body">
            <textarea
              value={data.wentWell}
              onChange={(e) => update({ wentWell: e.target.value })}
              placeholder="What were your wins this week? What are you proud of?"
              rows={3}
              className="text-sm"
            />
          </div>
        </div>

        {/* What to Improve */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SectionBar variant="secondary" icon={<TrendingUp size={15} />}>What to Improve</SectionBar>
          <div className="card-body">
            <textarea
              value={data.improve}
              onChange={(e) => update({ improve: e.target.value })}
              placeholder="What could you do better next week?"
              rows={3}
              className="text-sm"
            />
          </div>
        </div>

        {/* Top 3 Priorities */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <SectionBar variant="gold" icon={<ListChecks size={15} />}>Next Week's Priorities</SectionBar>
          <div className="card-body space-y-2.5">
            {data.priorities.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                  style={{ background: 'var(--accent)', color: '#2D2D2D' }}
                >
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const priorities = [...data.priorities];
                    priorities[i] = e.target.value;
                    update({ priorities });
                  }}
                  placeholder={`Priority ${i + 1}`}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gratitude */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SectionBar variant="olive" icon={<HandHeart size={15} />}>Gratitude</SectionBar>
          <div className="card-body">
            <textarea
              value={data.gratitude}
              onChange={(e) => update({ gratitude: e.target.value })}
              placeholder="What are you grateful to Allah for this week?"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        {/* Lesson Learned */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <SectionBar variant="dark" icon={<Lightbulb size={15} />}>Lesson Learned</SectionBar>
          <div className="card-body">
            <textarea
              value={data.lessonLearned}
              onChange={(e) => update({ lessonLearned: e.target.value })}
              placeholder="What's one key lesson from this week?"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        {/* Dua */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <SectionBar variant="gold" icon={<BookHeart size={15} />}>Weekly Dua</SectionBar>
          <div className="card-body">
            <textarea
              value={data.dua}
              onChange={(e) => update({ dua: e.target.value })}
              placeholder="What dua will you make a focus this week?"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <Footer />
      </div>

      <SavedToast show={showSaved} />
    </div>
  );
}
