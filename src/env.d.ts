/// <reference types="astro/client" />

declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  export { z } from 'astro/zod';

  type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

  export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

  export type ContentCollectionKey = keyof AnyEntryMap;

  export type AnyEntryMap = {
    blog: {
      id: string;
      slug: string;
      body: string;
      collection: "blog";
      data: {
        title: string;
        pubDate: Date;
        description: string;
        author: string;
        image: { url: string; alt: string };
        tags: string[];
      };
    };
    projects: {
      id: string;
      slug: string;
      body: string;
      collection: "projects";
      data: {
        title: string;
        year: number;
        description: string;
        heroImage: string;
        heroImageAlign?: "center" | "top" | "bottom";
      };
    };
  };
} 