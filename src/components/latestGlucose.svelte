<script>
  export let data;

  let isMmol = true;
  let trendStatus;
  let backgroundColor;

  // Reactive block for trendStatus
  $: {
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
  }

  // Reactive block for backgroundColor
  $: {
    if (data.glucoseMMOL > 10 || data.glucoseMMOL < 3.5) {
      backgroundColor = '#de2c2c';
    } else if (data.glucoseMMOL > 8 || data.glucoseMMOL < 4) {
      backgroundColor = '#faa302';
    } else {
      backgroundColor = '#7be827';
    }
  }

  function formatTime(timestamp) {
    let date = new Date(timestamp);
    return ('0' + date.getUTCHours()).slice(-2) + ':' + ('0' + date.getUTCMinutes()).slice(-2);
  }

  function toggleUnit() {
    isMmol = !isMmol;
  }
</script>

<div
  class="latest-glucose-display"
  style="background-color: {backgroundColor}; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px;"
>
  <div style="display: flex; align-items: center; justify-content: center;">
    <span class="glucose-level"
      >{isMmol ? data.glucoseMMOL : data.glucoseMG}</span
    >
    <img
      class="arrow"
      src={`../../glucose_trend_${data.trendNumber}.png`}
      alt={data.trendNumber}
      style="height: 50px; width: auto; margin-left: 20px;"
    />
  </div>
  <span class="additional-info">{isMmol ? 'mmol/L' : 'mg/dL'}</span>
  <button class="unitSwitch" on:click={toggleUnit}>Switch Units</button>
  <p>Last Updated: {formatTime(data.timestamp)}</p>
</div>

<style>
  .latest-glucose-display {
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
    margin-top: 0px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  .glucose-level {
    font-size: 4em; /* Adjust size as needed */
    display: inline-block; /* This makes it so the image can sit next to this element */
    vertical-align: middle; /* This will vertically center the glucose level relative to the arrow */
    font-weight: 550;
  }

  .additional-info {
    font-size: 1.5em; /* Adjust size as needed */
    display: block; /* This will place it below the glucose level and arrow image */
    margin-top: 0px; /* Adds some space between this text and the elements above */
    margin-bottom: 10px; /* Adds some space between this text and the elements below */
  }

  .arrow {
    /* Adjust the size as needed */
    width: auto;
    height: 3em; /* Example size, change as per requirement */
    display: inline-block; /* This will keep the arrow on the same line as the glucose level */
    vertical-align: middle; /* This will vertically center the arrow relative to the glucose level */
  }
</style>
