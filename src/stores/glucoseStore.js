import { writable } from 'svelte/store';

export const latestGlucoseData = writable(null);
export const last12GlucoseData = writable(null);
export const last24GlucoseData = writable(null);
export const lastWeekGlucoseData = writable(null);

const API_URL = import.meta.env.VITE_API_URL;

async function fetchData(endpoint, store) {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
    }
  });
  if (response.ok) {
    console.log(await response)
    const json = await response.json();
    console.log(json);
    return store.set(json);
  } else {
    throw new Error('Network response was not ok');
  }
}

export const fetchLatestGlucoseData = (latestGlucoseData) => fetchData(`${API_URL}/latest`, latestGlucoseData);
export const fetchLast12GlucoseData = (last12GlucoseData) => fetchData(`${API_URL}/last-hours-12`, last12GlucoseData);
export const fetchLast24GlucoseData = (last24GlucoseData) => fetchData(`${API_URL}/last-hours-24`, last24GlucoseData); 
export const fetchLastWeekGlucoseData = (lastWeekGlucoseData) => fetchData(`${API_URL}/last-week`, lastWeekGlucoseData);

