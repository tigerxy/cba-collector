<script lang="ts">
  import type { Feature } from "geojson";
  import "../node_modules/svelte-material-ui/bare.css";
  import AppBar from "./component/AppBar.svelte";
  import AppDrawer from "./component/AppDrawer.svelte";
  import Areas from "./component/Areas.svelte";
  import Login from "./component/Login.svelte";
  import Map from "./component/Map.svelte";
  import type { Page } from "./global";
  import { realmUser } from "./store/auth";

  let active: Page = "start";
  let open = false;

  window.scrollTo(0,1);

  const areaHandler = (area: CustomEvent<Feature>) => {
    console.log(area.detail);
  };

  const collectingPointHandler = (collectingPoint: CustomEvent<Feature>) => {
    console.log(collectingPoint.detail);
  };
</script>

<svelte:head>
  <!-- Material Icons -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <!-- Roboto -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />
  <!-- Roboto Mono
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto+Mono"
  /> -->
</svelte:head>

<AppDrawer bind:open bind:active />

<div class="app-content">
  {#if $realmUser}
    <AppBar bind:open />
    {#if active === "start"}
      <Map
        on:areaSelected={areaHandler}
        on:collectingPointSelected={collectingPointHandler}
      />
    {:else}
      <Areas />
    {/if}
  {:else}
    <Login />
  {/if}
</div>

<style>
  .app-content {
    display: flex;
    flex-direction: column;
    align-content: stretch;
    align-items: stretch;
    height: 100vh;
  }
</style>
