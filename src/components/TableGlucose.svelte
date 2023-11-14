<script>
  import { writable } from 'svelte/store';

  export let data;

  // Declare the store at the top level
  let filterOption = writable(false); // false for basic filter, true for extended filter

  // Move toggleFilter outside of the conditional block
  function toggleFilter() {
    filterOption.update((n) => !n);
  }

  function formatTime(timestamp) {
    let date = new Date(timestamp);
    return ('0' + date.getUTCHours()).slice(-2) + ':' + ('0' + date.getUTCMinutes()).slice(-2);
  }

  function formatDate(timestamp) {
    let date = new Date(timestamp);
    return (
      date.getUTCFullYear() +
      '-' +
      ('0' + (date.getUTCMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getUTCDate()).slice(-2)
    );
  }

  let extendedInfo = $filterOption ? [0, 15, 30, 45] : [0, 30];

  /////////////////////////////
  ////// Derived stores //////
  ////////////////////////////

  $: isLoading = !data || data.length === 0;

  // Sort data by timestamp in descending order
  $: sortedData = data?.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) || [];

  // Group sorted and filtered data by day
  $: readingsByDay = sortedData.reduce((acc, item) => {
    const dateKey = formatDate(item.timestamp);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    // push the reading to the array only if it doesn't already exist and it satisfies the filter used by the extendedInfo condition
    if (
      !acc[dateKey].some((reading) => reading.timestamp === item.timestamp) &&
      ($filterOption ? [0, 15, 30, 45] : [0, 30]).includes(new Date(item.timestamp).getMinutes())
    ) {
      console.log(extendedInfo);
      acc[dateKey].push(item);
    }

    return acc;
  }, {});
</script>

<div>
  {#if isLoading}
    <div class="loader" />
  {:else}
    <button on:click={toggleFilter}>
      {#if $filterOption}
        Show Basic Readings
      {:else}
        Show Extended Readings
      {/if}
    </button>
    {#each Object.keys(readingsByDay) as day (day)}
      <div class="day-container">
        <div class="day-header">{day}</div>
        {#each readingsByDay[day] as item (item._id)}
          <div class="reading">
            <div class="time">{formatTime(item.timestamp)}</div>
            <div
              class="glucose-level {item.glucoseMMOL > 10 || item.glucoseMMOL < 3.5
                ? 'high'
                : item.glucoseMMOL > 8 || item.glucoseMMOL < 4
                ? 'medium'
                : ''}"
            >
              {item.glucoseMMOL} mmol/L
            </div>
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>

<style>
  .day-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    border-bottom: 1px solid #ddd; /* Separator between days */
    font-family: sans-serif;
  }

  .day-header {
    width: 100%;
    text-align: left;
    padding: 10px 0;
    margin-bottom: 10px;
    border-top: 1px solid #ccc;
    font-size: 1.2em;
    color: #333;
    background-color: #f7f7f7;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .reading {
    flex: 0 1 150px; /* Flex basis of 150px, change as needed */
    margin: 5px;
    text-align: center;
  }

  .time {
    background-color: #f0f0f0;
  }

  .glucose-level {
    background-color: #7be827; /* Default background color */
  }

  /* Apply specific background colors based on glucoseMMOL */
  .high {
    background-color: #de2c2c;
  }
  .medium {
    background-color: #faa302;
  }
  button {
    /* Styles for navigation buttons */
    margin-right: 10px;
    margin-top: 10px;
    padding: 10px 15px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
  }

  button:hover {
    background-color: #e0e0e0;
  }

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
