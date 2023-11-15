import { writable } from 'svelte/store';

export const latestGlucoseData = writable(null);
export const last12GlucoseData = writable(null);
export const last24GlucoseData = writable(null);
export const lastWeekGlucoseData = writable(null);

const API_URL = import.meta.env.VITE_API_URL;

async function fetchData(endpoint, store) {
  const response = await fetch(endpoint, {
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
    }
  });
  if (response.ok) {
    const json = await response.json();
    return store.set(json);
  } else {
    throw new Error('Network response was not ok');
  }
}

export const fetchLatestGlucoseData = () => fetchData(`${API_URL}/latest`, latestGlucoseData);
export const fetchLast12GlucoseData = () => fetchData(`${API_URL}/last-hours-12`, last12GlucoseData);
export const fetchLast24GlucoseData = () => fetchData(`${API_URL}/last-hours-24`, last24GlucoseData); 
export const fetchLastWeekGlucoseData = () => fetchData(`${API_URL}/last-week`, lastWeekGlucoseData);

