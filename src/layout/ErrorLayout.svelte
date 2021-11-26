<script lang="ts">
    import Paper from "@smui/paper";
    import { Route } from "svelte-router-spa";
  
    export let currentRoute;
    const params = {};
  </script>
  
  <div class="container">
    <Paper elevation={24} class="paper-demo">
      <Route {currentRoute} {params} />
    </Paper>
  </div>
  
  <style>
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  
    * :global(.paper-demo) {
      max-width: 600px;
    }
  </style>
  