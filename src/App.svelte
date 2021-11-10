<script lang="ts">
  import AppBar from "./component/AppBar.svelte";
  import Map from "./component/Map.svelte";
  import AppDrawer from "./component/AppDrawer.svelte";
  import Login from "./component/Login.svelte";
  import { realmUser } from "./store/auth";

  import "../node_modules/svelte-material-ui/bare.css";

  let open = false;
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

<AppDrawer bind:open />

<div class="app-content">
  {#if $realmUser}
    <AppBar bind:open />
    <Map />
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
