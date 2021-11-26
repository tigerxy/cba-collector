<script lang="ts">
  import { App, User } from "realm-web";

  const app: App = new App({ id: "cba-collector-fiqgw" });

  export let currentRoute;
  const { token, tokenId } = currentRoute.queryParams;

  app.emailPasswordAuth
    .confirmUser(token, tokenId)
    .then(() => console.log("success"))
    .catch(alert);
</script>
