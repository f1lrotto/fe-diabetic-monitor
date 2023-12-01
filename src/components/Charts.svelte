<script>
  import { onMount } from 'svelte';
  import { DateInput } from 'date-picker-svelte'
  import moment from 'moment-timezone'

  import {
    fetchDayData,
    specificDayGlucoseData,
  } from '../stores/glucoseStore';

  import {
    initChart,
    updateChart,
  } from '../helpers/chart.js'

  let chart = null;
  let chartInitialized = false;
  let isSmooth = true;
  let interval = window.innerWidth < 600 ? '10' : '5';
  let date = null;

  onMount(async () => {
    date = new Date();
    await fetchDayData(new Date())
    chart = initChart(document, $specificDayGlucoseData);
    chartInitialized = true;
  });

  $: if (chartInitialized && $specificDayGlucoseData) {
    chart = updateChart(chart, $specificDayGlucoseData, isSmooth, interval)
    chart.update();
  }

  $: if (date) {
    fetchDayData(date);
  }

</script>

<div>
  <DateInput
    bind:value={date}
		format="dd/MM/yyyy"
		placeholder={moment(date).format('dd/MM/yyyy')}
    max={new Date()} />
  <button on:click={() => (isSmooth = !isSmooth)}>
    {isSmooth ? 'Switch to Detailed' : 'Switch to Smooth'}
  </button>
  {#if isSmooth}
    <select name="interval" id="interval" bind:value={interval}>
      <option value="5" selected={interval === '5'}>5 minutes</option>
      <option value="10" selected={interval === '10'}>10 minutes</option>
      <option value="15" selected={interval === '15'}>15 minutes</option>
      <option value="30" selected={interval === '30'}>30 minutes</option>
    </select>
  {/if}
  <canvas id="glucoseChart" />
</div>

<style>
  #glucoseChart {
    width: 100%;
    height: 80vh;
    max-height: 80vh;
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
    background-color: #f5f5f5;
  }

  button:hover {
    background-color: #e0e0e0;
  }

  select {
    /* Styles for the dropdown */
    padding: 10px 10px;
    margin-left: 10px;
    border-radius: 5px;
    height: 35px;
    background-color: #f5f5f5;
    border: 0px solid #ccc;
  }

</style>
