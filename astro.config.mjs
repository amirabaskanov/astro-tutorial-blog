// @ts-check
import { defineConfig } from "astro/config";
import { envField } from "astro/config";

import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-tutorial-amir.netlify.app/",
  integrations: [preact(),],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      MAPTILER_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
    },
},

  adapter: netlify(),
});