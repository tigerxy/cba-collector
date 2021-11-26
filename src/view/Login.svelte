<script lang="ts">
  import { mdiFacebook, mdiGoogle } from "@mdi/js";
  import Button from "@smui/button";
  import { Icon } from "@smui/common";
  import { Svg } from "@smui/common/elements";
  import { Label } from "@smui/fab";
  import { Separator } from "@smui/list";
  import { Content, Title } from "@smui/paper";
  import Textfield from "@smui/textfield";
  import * as Realm from "realm-web";
  import { t } from "svelte-i18n";
  import { navigateTo } from "svelte-router-spa";
  import { realmUser } from "../store/auth";

  const redirectUri = window.location.origin + "/handleOAuthLogin";

  const doLoginWithGoogle = () =>
    realmUser.login(Realm.Credentials.google(redirectUri));

  const doLoginWithFacebook = () =>
    realmUser.login(Realm.Credentials.facebook(redirectUri));

  const doLogin = () =>
    realmUser
      .login(Realm.Credentials.emailPassword(email, password))
      .then(() => navigateTo("/"))
      .catch((err) => {
        invalid = true;
      });

  let email = "";
  let password = "";
  let invalid = false;
</script>

<Button class="google-button" variant="raised" on:click={doLoginWithGoogle}>
  <Icon component={Svg} viewBox="0 0 24 24">
    <path fill="currentColor" d={mdiGoogle} />
  </Icon>
  <Label>Anmelden mit Google</Label>
</Button>
<Button class="facebook-button" variant="raised" on:click={doLoginWithFacebook}>
  <Icon component={Svg} viewBox="0 0 24 24">
    <path fill="currentColor" d={mdiFacebook} />
  </Icon>
  <Label>Anmelden mit Facebook</Label>
</Button>
<Separator />
<Textfield
  style="width: 100%;"
  variant="outlined"
  label="Email"
  bind:value={email}
  type="email"
  input$autocomplete="email"
  bind:invalid
/>
<Textfield
  style="width: 100%;"
  variant="outlined"
  label={$t("password")}
  bind:value={password}
  type="password"
  input$autocomplete="current-password"
  bind:invalid
/>
<Button style="width: 100%;" on:click={doLogin} variant="raised">
  <Label>{$t("login")}</Label>
</Button>
<Separator />
<Button style="width: 100%;" color="secondary" on:click={() => navigateTo("password-reset")}>
  <Label>{$t("reset_password")}</Label>
</Button>
<Separator />
<Button style="width: 100%;" color="secondary" on:click={() => navigateTo("register")} variant="raised">
  <Label>{$t("register")}</Label>
</Button>

<style>
  * :global(.google-button) {
    background-color: red;
  }
  * :global(.facebook-button) {
    background-color: blue;
  }
</style>