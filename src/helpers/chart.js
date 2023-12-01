import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';

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

function getGraphMinMax(data) {
  const lowest = Math.min(...data.map((item) => item.glucoseMMOL));
  const highest = Math.max(...data.map((item) => item.glucoseMMOL));
  return { lowest, highest };
}

const verticalLinePlugin = {
  id: 'verticalLine',
  beforeEvent(chart, args) {
    const event = args.event;
    if (event.type === 'mousemove') {
      chart.config._config.options.plugins.verticalLine.x = event.x;
    } else if (event.type === 'mouseout') {
      chart.config._config.options.plugins.verticalLine.x = null;
    }
  },
  afterDraw(chart) {
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

function initChart(document, data) {
  console.log('initing chart')
  console.log('data', data)
  Chart.register(...registerables, annotationPlugin);
  Chart.register(verticalLinePlugin);
  const ctx = document.getElementById('glucoseChart').getContext('2d'); 

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Glucose Levels (mmol/L)',
          data: prepareChartData(data),
          fill: false,
          segment: {
            borderColor: 'blue',
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
  

  return chart;
}

const updateChart = (chart, data, isSmooth, interval) => {
  const processedData = isSmooth ? aggregateDataForSmoothMode(data, interval) : data;
  const { lowest, highest } = getGraphMinMax(processedData)
  chart.data.datasets[0].data = prepareChartData(processedData);
  chart.options.scales.y.min = lowest - 1;
  chart.options.scales.y.max = highest + 1;
  chart.data.datasets[0].tension = isSmooth ? 0.4 : 0.1;
  chart.data.datasets[0].pointRadius = isSmooth ? 0 : 2;
  chart.data.datasets[0].pointHoverRadius = isSmooth ? 0 : 8;

  return chart;
}




export {
  formatTime,
  initChart,
  updateChart,
}