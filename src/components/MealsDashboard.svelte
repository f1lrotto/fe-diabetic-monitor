<script>
  import { onMount } from 'svelte';
  import {
    getMeals,
    deleteMeal,
  } from '../services/mealService';

  let meals = []; 

  async function fetchMeals() {
    meals = await getMeals();
  }

  async function deleteMealFun(mealLog) {
    await deleteMeal(mealLog._id);
    await fetchMeals();
  }

  function formatTime(timestamp) {
    let date = new Date(timestamp);
    return ('0' + date.getUTCHours()).slice(-2) + ':' + ('0' + date.getUTCMinutes()).slice(-2);
  }

  function formatDate(timestamp) {
    let date = new Date(timestamp);
    return (
      date.getUTCDate() +
      ' ' +
      new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date) +
      ' ' +
      date.getUTCFullYear()
    );
  }

  function postMealMessage(mealLog) {
    if (!mealLog.postMealGlucoseMMOL) {
      return 'Not yet recorded';
    } 
      return mealLog.postMealGlucoseMMOL;
  }

  onMount(async () => {
    await fetchMeals();
  });

  $: isLoading = !meals || meals.length === 0;
</script>

<div>
  {#if isLoading}
    <div class="loader" />
  {:else}
    {#each Object.keys(meals) as day}
      <div class="day-container">
        <div class="day-header">{formatDate(day)}</div>
        {#each meals[day] as mealLog}
          <div class="meal-card">
            <div class="meal-type">{mealLog.mealType}</div>
            <div class="time">{formatTime(mealLog.mealTime)}</div>
            <div
              class="glucose-level {mealLog.preMealGlucoseMMOL > 10 || mealLog.preMealGlucoseMMOL < 3.5
                ? 'high'
                : mealLog.preMealGlucoseMMOL > 8 || mealLog.preMealGlucoseMMOL < 4
                ? 'medium'
                : ''}"
            >
              {mealLog.preMealGlucoseMMOL} mmol/L
            </div>
            {#if mealLog.postMealPresent}
              <div class="time">{formatTime(mealLog.postMealTime)}</div> 
              <div
                class="glucose-level {postMealMessage(mealLog) > 10 || postMealMessage(mealLog) < 3.5
                  ? 'high'
                  : postMealMessage(mealLog) > 8 || postMealMessage(mealLog) < 4
                  ? 'medium'
                  : postMealMessage(mealLog) === 'Not yet recorded'
                  ? 'not-recorded'
                  : ''}"
              >
                {postMealMessage(mealLog)} mmol/L
              </div>
            {/if}
            <button on:click={deleteMealFun(mealLog)}>Delete</button>
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
    border-bottom: 1px solid #ddd;
    font-family: 'Arial', sans-serif;
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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .meal-card {
    flex: 0 1 150px;
    margin: 10px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0 7px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 10px;
    transition: transform 0.3s ease;
  }

  .meal-card:hover {
    transform: translateY(-5px);
  }

  .meal-type {
    font-weight: bold;
    background-color: #f0f0f0;
    padding: 5px;
    border-radius: 5px;
  }
   .time {
    background-color: #f0f0f0;
    padding: 5px;
    border-radius: 5px;
    margin-top: 5px;
  }

  .glucose-level {
    background-color: #7be827;
    padding: 5px;
    border-radius: 5px;
    margin-top: 5px;
  }

  .high {
    background-color: #de2c2c;
  }
  .medium {
    background-color: #faa302;
  }
  .not-recorded {
    background-color: #f5f5f5;
  }

  button {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    background-color: #e0e0e0;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
  }

  button:hover {
    background-color: #d0d0d0;
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
