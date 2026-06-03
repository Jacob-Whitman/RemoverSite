import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path configuration:
// - Use '/' for custom domain or org/user Pages root (e.g. baseline-solutions.github.io)
// - Use '/<repo-name>/' for project Pages without a custom domain
//   (e.g. github.com/company/baseline-privacy-removal → '/baseline-privacy-removal/')
// Set VITE_BASE_PATH in your GitHub Actions workflow accordingly.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
