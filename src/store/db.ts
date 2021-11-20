import type * as Realm from "realm-web";
import { derived } from "svelte/store";
import { realmUser } from "./auth";

const getDB = (user: Realm.User) => user.mongoClient("mongodb-atlas").db("cba");

const COLLECTION_POINTS = "collection-points";
const AREAS = "areas";

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

export const areas = derived(realmUser, async ($realmUser) => {
  const areasLs = localStorage.getItem(AREAS);
  if (areasLs) {
    return JSON.parse(areasLs);
  }

  const areasDb = await getDB($realmUser).collection<Area>(AREAS).find();
  localStorage.setItem(AREAS, JSON.stringify(areasDb));
  return areasDb;
});

export const collectionPoints = derived(realmUser, async ($realmUser) => {
  const areasLs = localStorage.getItem(COLLECTION_POINTS);
  if (areasLs) {
    return JSON.parse(areasLs);
  }

  const pointsDb = await getDB($realmUser)
    .collection<CollectionPoint>(COLLECTION_POINTS)
    .find();
  localStorage.setItem(COLLECTION_POINTS, JSON.stringify(pointsDb));
  return pointsDb;
});

export const treePiles = derived(realmUser, ($realmUser) =>
  getDB($realmUser).collection<TreePile>("tree-piles").find()
);
