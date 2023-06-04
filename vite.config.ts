import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import solidPlugin from 'vite-plugin-solid'
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCSS({
      presets: [presetUno()],
      safelist: [...Array.from({ length: 12 }).map((_, i) => `rotate-${i * 30}`)],
    }),
    tsconfigPaths(),
  ],
})
