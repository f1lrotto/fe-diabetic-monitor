<script>
  import { onMount } from 'svelte';

  import {
    formatTime,
    initChart,
    updateChart,
  } from '../helpers/chart.js'

  export let data = [];

  let chart = null;
  let chartInitialized = false;
  let isSmooth = true;
  let interval = window.innerWidth < 600 ? '10' : '5';

  onMount(() => {
    chart = initChart(document, data);
    chartInitialized = true;
  });

  $: if (chartInitialized && data) {
    chart = updateChart(chart, data, isSmooth, interval)
    chart.update();
  }
</script>

<div>
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
  <p>Last updated {formatTime(data[data.length - 1].timestamp)}</p>
</div>

<style>
  #glucoseChart {
    width: 100%;
    max-height: 50vh;
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

  p {
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
    margin-top: 0px;
    font-size: 01em; /* Adjust size as needed */
    display: block; /* This will place it below the glucose level and arrow image */
    margin-top: 0px; /* Adds some space between this text and the elements above */
    margin-bottom: 0px; /* Adds some space between this text and the elements below */
  }
</style>
