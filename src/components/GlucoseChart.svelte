<script>
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import annotationPlugin from 'chartjs-plugin-annotation';
  Chart.register(...registerables, annotationPlugin);

  export let data = [];

  let chart = null;
  let chartInitialized = false;

  function prepareChartData(data) {
    return data.map((item) => ({
      x: item.timestamp,
      y: item.glucoseMMOL,
    }));
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
                // Assuming the x-axis is a time scale
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
              }
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
            min: 3.5, // Set the minimum value
            max: 8.5, // Set the maximum value
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    chartInitialized = true;
  });

  $: if (chartInitialized && data) {
    chart.data.datasets[0].data = prepareChartData(data);
    chart.update();
  }
</script>

<canvas id="glucoseChart" />
<p>Last updated {data[data.length - 1].timestamp}</p>
<style>
  #glucoseChart {
    width: 100%;
    max-height: 60vh;
  }
</style>
