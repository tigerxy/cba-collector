import type { Route } from "svelte-router-spa/types/components/router";
import ConfirmEmail from "./handler/ConfirmEmail.svelte";
import OAuthLogin from "./handler/OAuthLogin.svelte";
import ResetPassword from "./handler/ResetPassword.svelte";
import ErrorLayout from "./layout/ErrorLayout.svelte";
import LoggedOutLayout from "./layout/LoggedOutLayout.svelte";
import MainLayout from "./layout/MainLayout.svelte";
import { loggedIn } from "./store/auth";
import Areas from "./view/Areas.svelte";
import Login from "./view/Login.svelte";
import NotFound from "./view/NotFound.svelte";
import Overview from "./view/Overview.svelte";
import Register from "./view/Register.svelte";

const routes: Route[] = [
  {
    name: "/",
    layout: MainLayout,
    onlyIf: { guard: loggedIn, redirect: "/login" },
    redirectTo: "overview",
  },
  {
    name: "login",
    component: Login,
    layout: LoggedOutLayout,
    lang: { de: "anmelden" },
  },
  {
    name: "register",
    component: Register,
    layout: LoggedOutLayout,
    lang: { de: "registrieren" },
  },
  {
    name: "oauth-login",
    layout: LoggedOutLayout,
    component: OAuthLogin,
  },
  {
    name: "confirm-email",
    layout: LoggedOutLayout,
    component: ConfirmEmail,
  },
  {
    name: "reset-password",
    layout: LoggedOutLayout,
    component: ResetPassword,
  },
  {
    name: "overview",
    component: Overview,
    layout: MainLayout,
    onlyIf: { guard: loggedIn, redirect: "/login" },
    lang: { de: "uebersicht" },
  },
  {
    name: "areas",
    component: Areas,
    layout: MainLayout,
    onlyIf: { guard: loggedIn, redirect: "/login" },
    lang: { de: "gebiete" },
  },
  {
    name: "404",
    layout: ErrorLayout,
    component: NotFound,
  },
];

export { routes };
