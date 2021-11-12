import type * as Realm from "realm-web";
import { derived } from "svelte/store";
import { realmUser } from "./auth";

const getDB = (user: Realm.User) => user.mongoClient("mongodb-atlas").db("cba");

type Area = {
  _id: string;
  name: string;
};

type TreePile = {
  _id: string;
  name: string;
};

type CollectionPoint = {
  _id: string;
  name: string;
};

export const areas = derived(realmUser, ($realmUser) =>
  getDB($realmUser).collection<Area>("areas").find()
);

export const treePiles = derived(realmUser, ($realmUser) =>
  getDB($realmUser).collection<TreePile>("tree-piles").find()
);

export const collectionPoints = derived(realmUser, ($realmUser) =>
  getDB($realmUser).collection<CollectionPoint>("collection-points").find()
);
