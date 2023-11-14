<script>
  export let data;

  let isMmol = true;

  let trendStatus;

  // set up variables for the trend number and corresponding trendStatus
  switch (data.trendNumber) {
    case 1:
      trendStatus = 'Glucose Dropping Rapidly';
      break;
    case 2:
      trendStatus = 'Glucose Dropping';
      break;
    case 3:
      trendStatus = 'Glucose Stable';
      break;
    case 4:
      trendStatus = 'Glucose Rising';
      break;
    case 5:
      trendStatus = 'Glucose Rising Rapidly';
      break;
    default:
      trendStatus = 'Unknown';
      break;
  }

  let backgroundColor;

  if (data.glucoseMMOL > 10 || data.glucoseMMOL < 3.5) {
    backgroundColor = '#de2c2c';
  } else if (data.glucoseMMOL > 8 || data.glucoseMMOL < 4) {
    backgroundColor = '#faa302';
  } else {
    backgroundColor = '#7be827';
  }

  function formatTime(timestamp) {
    let date = new Date(timestamp);
    date.setHours(date.getHours() - 2);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function toggleUnit() {
    isMmol = !isMmol;
  }
</script>

<style>
  .latest-glucose-display {
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
    margin-top: 50px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .arrow {
    width: 25px;
    height: 25px;
    margin-left: 5px;
  }

  .unitSwitch {
    background-color: rgba(255, 255, 255, 0.3);
    border: none;
    color: black;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition: background-color 0.3s ease;
    border-radius: 5px;
  }

  .unitSwitch:hover {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>

<div>
  <div class="latest-glucose-display" style="background-color: {backgroundColor}">
    <h1>{isMmol ? data.glucoseMMOL + ' mmol/L' : data.glucoseMG + ' mg/dL'} <img class="arrow" src={`../../glucose_trend_${data.trendNumber}.png`} alt={data.trendNumber} /></h1>
    <h2>{trendStatus}</h2>
    <button class="unitSwitch" on:click={toggleUnit}>Switch Units</button>
    <p>Last Updated: {formatTime(data.timestamp)}</p>
  </div>
  
</div>
