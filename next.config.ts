import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drop the `X-Powered-By: Next.js` response header.
  poweredByHeader: false,

  // better-sqlite3 ships a native .node binding — keep it out of any bundling
  // step so the server build references node_modules directly instead of
  // trying to package the binary. Verified against this Next version's own
  // config-shared.d.ts (the option's name/location has moved across
  // versions); functions with or without this in local testing, but it's the
  // documented way to keep a native dep server-only for production/Railway.
  serverExternalPackages: ["better-sqlite3"],

  compiler: {
    // Strip `console.*` from production bundles, keeping error/warn for
    // monitoring. Left on in dev so logs stay available.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    // Modern formats — smaller than JPEG/PNG; the browser picks what it supports.
    formats: ["image/avif", "image/webp"],
    // Breakpoints `next/image` uses to build `srcset`. `deviceSizes` covers
    // full-width images (aligned with the adaptive-grid breakpoints + retina);
    // `imageSizes` covers smaller, fixed-width images and icons.
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 30 is used by the Works cylinder cards (src/views/works.tsx) alongside the
    // default 75 elsewhere.
    qualities: [30, 75],
  },

  // React Compiler (automatic memoisation) is an opt-in performance win.
  // It requires the `babel-plugin-react-compiler` dev dependency and routes
  // the build through Babel — enable once installed:
  // reactCompiler: true,
};

export default nextConfig;
