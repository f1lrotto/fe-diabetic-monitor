<script>
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import annotationPlugin from 'chartjs-plugin-annotation';
  Chart.register(...registerables, annotationPlugin);

  export let data = [];

  let chart = null;
  let chartInitialized = false;
  let isSmooth = true;
  let interval = window.innerWidth < 600 ? '10' : '5';

  function formatTime(timestamp) {
    let date = new Date(timestamp);
    return ('0' + date.getUTCHours()).slice(-2) + ':' + ('0' + date.getUTCMinutes()).slice(-2);
  }

  function prepareChartData(data) {
    return data.map((item) => ({
      x: new Date(item.timestamp).setHours(new Date(item.timestamp).getHours() - 1),
      y: item.glucoseMMOL,
    }));
  }

  function aggregateDataForSmoothMode(data, interval = 5) {
    return data.filter((_, index) => index % interval === 0); // Take every 10th data point
  }

  function customLineSegment(context) {
    const { p0, p1 } = context;
    let color = 'blue';
    console.log(p0, p1);
    if (p0.parsed.y > 8 || p1.parsed.y > 8 || p0.parsed.y < 4 || p1.parsed.y < 4) {
      color = 'red';
    }
    return { borderColor: color };
  }

  const verticalLinePlugin = {
    id: 'verticalLine',
    beforeEvent(chart, args, pluginOptions) {
      const event = args.event;
      if (event.type === 'mousemove') {
        chart.config._config.options.plugins.verticalLine.x = event.x;
      } else if (event.type === 'mouseout') {
        chart.config._config.options.plugins.verticalLine.x = null;
      }
    },
    afterDraw(chart, args, options) {
      const x = chart.config._config.options.plugins.verticalLine.x;
      if (x) {
        const ctx = chart.ctx;
        const yAxis = chart.scales.y;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)'; // Change color as needed
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  onMount(() => {
    Chart.register(verticalLinePlugin);

    const ctx = document.getElementById('glucoseChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Glucose Levels (mmol/L)',
            data: prepareChartData(data),
            fill: false,
            segment: {
              borderColor: (context) => 'blue', //customLineSegment(context),
            },
            tension: 0.9,
          },
        ],
      },
      options: {
        plugins: {
          verticalLine: { x: null },
          tooltip: {
            mode: 'point',
            callbacks: {
              title: function (context) {
                const date = new Date(context[0].parsed.x);
                return date.toLocaleTimeString(); // or any other format you prefer
              },
            },
          },
          annotation: {
            annotations: {
              line4: {
                type: 'line',
                yMin: 4,
                yMax: 4,
                borderColor: 'red',
                borderWidth: 1,
                borderDash: [10, 5],
              },
              line8: {
                type: 'line',
                yMin: 8,
                yMax: 8,
                borderColor: 'red',
                borderWidth: 1,
                borderDash: [10, 5],
              },
              greenRange: {
                type: 'box',
                yMin: 4.5,
                yMax: 7,
                backgroundColor: 'rgba(0, 128, 0, 0.15)', // semi-transparent green
                borderWidth: 0,
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
              tooltipFormat: 'MMM d, h:mm a',
            },
          },
          y: {
            beginAtZero: false,
            min: 3, // Set the minimum value
            max: 10, // Set the maximum value
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    chartInitialized = true;
  });

  $: if (chartInitialized && data) {
    const processedData = isSmooth ? aggregateDataForSmoothMode(data, interval) : data;
    chart.data.datasets[0].data = prepareChartData(processedData);
    chart.data.datasets[0].tension = isSmooth ? 0.4 : 0.1;
    chart.data.datasets[0].pointRadius = isSmooth ? 0 : 2;
    chart.data.datasets[0].pointHoverRadius = isSmooth ? 0 : 8;
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
