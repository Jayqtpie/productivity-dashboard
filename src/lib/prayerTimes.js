import { getSetting, setSetting } from './db';

/**
 * Fetch prayer times from Aladhan API for a given date and location.
 * Returns { fajr, dhuhr, asr, maghrib, isha } in 24h "HH:MM" format.
 */
async function fetchPrayerTimes(lat, lng, dateStr) {
  // Aladhan API expects DD-MM-YYYY
  const [y, m, d] = dateStr.split('-');
  const apiDate = `${d}-${m}-${y}`;

  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${apiDate}?latitude=${lat}&longitude=${lng}&method=2`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');

  const json = await res.json();
  const t = json.data.timings;

  // Strip any timezone annotation like " (BST)"
  const clean = (s) => s.replace(/\s*\(.*\)/, '');

  return {
    fajr: clean(t.Fajr),
    dhuhr: clean(t.Dhuhr),
    asr: clean(t.Asr),
    maghrib: clean(t.Maghrib),
    isha: clean(t.Isha),
  };
}

/**
 * Get the user's saved location, or null if not set.
 */
export async function getLocation() {
  return await getSetting('location');
}

/**
 * Request the user's location via browser Geolocation API,
 * reverse-geocode to get a city name, and save to IndexedDB.
 */
export async function setupLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Try to get city name via reverse geocode
        let cityName = '';
        try {
          const geoRes = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
          );
          if (geoRes.ok) {
            const geoJson = await geoRes.json();
            cityName = geoJson.data?.meta?.timezone || '';
            // Extract city from timezone (e.g. "Europe/London" -> "London")
            cityName = cityName.split('/').pop().replace(/_/g, ' ');
          }
        } catch {
          // City name is optional, continue without it
        }

        const location = { lat: latitude, lng: longitude, city: cityName };
        await setSetting('location', location);
        resolve(location);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please allow location access in your browser settings.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location unavailable. Please try again.'));
            break;
          default:
            reject(new Error('Could not get your location. Please try again.'));
        }
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });
}

/**
 * Remove saved location.
 */
export async function clearLocation() {
  await setSetting('location', null);
}

/**
 * Get all 5 prayer times for a specific date (YYYY-MM-DD).
 * Returns { fajr, dhuhr, asr, maghrib, isha } in "HH:MM" 24h format, or null if location not set.
 */
export async function getPrayerTimesForDate(dateStr) {
  const location = await getLocation();
  if (!location?.lat) return null;

  try {
    return await fetchPrayerTimes(location.lat, location.lng, dateStr);
  } catch {
    return null;
  }
}
