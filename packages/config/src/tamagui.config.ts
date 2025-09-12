import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'
import {} from '@tamagui/themes'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'
import { themes } from './themes'

export const config = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes: themes,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
})
