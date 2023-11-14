<script>
    // Import a store or a service if you're fetching data
    import LatestGlucose from '../components/latestGlucose.svelte';
    import { latestGlucoseData, fetchLatestGlucoseData } from '../stores/glucoseStore';
    import { onMount } from 'svelte';

    onMount(() => {
        fetchLatestGlucoseData(latestGlucoseData);
        const interval = setInterval(fetchLatestGlucoseData(latestGlucoseData), 60000);
        return () => clearInterval(interval);
    });;

</script>

<style>
    .loading {
        font-size: 1.2em;
        color: #555; /* Adjust the color as per your theme */
        text-align: center;
        padding: 20px;
        margin-top: 50px;
        border-radius: 5px;
        background-color: #f3f3f3; /* Light grey background */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* subtle shadow for depth */

        /* Simple Animation */
        animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.7;
        }
    }
</style>


<!-- HTML for your component -->
<div>
    {#if $latestGlucoseData}
        <LatestGlucose data={$latestGlucoseData} />
    {:else}
        <p class="loading">Loading glucose data...</p>
    {/if}
</div>
