import { App, User } from "realm-web";
import { writable, get } from "svelte/store";

function createRealmUser() {
  const app: App = new App({ id: "cba-collector-fiqgw" });

  const { subscribe, set, update } = writable(app.currentUser);

  return {
    subscribe,
    login: (credentials: Realm.Credentials<any>): Promise<void> => {
      return new Promise((resolve, reject) => {
        app
          .logIn(credentials)
          .then((user: User) => {
            set(user);
            console.log(`Successfully loggedin with user ${user.id}`);
            resolve();
          })
          .catch(reject);
      });
    },
    logout: () =>
      update((user: User) => {
        user.logOut().then(() => {
          console.log(`Successfully logged out with user ${user.id}`);
        });
        return null;
      }),
  };
}

export const realmUser = createRealmUser();

export function getRealmUser() {
  return get(realmUser);
}

export function loggedIn() {
  return getRealmUser() !== null;
}
export function loggedOut() {
  return getRealmUser() === null;
}
