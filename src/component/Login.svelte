<script lang="ts">
  import * as Realm from "realm-web";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Label } from "@smui/fab";
  import { Icon } from "@smui/common";
  import Textfield from "@smui/textfield";

  import { realmUser } from "../store/auth";
import { Separator } from "@smui/list";

  async function doLogin() {
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      // Authenticate the user
      const user: Realm.User = await app.logIn(credentials);
      realmUser.set(user);
      console.log(`Successfully loggedin with user ${user.id}`);
    } catch (err) {
      console.error("Failed to log in", err);
      invalid = true;
    }
  }
  let login = null;
  let email = "";
  let password = "";
  let invalid = false;

  const app: Realm.App = new Realm.App({ id: "cba-collector-fiqgw" });
</script>

<div class="login-container">
  <Paper class="paper-demo">
    <Title>Login</Title>
    <Content>
      <Fab
        on:click={doLogin}
        disabled={email === "" || password === ""}
        color="primary"
        extended
      >
        <Label>Google</Label>
      </Fab>
      <Fab
        on:click={doLogin}
        disabled={email === "" || password === ""}
        color="primary"
        extended
      >
        <Label>Apple</Label>
      </Fab>
      <Fab
        on:click={doLogin}
        disabled={email === "" || password === ""}
        color="primary"
        extended
      >
        <Label>Facebook</Label>
      </Fab>
      <Separator />
      <div class="row">
        Oder logge dich ein
        <Textfield
          variant="outlined"
          label="Email"
          bind:value={email}
          type="email"
          input$autocomplete="email"
          bind:invalid
        >
          <Icon class="material-icons" slot="leadingIcon">email</Icon>
        </Textfield>
        <Textfield
          variant="outlined"
          label="Passwort"
          bind:value={password}
          type="password"
          input$autocomplete="password"
          bind:invalid
        >
          <Icon class="material-icons" slot="leadingIcon">key</Icon>
        </Textfield>
        Registrieren / Passwort vergessen
        <Fab
          on:click={doLogin}
          disabled={email === "" || password === ""}
          color="primary"
          mini
        >
          <Icon class="material-icons">arrow_forward</Icon>
        </Fab>
      </div>
    </Content>
  </Paper>
</div>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .row {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  * :global(.paper-demo) {
    max-width: 600px;
  }
</style>
