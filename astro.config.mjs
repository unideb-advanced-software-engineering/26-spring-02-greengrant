// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import markdoc from "@astrojs/markdoc";

import react from "@astrojs/react";
import { LikeC4VitePlugin } from "likec4/vite-plugin";

// https://astro.build/config
export default defineConfig({
  site: "https://unideb-advanced-software-engineering.github.io",
  base: "/26-spring-02-greengrant",
  vite: {
    plugins: [LikeC4VitePlugin({}),],
  },
  integrations: [starlight({
    title: "GreenGrant",
    social: [
      {
        icon: "github",
        label: "GitHub",
        href: "https://github.com/unideb-advanced-software-engineering/26-spring-02-greengrant",
      },
    ],
    sidebar: [
      {
          label: "Guides",
          autogenerate: { directory: "guides" },
      },
      {
        label: "Requirements",
        autogenerate: { directory: "requirements" },
      },
      {
        label: "Architecture",
        autogenerate: { directory: "architecture" },
      },
      {
        label: "Diagrams",
        autogenerate: { directory: "diagrams" },
      },
      {
        label: "Decision Records",
        autogenerate: { directory: "adrs" },
      },
    ],
  }), react(), markdoc()],
});