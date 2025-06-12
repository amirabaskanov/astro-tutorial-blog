// @ts-check
import { defineConfig } from "astro/config";
import { envField } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";
import path from "path";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-tutorial-amir.netlify.app/",
  integrations: [
    // Configure Preact for specific components
    preact({
      include: ['**/Preact/**/*.tsx', '**/Preact/**/*.jsx']
    }),
    // Configure React for specific components
    react({
      include: ['**/React/**/*.tsx', '**/React/**/*.jsx', '**/bento/**/*.tsx', '**/Bento/**/*.tsx']
    }),
    // Add Tailwind integration
    tailwind()
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  },

  env: {
    schema: {
      MAPTILER_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
      MONKEYTYPE_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
    },
  },

  adapter: netlify(),
});