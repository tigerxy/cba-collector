<script lang="ts">
  import { Route } from "svelte-router-spa";
  import "../../node_modules/svelte-material-ui/bare.css";
  import AppBar from "../component/AppBar.svelte";
  import AppDrawer from "../component/AppDrawer.svelte";

  export let currentRoute;
  const params = {};
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
  <AppBar bind:open />
  <Route {currentRoute} {params} />
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
