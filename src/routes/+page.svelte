<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // COMOPONENTS
  import LatestGlucose from '../components/latestGlucose.svelte';
  import TableGlucose from '../components/TableGlucose.svelte';
  import Navbar from '../components/Navbar.svelte';
  
  // STORES AND FETCH FUNCTIONS
  import {
    latestGlucoseData,
    fetchLatestGlucoseData,
    last12GlucoseData,
    fetchLast12GlucoseData,
    last24GlucoseData,
    fetchLast24GlucoseData,
    lastWeekGlucoseData,
    fetchLastWeekGlucoseData,
  } from '../stores/glucoseStore';

  import { checkAuth } from '../services/authService';
  import { isAuthenticated, userProfile } from '../stores/authStore';


  // DECLARE TOP LEVEL STORES
  let activeComponent = writable('home');
  let tableDuration = writable('24h');
  let durationGlucoseFunction = writable(fetchLast24GlucoseData);

  function setActive(component) {
    activeComponent.set(component);
  }

  async function setDuration(duration) {
    tableDuration.set(duration);
    switch (duration) {
      case '12h':
        await fetchLast12GlucoseData();
        durationGlucoseFunction.set(fetchLast12GlucoseData);
        break;
      case '24h':
        await fetchLast24GlucoseData();
        durationGlucoseFunction.set(fetchLast24GlucoseData);
        break;
      case 'week':
        await fetchLastWeekGlucoseData();
        durationGlucoseFunction.set(fetchLastWeekGlucoseData);
        break;
    }
  }

  onMount(async () => {
    await checkAuth();
    // Fetch the latest glucose data
    await fetchLatestGlucoseData();
    await fetchLast24GlucoseData();

    // Set up the interval for the latest glucose data
    const intervalLatest = setInterval(() => {
      fetchLatestGlucoseData(); // Fetch every minute
    }, 60000);

    const intervalTable = setInterval(async () => {
      const fetchFunction = $durationGlucoseFunction;
      await fetchFunction();
    }, 5 * 60000);

    // Clear the intervals on component destruction
    return () => {
      clearInterval(intervalLatest);
      clearInterval(intervalTable);
    };
  });
</script>

{#if $isAuthenticated}
  <Navbar {activeComponent} {setActive} {setDuration} />
  <div>
    {#if $activeComponent === 'home'}
      <div>
        {#if $latestGlucoseData}
          <LatestGlucose data={$latestGlucoseData} />
        {:else}
          <div class="loader" />
        {/if}
      </div>
    {:else if $activeComponent === 'table'}
      <div>
        {#if $tableDuration === '12h'}
          <TableGlucose data={$last12GlucoseData} />
        {:else if $tableDuration === '24h'}
          <TableGlucose data={$last24GlucoseData} />
        {:else if $tableDuration === 'week'}
          <TableGlucose data={$lastWeekGlucoseData} />
        {/if}
      </div>
    {/if}
  </div>
{:else}
  <Navbar {activeComponent} {setActive} {setDuration} {isAuthenticated} {userProfile}/>
{/if}

<style>
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin: 20px auto;
  }
</style>
