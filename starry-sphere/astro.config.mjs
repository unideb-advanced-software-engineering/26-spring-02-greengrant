// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
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
          label: "Requirements",
          autogenerate: { directory: "requirements" },
        },
        {
          label: "Architecture",
          autogenerate: { directory: "architecture" },
        },
        {
          label: "Decision Records",
          autogenerate: { directory: "adrs" },
        },
      ],
    }),
  ],
});
