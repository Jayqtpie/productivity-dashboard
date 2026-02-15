import { useAutoSave } from '../hooks/useAutoSave';
import { getSectionVerse, getDefaultGoals } from '../lib/data';
import SectionBar from '../components/SectionBar';
import SavedToast from '../components/SavedToast';
import Footer from '../components/Footer';
import { Target, Globe, Star } from 'lucide-react';

const GOAL_ICONS = [
  { num: 1, color: 'var(--primary)' },
  { num: 2, color: 'var(--accent)' },
  { num: 3, color: 'var(--secondary)' },
];

export default function Goals() {
  const { data, update, loaded, showSaved } = useAutoSave(
    'goals', 'goals', getDefaultGoals
  );

  if (!loaded || !data) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 rounded-full border-[3px] border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const updateGoal = (index, field, value) => {
    const goals = [...data.goals];
    goals[index] = { ...goals[index], [field]: value };
    update({ goals });
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="geo-pattern py-9" style={{ background: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="spaced-caps text-center mb-1" style={{ color: 'var(--accent)' }}>Goals</p>
          <h1 className="text-xl font-extrabold text-white text-center mb-1">My 3 Goals</h1>
          <p className="text-center text-xs text-white/50 italic leading-relaxed max-w-xs mx-auto">
            {getSectionVerse('goals')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {data.goals.map((goal, i) => {
          const variant = i === 0 ? 'primary' : i === 1 ? 'gold' : 'secondary';
          return (
            <div
              key={i}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${0.05 + i * 0.08}s` }}
            >
              <SectionBar variant={variant} icon={<Target size={15} />}>
                Goal {i + 1}
              </SectionBar>
              <div className="card-body space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] mb-1 block">
                    What is your goal?
                  </label>
                  <textarea
                    value={goal.text}
                    onChange={(e) => updateGoal(i, 'text', e.target.value)}
                    placeholder="Describe your goal clearly..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                      <Globe size={12} style={{ color: 'var(--secondary)' }} />
                      <span style={{ color: 'var(--secondary)' }}>Dunya Reason</span>
                    </label>
                    <textarea
                      value={goal.dunya}
                      onChange={(e) => updateGoal(i, 'dunya', e.target.value)}
                      placeholder="How does this benefit your worldly life?"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                      <Star size={12} style={{ color: 'var(--accent)' }} />
                      <span style={{ color: 'var(--accent)' }}>Akhirah Reason</span>
                    </label>
                    <textarea
                      value={goal.akhirah}
                      onChange={(e) => updateGoal(i, 'akhirah', e.target.value)}
                      placeholder="How does this benefit your hereafter?"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <Footer />
      </div>

      <SavedToast show={showSaved} />
    </div>
  );
}
