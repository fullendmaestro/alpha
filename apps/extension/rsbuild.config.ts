import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginWebExtension } from 'rsbuild-plugin-web-extension'
import manifest from './manifest'

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr(),
    pluginWebExtension({
      manifest,
    }),
  ],
})
