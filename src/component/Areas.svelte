<script lang="ts">
  import { areas } from "../store/db";
</script>

{#await $areas}
  <p>...waiting</p>
{:then loadedAreas}
  {#each loadedAreas as area, i}
    <li>
      {area._id}: {area.name}
    </li>
  {/each}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
