/// <reference types="vite/client" />
// filepath: src/vite-env.d.ts
interface ImportMeta {
  globEager: (pattern: string) => Record<string, { [key: string]: any }>;
}