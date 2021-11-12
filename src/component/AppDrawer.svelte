<script lang="ts">
  import Drawer, {
    Content,
    Header,
    Scrim,
    Subtitle,
    Title,
  } from "@smui/drawer";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import type { Page } from "../global";
  import { realmUser } from "../store/auth";

  export let open = false;
  export let active: Page = "start";
  function setActive(value: Page) {
    active = value;
    open = false;
  }
  async function logoutAndClose() {
    realmUser.logout();
    open = false;
  }
</script>

<!-- Don't include fixed={false} if this is a page wide drawer.
        It adds a style for absolute positioning. -->
<Drawer variant="modal" fixed={false} bind:open>
  <Header>
    <Title>Super Mail</Title>
    <Subtitle>It's the best fake mail app drawer.</Subtitle>
  </Header>
  <Content>
    <List>
      <Item
        href="javascript:void(0)"
        on:click={() => setActive("start")}
        activated={active === "start"}
      >
        <Graphic class="material-icons" aria-hidden="true">inbox</Graphic>
        <Text>Inbox</Text>
      </Item>
      <Item
        href="javascript:void(0)"
        on:click={() => setActive("areas")}
        activated={active === "areas"}
      >
        <Graphic class="material-icons" aria-hidden="true">star</Graphic>
        <Text>Star</Text>
      </Item>
      <Separator />
      <Item on:click={logoutAndClose}>
        <Graphic class="material-icons" aria-hidden="true">logout</Graphic>
        <Text>Abmelden</Text>
      </Item>
    </List>
  </Content>
</Drawer>

<!-- Don't include fixed={false} if this is a page wide drawer.
                          It adds a style for absolute positioning. -->
<Scrim fixed={false} />
