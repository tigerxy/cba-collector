<script lang="ts">
  import Drawer, {
    Content,
    Header,
    Scrim,
    Subtitle,
    Title,
  } from "@smui/drawer";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import { t } from "svelte-i18n";
  import { navigateTo } from "svelte-router-spa";
  import { realmUser } from "../store/auth";

  const pages = ["overview", "areas"];
  let currentRoute = "";

  export let open = false;
  async function logoutAndClose() {
    realmUser.logout();
    open = false;
    navigateTo("/");
  }
</script>

<Drawer variant="modal" bind:open>
  <Header>
    <Title>Menü</Title>
    <Subtitle>CBA Collector ist spitze!</Subtitle>
  </Header>
  <Content>
    <List>
      {#each pages as page}
        <Item href="/{page}" activated={false}>
          <Graphic class="material-icons" aria-hidden="true">{page}</Graphic>
          <Text>{page}</Text>
        </Item>
      {/each}
      <Separator />
      <Item on:click={logoutAndClose}>
        <Graphic class="material-icons" aria-hidden="true">logout</Graphic>
        <Text>{$t("logout")}</Text>
      </Item>
    </List>
  </Content>
</Drawer>

<Scrim />
