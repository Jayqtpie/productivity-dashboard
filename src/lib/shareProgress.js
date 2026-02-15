import { exportAllData } from './db';
import { HABITS, DAYS_OF_WEEK } from './data';

export async function shareProgress() {
  const data = await exportAllData();

  const dailyCount = data.dailyPages?.length || 0;
  const habitsWeeks = data.habits?.length || 0;
  const goalsData = data.goals?.[0];
  const goalsSet = goalsData?.goals?.filter(g => g.text?.trim()).length || 0;

  // Total salah across all days
  let totalSalah = 0;
  (data.dailyPages || []).forEach((page) => {
    totalSalah += Object.values(page.salah || {}).filter(s => s.done).length;
  });

  // Average habits completion
  let totalHabitsDone = 0;
  let totalHabitsPossible = 0;
  (data.habits || []).forEach((week) => {
    HABITS.forEach((h) => {
      const hd = week.habits?.[h.id];
      if (hd) {
        DAYS_OF_WEEK.forEach((day) => {
          totalHabitsPossible++;
          if (hd[day]) totalHabitsDone++;
        });
      }
    });
  });
  const avgHabits = totalHabitsPossible > 0 ? Math.round((totalHabitsDone / totalHabitsPossible) * 100) : 0;

  const text = [
    'Productivity Dashboard',
    '—————————————',
    `Days tracked: ${dailyCount}`,
    `Total salah recorded: ${totalSalah}`,
    `Habit weeks tracked: ${habitsWeeks}`,
    `Average habit completion: ${avgHabits}%`,
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
}
