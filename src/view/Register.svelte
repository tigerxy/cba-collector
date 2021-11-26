<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Textfield from "@smui/textfield";
  import { App } from "realm-web";
  import { t } from "svelte-i18n";

  const app: App = new App({ id: "cba-collector-fiqgw" });

  const doRegister = () => {
    registerSend = true;
    app.emailPasswordAuth.registerUser(email, password);
  };

  const doResendConfirmation = () =>
    app.emailPasswordAuth.resendConfirmationEmail(email);

  let email = "";
  let password = "";
  let invalid = false;
  let registerSend = false;
</script>

  {#if registerSend}
    <Button color="secondary" on:click={doResendConfirmation} variant="raised">
      <Label>{$t("retry_register")}</Label>
    </Button>
  {:else}
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
      input$autocomplete="new-password"
      bind:invalid
    />
    <Textfield
      style="width: 100%;"
      variant="outlined"
      label={$t("repeat_password")}
      bind:value={password}
      type="password"
      input$autocomplete="new-password"
      bind:invalid
    />
    <Button style="width: 100%;" on:click={doRegister} variant="raised">
      <Label>{$t("register")}</Label>
    </Button>
  {/if}
