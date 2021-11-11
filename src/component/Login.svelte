<script lang="ts">
  import { mdiFacebook, mdiGoogle } from "@mdi/js";
  import Button from "@smui/button";
  import { Icon } from "@smui/common";
  import { Svg } from "@smui/common/elements";
  import Fab, { Label } from "@smui/fab";
  import { Separator } from "@smui/list";
  import Paper, { Content, Title } from "@smui/paper";
  import Textfield from "@smui/textfield";
  import * as Realm from "realm-web";
  import { realmUser } from "../store/auth";

  // FIXME: Don't call this every time!
  Realm.handleAuthRedirect();
  const redirectUri = window.location.toString();

  const doLoginWithGoogle = () =>
    realmUser.login(Realm.Credentials.google(redirectUri));

  const doLoginWithFacebook = () =>
    realmUser.login(Realm.Credentials.facebook(redirectUri));

  const doLogin = () =>
    realmUser.login(Realm.Credentials.emailPassword(email, password));

  let email = "";
  let password = "";
  let invalid = false;
</script>

<div class="login-container">
  <Paper class="paper-demo">
    <Title>Login</Title>
    <Content>
      <Button variant="raised" on:click={doLoginWithGoogle}>
        <Icon component={Svg} viewBox="0 0 24 24">
          <path fill="currentColor" d={mdiGoogle} />
        </Icon>
        <Label>Google</Label>
      </Button>
      <Button variant="raised" on:click={doLoginWithFacebook}>
        <Icon component={Svg} viewBox="0 0 24 24">
          <path fill="currentColor" d={mdiFacebook} />
        </Icon>
        <Label>Facebook</Label>
      </Button>
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
