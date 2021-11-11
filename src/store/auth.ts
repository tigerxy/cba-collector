import { App, User } from "realm-web";
import { writable } from "svelte/store";

function createRealmUser() {
  const app: App = new App({ id: "cba-collector-fiqgw" });

  const { subscribe, set, update } = writable(app.currentUser);

  return {
    subscribe,
    login: (credentials: Realm.Credentials<any>) => {
      app.logIn(credentials).then((user: User) => {
        set(user);
        console.log(`Successfully loggedin with user ${user.id}`);
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
