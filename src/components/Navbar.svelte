<script>
  import { login, logout } from '../services/authService';

  export let activeComponent;
  export let setActive;
  export let setDuration; // New prop for setting duration
  export let isAuthenticated;
  export let tableDuration;
</script>

<nav>
  {#if $isAuthenticated}
    <!-- Navigation item for Home -->
    <button on:click={() => setActive('home')} class:active={$activeComponent === 'home'}>
      Home
    </button>

    <!-- Navigation item for Table -->
    <button on:click={() => setActive('table')} class:active={$activeComponent === 'table'}>
      Table
    </button>

    <button on:click={() => setActive('meals')} class:active={$activeComponent === 'meals'}>
      Meals
    </button>

    <!-- Dropdown for selecting duration, only visible when Table is active -->
    {#if $activeComponent === 'table'}
      <select on:change={(e) => setDuration(e.target.value)}>
        <option value="12h" selected={$tableDuration === '12h'}>Last 12 Hours</option>
        <option value="24h" selected={$tableDuration === '24h'}>Last 24 Hours</option>
        <option value="week" selected={$tableDuration === 'week'}>Last Week</option>
      </select>
    {/if}
    <button class="login-button" on:click={logout}>Logout</button>
  {:else}
    <button on:click={login}>Login with Google</button>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: start;
    background-color: #f5f5f5;
    padding: 10px;
  }

  button {
    /* Styles for navigation buttons */
    margin-right: 10px;
    padding: 10px 15px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
  }

  .login-button {
    margin-right: auto;
  }

  button:hover {
    background-color: #e0e0e0;
  }

  button.active {
    background-color: #d0d0d0;
  }

  select {
    /* Styles for the dropdown */
    padding: 10px 10px;
    margin-left: 10px;
    border-radius: 5px;
    height: 35px;
    background-color: transparent;
    border: 0px solid #ccc;
  }

  select:hover {
    background-color: #e0e0e0;
  }

  select:focus {
    background-color: #d0d0d0;
  }
</style>
