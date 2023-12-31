<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // COMOPONENTS
  import LatestGlucose from '../components/latestGlucose.svelte';
  import TableGlucose from '../components/TableGlucose.svelte';
  import Navbar from '../components/Navbar.svelte';
  import GlucoseChart from '../components/GlucoseChart.svelte';
  import MealsDashboard from '../components/MealsDashboard.svelte';
  import Charts from '../components/Charts.svelte';
  import Stats from '../components/Stats.svelte';

  // STORES AND FETCH FUNCTIONS
  import {
    latestGlucoseData,
    fetchLatestGlucoseData,
    last6GlucoseData,
    fetchLast6GlucoseData,
    last12GlucoseData,
    fetchLast12GlucoseData,
    last24GlucoseData,
    fetchLast24GlucoseData,
    lastWeekGlucoseData,
    fetchLastWeekGlucoseData,
  } from '../stores/glucoseStore';

  import { checkAuth } from '../services/authService';
  import { isAuthenticated, userProfile } from '../stores/authStore';
  import {
    postMeal,
  } from '../services/mealService';

  // DECLARE TOP LEVEL STORES
  let activeComponent = writable('home');
  let tableDuration = writable('24h');
  let durationGlucoseFunction = writable(fetchLast24GlucoseData);
  let graphFetchFunction = writable(fetchLast12GlucoseData);
  let graphStore = null;
  let isMobile = false;

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
    // if this is local development, set the user to authenticated
    if (window.location.hostname === 'localhost') {
      isAuthenticated.set(true);
    } else {
      await checkAuth();
    }

    isMobile = window.screen.width < 600;

    if (isMobile) {
      graphFetchFunction.set(fetchLast6GlucoseData);
      graphStore = last6GlucoseData;
    } else {
      graphFetchFunction.set(fetchLast12GlucoseData);
      graphStore = last12GlucoseData;
    }

    // Fetch the latest glucose data
    await fetchLatestGlucoseData();
    await fetchLast24GlucoseData();

    const graphFetchFun = $graphFetchFunction;
    await graphFetchFun();

    await setDuration('24h');

    // Set up the interval for the latest glucose data
    const intervalLatest = setInterval(async () => {
      await fetchLatestGlucoseData(); // Fetch every minute
      await graphFetchFun();
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
  <Navbar {activeComponent} {setActive} {setDuration} {isAuthenticated} {tableDuration} />
  <div>
    {#if $activeComponent === 'home'}
      <div>
        {#if $latestGlucoseData}
          <LatestGlucose data={$latestGlucoseData} {postMeal} />
          {#if $graphStore}
            <GlucoseChart data={$graphStore} />
          {:else}
            <div class="loader" />
          {/if}
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
    {:else if $activeComponent === 'meals'}
      <MealsDashboard/>
    {:else if $activeComponent === 'chart'}
      <Charts/>
    {:else if $activeComponent === 'stats'}
      <Stats/>
    {/if}
  </div>
{:else}
  <Navbar {activeComponent} {setActive} {setDuration} {isAuthenticated} {tableDuration} />
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
