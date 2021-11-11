import { writable } from "svelte/store";

export const realmUser = writable(null);

export function logout() {
  realmUser.set(null);
}