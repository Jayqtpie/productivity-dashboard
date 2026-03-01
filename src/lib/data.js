// 11 Sunnah-inspired habits for the weekly grid
// Ordered: salah → Quran/dhikr → weekly worship → character → lifestyle
export const HABITS = [
  { id: 'fajr', label: 'Pray Fajr on time' },
  { id: 'tahajjud', label: 'Pray Tahajjud' },
  { id: 'quran', label: 'Read Quran daily' },
  { id: 'adhkar', label: 'Morning & evening adhkar' },
  { id: 'dhikr', label: 'Dhikr after salah' },
  { id: 'dua', label: 'Make dua before sleep' },
  { id: 'fasting', label: 'Voluntary fasting (Mon/Thu)' },
  { id: 'charity', label: 'Give sadaqah' },
  { id: 'kindness', label: 'Act of kindness' },
  { id: 'knowledge', label: 'Seek Islamic knowledge' },
  { id: 'sleep', label: 'Sleep early, wake for Fajr' },
];

export const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 5 salah time blocks
export const SALAH_BLOCKS = [
  { id: 'fajr', label: 'Fajr', time: '5:30 AM' },
  { id: 'dhuhr', label: 'Dhuhr', time: '1:00 PM' },
  { id: 'asr', label: 'Asr', time: '4:30 PM' },
  { id: 'maghrib', label: 'Maghrib', time: '6:30 PM' },
  { id: 'isha', label: 'Isha', time: '8:00 PM' },
];

// 30 rotating muhasabah (self-reflection) prompts
export const MUHASABAH = [
  'Did I pray all five salah on time today?',
  'What did I do today that was solely for the sake of Allah?',
  'Did I control my tongue from backbiting and idle talk?',
  'Was I patient when something difficult happened?',
  'Did I remember Allah during my daily activities?',
  'Did I treat my family with gentleness and kindness?',
  'Was there a moment today I felt closest to Allah?',
  'Did I waste time on things that won\'t benefit me in the Akhirah?',
  'Did I make dua for others today?',
  'Am I holding any grudge or ill-feeling towards someone?',
  'Did I learn something new about my Deen today?',
  'Did I act with honesty and integrity in all my dealings?',
  'How did I manage my anger today?',
  'Did I lower my gaze and guard my senses?',
  'Was I grateful for the blessings I have?',
  'Did I help someone in need today?',
  'Did I reflect on death and the Akhirah?',
  'Am I closer to my goals or further away after today?',
  'Did I eat halal and consume only what is pure?',
  'Was my worship sincere, or was there showing off?',
  'Did I make istighfar (seek forgiveness) today?',
  'Did I uphold my trusts and promises?',
  'How can I improve tomorrow compared to today?',
  'Did I spend my money wisely and avoid extravagance?',
  'Did I check on a friend, neighbour, or relative today?',
  'Was I mindful of my screen time and digital consumption?',
  'Did I go to sleep in a state of wudu?',
  'What is the one thing I\'m most grateful for today?',
  'Did I set a clear niyyah (intention) for my day?',
  'If today was my last day, would I be satisfied with how I lived?',
];

// 5 daily muhasabah questions (quick check)
export const MUHASABAH_QUESTIONS = [
  'Did I pray all salah on time?',
  'Did I read Quran today?',
  'Did I do any act of sadaqah?',
  'Did I control my tongue?',
  'Did I remember my akhirah goals?',
];

// 30 rotating hadiths for daily motivation
export const HADITHS = [
  { text: 'The best of you are those who learn the Quran and teach it.', source: 'Sahih al-Bukhari 5027' },
  { text: 'Actions are judged by intentions, and each person will be rewarded according to their intention.', source: 'Sahih al-Bukhari 1' },
  { text: 'The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.', source: 'Sahih al-Bukhari 6114' },
  { text: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', source: 'Sahih al-Bukhari 6018' },
  { text: 'None of you truly believes until he loves for his brother what he loves for himself.', source: 'Sahih al-Bukhari 13' },
  { text: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.', source: 'Sahih al-Bukhari 6464' },
  { text: 'Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.', source: 'Sahih Muslim 2699' },
  { text: 'Do not belittle any good deed, even meeting your brother with a cheerful face.', source: 'Sahih Muslim 2626' },
  { text: 'When a person dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.', source: 'Sahih Muslim 1631' },
  { text: 'Allah does not look at your appearance or wealth, but rather He looks at your hearts and actions.', source: 'Sahih Muslim 2564' },
  { text: 'The best among you are those who have the best character.', source: 'Sahih al-Bukhari 3559' },
  { text: 'Make things easy and do not make things difficult. Give glad tidings and do not push people away.', source: 'Sahih al-Bukhari 69' },
  { text: 'A Muslim is the one from whose tongue and hand other Muslims are safe.', source: 'Sahih al-Bukhari 10' },
  { text: 'Charity does not decrease wealth. No one forgives another except that Allah increases his honour.', source: 'Sahih Muslim 2588' },
  { text: 'Be in this world as if you were a stranger or a traveller along a path.', source: 'Sahih al-Bukhari 6416' },
  { text: 'The supplication (dua) is worship.', source: 'Sunan Abu Dawud 1479' },
  { text: 'Take advantage of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before work, and your life before death.', source: 'Shu\'ab al-Iman 9767' },
  { text: 'Whoever is not grateful to people is not grateful to Allah.', source: 'Sunan Abu Dawud 4811' },
  { text: 'The believer is not stung from the same hole twice.', source: 'Sahih al-Bukhari 6133' },
  { text: 'Verily, with hardship comes ease.', source: 'Quran 94:6' },
  { text: 'The best of provision is taqwa (God-consciousness).', source: 'Quran 2:197' },
  { text: 'Cleanliness is half of faith.', source: 'Sahih Muslim 223' },
  { text: 'Whoever humbles himself for the sake of Allah, Allah will raise him.', source: 'Sahih Muslim 2588' },
  { text: 'A good word is charity.', source: 'Sahih al-Bukhari 2989' },
  { text: 'The one who looks after a widow or a poor person is like a mujahid who fights for Allah\'s cause.', source: 'Sahih al-Bukhari 5353' },
  { text: 'Exchange gifts and you will love one another.', source: 'Al-Adab al-Mufrad 594' },
  { text: 'Your body has a right over you, your eyes have a right over you, and your wife has a right over you.', source: 'Sahih al-Bukhari 5199' },
  { text: 'The most beloved of places to Allah are the mosques, and the most hated of places to Allah are the marketplaces.', source: 'Sahih Muslim 671' },
  { text: 'Modesty brings nothing but good.', source: 'Sahih al-Bukhari 6117' },
  { text: 'He who does not thank people does not thank Allah.', source: 'Sunan at-Tirmidhi 1954' },
];

// Rotating Quran verses per section (cycle daily based on day of year)
const SECTION_VERSES_POOL = {
  daily: [
    '"Verily, the prayer is enjoined on the believers at fixed hours." — Quran 4:103',
    '"Establish prayer at the decline of the sun until the darkness of the night." — Quran 17:78',
    '"And seek help through patience and prayer." — Quran 2:45',
    '"Recite what has been revealed to you of the Book and establish prayer." — Quran 29:45',
    '"O you who believe, bow down and prostrate and worship your Lord, and do good that you may succeed." — Quran 22:77',
    '"Guard strictly your prayers, especially the middle prayer, and stand before Allah in devout obedience." — Quran 2:238',
    '"Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance." — Quran 20:14',
  ],
  habits: [
    '"And whoever does an atom\'s weight of good will see it." — Quran 99:7',
    '"Indeed, Allah does not allow to be lost the reward of those who do good." — Quran 9:120',
    '"So race to all that is good." — Quran 2:148',
    '"And do good; indeed, Allah loves the doers of good." — Quran 2:195',
    '"Whoever does righteousness, whether male or female, while being a believer — We will surely cause them to live a good life." — Quran 16:97',
    '"Indeed, the good deeds remove the evil deeds. That is a reminder for those who remember." — Quran 11:114',
    '"And those who strive for Us — We will surely guide them to Our ways." — Quran 29:69',
  ],
  goals: [
    '"My Lord, increase me in knowledge." — Quran 20:114',
    '"And say: My Lord, I seek refuge in You from the promptings of the devils." — Quran 23:97',
    '"So verily, with hardship, there is ease." — Quran 94:5',
    '"And whoever puts their trust in Allah, He will be sufficient for them." — Quran 65:3',
    '"Our Lord, give us good in this world and good in the Hereafter." — Quran 2:201',
    '"Allah does not burden a soul beyond that it can bear." — Quran 2:286',
    '"And We have certainly made the Quran easy for remembrance, so is there any who will remember?" — Quran 54:17',
  ],
  reflect: [
    '"Indeed, in the remembrance of Allah do hearts find rest." — Quran 13:28',
    '"And those who, when they commit an immorality or wrong themselves, remember Allah and seek forgiveness." — Quran 3:135',
    '"O you who believe, fear Allah. And let every soul look to what it has put forth for tomorrow." — Quran 59:18',
    '"And remember your Lord within yourself in humility and in fear, without being apparent in speech." — Quran 7:205',
    '"Will they not then reflect upon the Quran, or are there locks upon their hearts?" — Quran 47:24',
    '"Those who believe and whose hearts find comfort in the remembrance of Allah." — Quran 13:28',
    '"And We have already created man and We know what his soul whispers to him." — Quran 50:16',
  ],
  home: [
    '"So which of the favours of your Lord would you deny?" — Quran 55:13',
    '"And if you should count the favours of Allah, you could not enumerate them." — Quran 16:18',
    '"Indeed, We created man in the best of stature." — Quran 95:4',
    '"He it is who made the earth subservient to you, so walk in the paths thereof and eat of His provision." — Quran 67:15',
    '"And He found you lost and guided you." — Quran 93:7',
    '"Is not Allah sufficient for His servant?" — Quran 39:36',
    '"Say: In the bounty of Allah and in His mercy — in that let them rejoice." — Quran 10:58',
  ],
};

// Get today's rotating verse for a section
export function getSectionVerse(section) {
  const pool = SECTION_VERSES_POOL[section];
  if (!pool) return '';
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return pool[dayOfYear % pool.length];
}

// Default factory functions
export function getDefaultDailyPage(date) {
  return {
    id: date,
    date,
    niyyah: '',
    salah: {
      fajr: { done: false, onTime: null },
      dhuhr: { done: false, onTime: null },
      asr: { done: false, onTime: null },
      maghrib: { done: false, onTime: null },
      isha: { done: false, onTime: null },
    },
    khushu: 0,
    quran: { surah: '', pages: '', notes: '' },
    muhasabahAnswers: [false, false, false, false, false],
    muhasabahResponse: '',
    timeBlocks: {
      fajr: { tasks: '' },
      dhuhr: { tasks: '' },
      asr: { tasks: '' },
      maghrib: { tasks: '' },
      isha: { tasks: '' },
    },
    gratitude: ['', '', ''],
    topPriorities: ['', '', ''],
    goodDeeds: {
      sadaqah: false,
      helpedSomeone: false,
      extraDhikr: false,
      learnedIslamic: false,
      duaForOthers: false,
      custom: false,
    },
    customDeed: '',
    waterIntake: 0,
    notes: '',
  };
}

export function getDefaultHabits(weekOf) {
  const habits = {};
  HABITS.forEach(h => {
    habits[h.id] = { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false };
  });
  return { id: weekOf, weekOf, habits };
}

export function getDefaultGoals() {
  return {
    id: 'goals',
    goals: [
      { text: '', dunya: '', akhirah: '' },
      { text: '', dunya: '', akhirah: '' },
      { text: '', dunya: '', akhirah: '' },
    ],
  };
}

export function getDefaultWeeklyReview(weekOf) {
  return {
    id: weekOf,
    weekOf,
    wentWell: '',
    improve: '',
    priorities: ['', '', ''],
    dua: '',
    gratitude: '',
    lessonLearned: '',
  };
}

// Utility: get Monday of the current week
export function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Utility: format date as YYYY-MM-DD
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Utility: get today's date string
export function getToday() {
  return formatDate(new Date());
}

// Utility: get a readable date like "Mon, 15 Feb"
export function formatReadableDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// Progressive muhasabah: beginner prompts for first 2 weeks, intermediate for weeks 3-6, advanced after
const MUHASABAH_BEGINNER = [
  'Did I pray all five salah today?',
  'Did I read any Quran today, even one ayah?',
  'Was I kind to someone today?',
  'Did I make dua today?',
  'What is one thing I am grateful for today?',
  'Did I avoid wasting time today?',
  'Did I speak only good words?',
  'Did I remember Allah at any point during my day?',
  'Was I patient when something didn\'t go my way?',
  'Did I try to do one good deed today?',
];

const MUHASABAH_INTERMEDIATE = [
  'Did I pray with focus and presence (khushu) today?',
  'Did I reflect on any ayah I read today?',
  'Did I act with ihsan (excellence) in my work?',
  'Am I holding any grudge that I need to let go of?',
  'Did I prioritize my akhirah goals over dunya distractions?',
  'Was there a moment I felt closest to Allah today?',
  'Did I control my anger and respond with gentleness?',
  'Have I been consistent in my adhkar (morning/evening)?',
  'Did I check on someone who might need support?',
  'What habit am I building that will outlast this week?',
];

function getDayIndex(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / (1000 * 60 * 60 * 24));
}

export function getProgressiveMuhasabah(dateStr, daysLogged) {
  const dayIndex = getDayIndex(dateStr);
  if (daysLogged < 14) {
    return { prompt: MUHASABAH_BEGINNER[dayIndex % MUHASABAH_BEGINNER.length], level: 'beginner' };
  }
  if (daysLogged < 42) {
    return { prompt: MUHASABAH_INTERMEDIATE[dayIndex % MUHASABAH_INTERMEDIATE.length], level: 'intermediate' };
  }
  return { prompt: MUHASABAH[dayIndex % MUHASABAH.length], level: 'advanced' };
}

export function isFriday(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay() === 5;
}

export function isSunnahFastingDay(dateStr) {
  const day = new Date(dateStr + 'T00:00:00').getDay();
  return day === 1 || day === 4;
}

export const FRIDAY_REMINDER = {
  title: 'Jumu\'ah Mubarak',
  text: 'Send salawat upon the Prophet, read Surah Al-Kahf, and make dua in the last hour before Maghrib.',
  verse: '"O you who believe, when the call to prayer is made on Friday, hasten to the remembrance of Allah." -- Quran 62:9',
};

export const FASTING_REMINDER = {
  title: 'Sunnah Fasting Day',
  text: 'The Prophet (peace be upon him) used to fast on Mondays and Thursdays.',
  source: 'Sunan an-Nasa\'i 2362',
};
