import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: './src',
    base: '',
    plugins: [vue()],
  })
}
