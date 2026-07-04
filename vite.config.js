import { defineConfig } from 'vite'

// GitHub Pages serves this repo at /de-pauli-auto-center-website/ until a
// custom domain is configured (see .github/workflows/deploy.yml). The build
// picks up that subpath, while `npm run dev` keeps running at the site root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/de-pauli-auto-center-website/' : '/',
}))
