/// <reference types="svelte" />

declare module "*.svg?inline" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

export type Page = "start" | "areas";
