import App from "./App.svelte";
import { addMessages, init } from "svelte-i18n";

import en from "./locales/en.json";
import de from "./locales/de.json";

addMessages("en", en);
addMessages("de", de);

init({
  // fallback to en if current locale is not in the dictionary
  fallbackLocale: 'en',
  initialLocale: 'de',
})

const app = new App({
  target: document.body,
});

export default app;
