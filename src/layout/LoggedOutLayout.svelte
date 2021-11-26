<script lang="ts">
  import Paper from "@smui/paper";
  import { Route } from "svelte-router-spa";
  import { Content, Title } from "@smui/paper";
  import { t } from "svelte-i18n";

  export let currentRoute;
  console.log(currentRoute);
  const params = {};
</script>

<div class="container">
  <Paper elevation={24} class="paper-demo">
    <Title>{currentRoute.component.$title}</Title>
    <Content>
      <Route {currentRoute} {params} />
    </Content>
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
