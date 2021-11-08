<script lang="ts">
  import AppBar from "./AppBar.svelte";
  import Map from "./Map.svelte";
  import AppDrawer from "./AppDrawer.svelte";

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
  <!-- Roboto Mono -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto+Mono"
  />
</svelte:head>

<AppDrawer bind:open />

<div class="app-content">
  <AppBar bind:open />
  <Map />
  <main class="main-content" />
</div>

<style>
  .app-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
</style>
