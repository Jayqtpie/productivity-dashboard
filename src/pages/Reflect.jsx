import { useNavigate } from 'react-router-dom';
import { getSectionVerse, getMonday, formatDate } from '../lib/data';
import Footer from '../components/Footer';
import { Target, CalendarCheck, Heart } from 'lucide-react';

export default function Reflect() {
  const navigate = useNavigate();
  const currentWeekOf = formatDate(getMonday());

  const cards = [
    {
      icon: Target,
      title: 'My Goals',
      desc: '3 goals with dunya and akhirah intentions',
      path: '/reflect/goals',
      color: 'var(--accent)',
    },
    {
      icon: CalendarCheck,
      title: 'Weekly Review',
      desc: 'Reflect on your week every Jumu\'ah',
      path: `/reflect/weekly/${currentWeekOf}`,
      color: 'var(--primary)',
    },
  ];

  return (
    <div>
      {/* Hero Header */}
      <div className="geo-pattern py-9" style={{ background: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="spaced-caps text-center mb-1" style={{ color: 'var(--accent)' }}>Reflect</p>
          <h1 className="text-xl font-extrabold text-white text-center mb-1">Self-Reflection</h1>
          <p className="text-center text-xs text-white/50 italic leading-relaxed max-w-xs mx-auto">
            {getSectionVerse('reflect')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {cards.map((card, i) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="card w-full text-left animate-fade-in-up transition-all hover:shadow-md active:scale-[0.98]"
            style={{ animationDelay: `${0.05 + i * 0.08}s` }}
          >
            <div className="card-body flex items-center gap-4 py-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.color}15`, color: card.color }}
              >
                <card.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold mb-0.5">{card.title}</h3>
                <p className="text-xs text-[var(--muted)]">{card.desc}</p>
              </div>
              <div className="text-[var(--muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </button>
        ))}

        {/* Motivational Note */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="hadith-block">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--body)' }}>
              <Heart size={14} className="inline mr-1.5 -mt-0.5" style={{ color: 'var(--accent)' }} />
              Taking time to reflect is a sign of a mindful believer. The Prophet &#xFDFA; would regularly reflect in solitude, and this practice of muhasabah helps us grow closer to Allah.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
