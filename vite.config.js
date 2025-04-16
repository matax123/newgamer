import { preview } from "astro";

export default {
    server: {
      allowedHosts: [
        'newgamer.cl',
      ],
    },
    preview: {
        allowedHosts: true
    }
  }
  