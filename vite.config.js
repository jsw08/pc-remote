import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from 'unocss/vite'
import presetUno from 'unocss/preset-uno'
import presetIcons from 'unocss/preset-icons'
import extractorSvelte from '@unocss/extractor-svelte'
import transformerDirectives from '@unocss/transformer-directives'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [
        presetUno(),
        presetIcons()
      ],
      extractors: [
        extractorSvelte()
      ],
      transformers: [
        transformerDirectives()
      ]
    }),
    svelte()
  ],
})
