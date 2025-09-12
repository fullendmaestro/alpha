import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  orange,
  orangeDark,
  pink,
  pinkDark,
  purple,
  purpleDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'
import { createThemeBuilder } from '@tamagui/theme-builder'
import type { Variable } from '@tamagui/web'
import { createTokens } from '@tamagui/web'

// Healthcare-focused color palette based on design system
const hoovaPrimary = {
  hoovaPrimary1: '#FEFEFF',
  hoovaPrimary2: '#F8F7FE',
  hoovaPrimary3: '#F1EFFD',
  hoovaPrimary4: '#E9E5FB',
  hoovaPrimary5: '#DFD8F9',
  hoovaPrimary6: '#D3C8F6',
  hoovaPrimary7: '#C4B3F2',
  hoovaPrimary8: '#B098ED',
  hoovaPrimary9: '#7A58E3',
  hoovaPrimary10: '#6B4DD6',
  hoovaPrimary11: '#5D42C9',
  hoovaPrimary12: '#2D1B69',
}

const hoovaPrimaryDark = {
  hoovaPrimary1: '#0F0A1A',
  hoovaPrimary2: '#1A1330',
  hoovaPrimary3: '#241C46',
  hoovaPrimary4: '#2E255C',
  hoovaPrimary5: '#382E72',
  hoovaPrimary6: '#423788',
  hoovaPrimary7: '#4C409E',
  hoovaPrimary8: '#5649B4',
  hoovaPrimary9: '#7A58E3',
  hoovaPrimary10: '#8B6FE8',
  hoovaPrimary11: '#9C86ED',
  hoovaPrimary12: '#E9E5FB',
}

const hoovaBlue = {
  hoovaBlue1: '#FBFCFF',
  hoovaBlue2: '#F4F7FE',
  hoovaBlue3: '#EDF2FD',
  hoovaBlue4: '#E5EDFC',
  hoovaBlue5: '#DCE7FB',
  hoovaBlue6: '#D1E0FA',
  hoovaBlue7: '#C4D7F8',
  hoovaBlue8: '#B4CCF6',
  hoovaBlue9: '#4B58FA',
  hoovaBlue10: '#3E4BF0',
  hoovaBlue11: '#323EE6',
  hoovaBlue12: '#0F1B4D',
}

const hoovaBlueDark = {
  hoovaBlue1: '#07104E',
  hoovaBlue2: '#0C1963',
  hoovaBlue3: '#112278',
  hoovaBlue4: '#162B8D',
  hoovaBlue5: '#1B34A2',
  hoovaBlue6: '#203DB7',
  hoovaBlue7: '#2546CC',
  hoovaBlue8: '#2A4FE1',
  hoovaBlue9: '#4B58FA',
  hoovaBlue10: '#6570FB',
  hoovaBlue11: '#7F88FC',
  hoovaBlue12: '#EDF2FD',
}

const hoovaNavy = {
  hoovaNavy1: '#FAFBFD',
  hoovaNavy2: '#F2F4F9',
  hoovaNavy3: '#EAECF5',
  hoovaNavy4: '#E1E5F1',
  hoovaNavy5: '#D8DDEC',
  hoovaNavy6: '#CED4E7',
  hoovaNavy7: '#C3CAE2',
  hoovaNavy8: '#B6BFDC',
  hoovaNavy9: '#07104E',
  hoovaNavy10: '#061044',
  hoovaNavy11: '#050E3A',
  hoovaNavy12: '#020619',
}

const hoovaNavyDark = {
  hoovaNavy1: '#020619',
  hoovaNavy2: '#050E3A',
  hoovaNavy3: '#061044',
  hoovaNavy4: '#07104E',
  hoovaNavy5: '#0A1658',
  hoovaNavy6: '#0D1C62',
  hoovaNavy7: '#10226C',
  hoovaNavy8: '#132876',
  hoovaNavy9: '#07104E',
  hoovaNavy10: '#1A3280',
  hoovaNavy11: '#21408A',
  hoovaNavy12: '#CED4E7',
}

const hoovaAccent = {
  hoovaAccent1: '#FFFCF7',
  hoovaAccent2: '#FFF7E7',
  hoovaAccent3: '#FFF1D7',
  hoovaAccent4: '#FFEBC7',
  hoovaAccent5: '#FFE4B7',
  hoovaAccent6: '#FFDCA7',
  hoovaAccent7: '#FFD397',
  hoovaAccent8: '#FFC987',
  hoovaAccent9: '#FFC79A',
  hoovaAccent10: '#FFBF77',
  hoovaAccent11: '#FFB654',
  hoovaAccent12: '#8A5600',
}

const hoovaAccentDark = {
  hoovaAccent1: '#1F1300',
  hoovaAccent2: '#332000',
  hoovaAccent3: '#472D00',
  hoovaAccent4: '#5B3A00',
  hoovaAccent5: '#6F4700',
  hoovaAccent6: '#835400',
  hoovaAccent7: '#976100',
  hoovaAccent8: '#AB6E00',
  hoovaAccent9: '#FFC79A',
  hoovaAccent10: '#FFD1A8',
  hoovaAccent11: '#FFDBB6',
  hoovaAccent12: '#FFF1D7',
}

const colorTokens = {
  light: {
    blue,
    gray,
    green,
    orange,
    pink,
    purple,
    red,
    yellow,
    hoovaPrimary,
    hoovaBlue,
    hoovaNavy,
    hoovaAccent,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    green: greenDark,
    orange: orangeDark,
    pink: pinkDark,
    purple: purpleDark,
    red: redDark,
    yellow: yellowDark,
    hoovaPrimary: hoovaPrimaryDark,
    hoovaBlue: hoovaBlueDark,
    hoovaNavy: hoovaNavyDark,
    hoovaAccent: hoovaAccentDark,
  },
}

// Healthcare-focused shadow system
const lightShadowColor = 'rgba(122, 88, 227, 0.08)' // Subtle purple shadow
const lightShadowColorStrong = 'rgba(122, 88, 227, 0.15)' // Stronger purple shadow
const darkShadowColor = 'rgba(0, 0, 0, 0.25)'
const darkShadowColorStrong = 'rgba(0, 0, 0, 0.4)'

const darkColors = {
  ...colorTokens.dark.blue,
  ...colorTokens.dark.gray,
  ...colorTokens.dark.green,
  ...colorTokens.dark.orange,
  ...colorTokens.dark.pink,
  ...colorTokens.dark.purple,
  ...colorTokens.dark.red,
  ...colorTokens.dark.yellow,
  ...colorTokens.dark.hoovaPrimary,
  ...colorTokens.dark.hoovaBlue,
  ...colorTokens.dark.hoovaNavy,
  ...colorTokens.dark.hoovaAccent,
}

const lightColors = {
  ...colorTokens.light.blue,
  ...colorTokens.light.gray,
  ...colorTokens.light.green,
  ...colorTokens.light.orange,
  ...colorTokens.light.pink,
  ...colorTokens.light.purple,
  ...colorTokens.light.red,
  ...colorTokens.light.yellow,
  ...colorTokens.light.hoovaPrimary,
  ...colorTokens.light.hoovaBlue,
  ...colorTokens.light.hoovaNavy,
  ...colorTokens.light.hoovaAccent,
}

const color = {
  white0: 'rgba(255,255,255,0)',
  white075: 'rgba(255,255,255,0.75)',
  white05: 'rgba(255,255,255,0.5)',
  white025: 'rgba(255,255,255,0.25)',
  black0: 'rgba(7,16,78,0)', // Using navy instead of pure black for healthcare theme
  black075: 'rgba(7,16,78,0.75)',
  black05: 'rgba(7,16,78,0.5)',
  black025: 'rgba(7,16,78,0.25)',
  white1: '#FFFFFF',
  white2: '#FEFEFF', // Slightly warmer white
  white3: '#F8F7FE', // Light purple tint
  white4: '#F1EFFD',
  white5: '#E9E5FB',
  white6: '#DFD8F9',
  white7: '#D3C8F6',
  white8: '#C4B3F2',
  white9: '#B098ED',
  white10: '#7A58E3', // Primary purple
  white11: '#5D42C9',
  white12: '#2D1B69',
  black1: '#07104E', // Healthcare navy
  black2: '#0C1963',
  black3: '#112278',
  black4: '#162B8D',
  black5: '#1B34A2',
  black6: '#203DB7',
  black7: '#2546CC',
  black8: '#2A4FE1',
  black9: '#4B58FA', // Healthcare blue
  black10: '#3E4BF0',
  black11: '#323EE6',
  black12: '#FFFFFF',
  ...postfixObjKeys(lightColors, 'Light'),
  ...postfixObjKeys(darkColors, 'Dark'),
}

export const palettes = (() => {
  const transparent = (hsl: string, opacity = 0) =>
    hsl.replace(`%)`, `%, ${opacity})`).replace(`hsl(`, `hsla(`)

  const getColorPalette = (colors: Object): string[] => {
    const colorPalette = Object.values(colors)
    // make the transparent color vibrant and towards the middle
    const colorI = colorPalette.length - 4

    // add our transparent colors first/last
    // and make sure the last (foreground) color is white/black rather than colorful
    // this is mostly for consistency with the older theme-base
    return [
      transparent(colorPalette[0], 0),
      transparent(colorPalette[0], 0.25),
      transparent(colorPalette[0], 0.5),
      transparent(colorPalette[0], 0.75),
      ...colorPalette,
      transparent(colorPalette[colorI], 0.75),
      transparent(colorPalette[colorI], 0.5),
      transparent(colorPalette[colorI], 0.25),
      transparent(colorPalette[colorI], 0),
    ]
  }

  const lightPalette = [
    color.white0,
    color.white075,
    color.white05,
    color.white025,
    color.white1,
    color.white2,
    color.white3,
    color.white4,
    color.white5,
    color.white6,
    color.white7,
    color.white8,
    color.white9,
    color.white10,
    color.white11,
    color.white12,
    color.black075,
    color.black05,
    color.black025,
    color.black0,
  ]

  const darkPalette = [
    color.black0,
    color.black075,
    color.black05,
    color.black025,
    color.black1,
    color.black2,
    color.black3,
    color.black4,
    color.black5,
    color.black6,
    color.black7,
    color.black8,
    color.black9,
    color.black10,
    color.black11,
    color.black12,
    color.white075,
    color.white05,
    color.white025,
    color.white0,
  ]

  const lightPalettes = objectFromEntries(
    objectKeys(colorTokens.light).map(
      (key) => [`light_${key}`, getColorPalette(colorTokens.light[key])] as const
    )
  )

  const darkPalettes = objectFromEntries(
    objectKeys(colorTokens.dark).map(
      (key) => [`dark_${key}`, getColorPalette(colorTokens.dark[key])] as const
    )
  )

  const colorPalettes = {
    ...lightPalettes,
    ...darkPalettes,
  }

  return {
    light: lightPalette,
    dark: darkPalette,
    ...colorPalettes,
  }
})()

export const templates = (() => {
  const transparencies = 3

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const base = {
    background0: 0,
    background025: 1,
    background05: 2,
    background075: 3,
    color1: transparencies + 1,
    color2: transparencies + 2,
    color3: transparencies + 3,
    color4: transparencies + 4,
    color5: transparencies + 5,
    color6: transparencies + 6,
    color7: transparencies + 7,
    color8: transparencies + 8,
    color9: transparencies + 9,
    color10: transparencies + 10,
    color11: transparencies + 11,
    color12: transparencies + 12,
    color0: -0,
    color025: -1,
    color05: -2,
    color075: -3,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: transparencies + 1,
    backgroundHover: transparencies + 2,
    backgroundPress: transparencies + 3,
    backgroundFocus: transparencies + 1,
    borderColor: transparencies + 4,
    borderColorHover: transparencies + 5,
    borderColorFocus: transparencies + 2,
    borderColorPress: transparencies + 4,
    color: -transparencies - 1,
    colorHover: -transparencies - 2,
    colorPress: -transparencies - 1,
    colorFocus: -transparencies - 2,
    colorTransparent: -0,
    placeholderColor: -transparencies - 4,
    outlineColor: -1,
  }

  const surface1 = {
    background: base.background + 1,
    backgroundHover: base.backgroundHover + 1,
    backgroundPress: base.backgroundPress + 1,
    backgroundFocus: base.backgroundFocus + 1,
    borderColor: base.borderColor + 1,
    borderColorHover: base.borderColorHover + 1,
    borderColorFocus: base.borderColorFocus + 1,
    borderColorPress: base.borderColorPress + 1,
  }

  const surface2 = {
    background: base.background + 2,
    backgroundHover: base.backgroundHover + 2,
    backgroundPress: base.backgroundPress + 2,
    backgroundFocus: base.backgroundFocus + 2,
    borderColor: base.borderColor + 2,
    borderColorHover: base.borderColorHover + 2,
    borderColorFocus: base.borderColorFocus + 2,
    borderColorPress: base.borderColorPress + 2,
  }

  const surface3 = {
    background: base.background + 3,
    backgroundHover: base.backgroundHover + 3,
    backgroundPress: base.backgroundPress + 3,
    backgroundFocus: base.backgroundFocus + 3,
    borderColor: base.borderColor + 3,
    borderColorHover: base.borderColorHover + 3,
    borderColorFocus: base.borderColorFocus + 3,
    borderColorPress: base.borderColorPress + 3,
  }

  const surfaceActive = {
    background: base.background + 5,
    backgroundHover: base.background + 5,
    backgroundPress: base.backgroundPress + 5,
    backgroundFocus: base.backgroundFocus + 5,
    borderColor: base.borderColor + 5,
    borderColorHover: base.borderColor + 5,
    borderColorFocus: base.borderColorFocus + 5,
    borderColorPress: base.borderColorPress + 5,
  }

  const inverseSurface1 = {
    color: surface1,
    colorHover: surface1.backgroundHover,
    colorPress: surface1.backgroundPress,
    colorFocus: surface1.backgroundFocus,
    background: base.color,
    backgroundHover: base.colorHover,
    backgroundPress: base.colorPress,
    backgroundFocus: base.colorFocus,
    borderColor: base.color - 2,
    borderColorHover: base.color - 3,
    borderColorFocus: base.color - 4,
    borderColorPress: base.color - 5,
  }

  const inverseActive = {
    ...inverseSurface1,
    background: base.color - 2,
    backgroundHover: base.colorHover - 2,
    backgroundPress: base.colorPress - 2,
    backgroundFocus: base.colorFocus - 2,
    borderColor: base.color - 2 - 2,
    borderColorHover: base.color - 3 - 2,
    borderColorFocus: base.color - 4 - 2,
    borderColorPress: base.color - 5 - 2,
  }

  const alt1 = {
    color: base.color - 1,
    colorHover: base.colorHover - 1,
    colorPress: base.colorPress - 1,
    colorFocus: base.colorFocus - 1,
  }

  const alt2 = {
    color: base.color - 2,
    colorHover: base.colorHover - 2,
    colorPress: base.colorPress - 2,
    colorFocus: base.colorFocus - 2,
  }

  return {
    base,
    alt1,
    alt2,
    surface1,
    surface2,
    surface3,
    inverseSurface1,
    inverseActive,
    surfaceActive,
  }
})()

const shadows = {
  light: {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
  },
  dark: {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor,
  },
}

const nonInherited = {
  light: {
    ...lightColors,
    ...shadows.light,
  },
  dark: {
    ...darkColors,
    ...shadows.dark,
  },
}

const overlayThemeDefinitions = [
  {
    parent: 'light',
    theme: {
      background: 'rgba(7, 16, 78, 0.6)', // Navy overlay for healthcare theme
    },
  },
  {
    parent: 'dark',
    theme: {
      background: 'rgba(0, 0, 0, 0.8)',
    },
  },
]

const inverseSurface1 = [
  {
    parent: 'active',
    template: 'inverseActive',
  },
  {
    parent: '',
    template: 'inverseSurface1',
  },
] as any

const surface1 = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surface1',
  },
] as any

const surface2 = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surface2',
  },
] as any

const surface3 = [
  {
    parent: 'active',
    template: 'surfaceActive',
  },
  {
    parent: '',
    template: 'surface3',
  },
] as any

// --- themeBuilder ---

const themeBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: nonInherited.light,
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: nonInherited.dark,
    },
  })
  .addChildThemes({
    // Hoova-specific themes first (primary themes)
    hoovaPrimary: {
      palette: 'hoovaPrimary',
      template: 'base',
    },
    hoovaBlue: {
      palette: 'hoovaBlue',
      template: 'base',
    },
    hoovaNavy: {
      palette: 'hoovaNavy',
      template: 'base',
    },
    hoovaAccent: {
      palette: 'hoovaAccent',
      template: 'base',
    },
    // Standard color themes
    orange: {
      palette: 'orange',
      template: 'base',
    },
    yellow: {
      palette: 'yellow',
      template: 'base',
    },
    green: {
      palette: 'green',
      template: 'base',
    },
    blue: {
      palette: 'blue',
      template: 'base',
    },
    purple: {
      palette: 'purple',
      template: 'base',
    },
    pink: {
      palette: 'pink',
      template: 'base',
    },
    red: {
      palette: 'red',
      template: 'base',
    },
    gray: {
      palette: 'gray',
      template: 'base',
    },
  })
  .addChildThemes({
    alt1: {
      template: 'alt1',
    },
    alt2: {
      template: 'alt2',
    },
    active: {
      template: 'surface3',
    },
  })
  .addChildThemes(
    {
      // Healthcare-focused component themes
      ListItem: {
        template: 'surface1',
      },
      SelectTrigger: surface1,
      Card: surface1,
      Button: surface3, // More prominent for healthcare CTAs
      Checkbox: surface2,
      Switch: surface2,
      SwitchThumb: inverseSurface1,
      TooltipContent: surface2,
      DrawerFrame: {
        template: 'surface1',
      },
      Progress: {
        template: 'surface1',
      },
      RadioGroupItem: surface2,
      TooltipArrow: {
        template: 'surface1',
      },
      SliderTrackActive: {
        template: 'surface3',
      },
      SliderTrack: {
        template: 'surface1',
      },
      SliderThumb: inverseSurface1,
      Tooltip: inverseSurface1,
      ProgressIndicator: inverseSurface1,
      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,
      Input: surface1,
      TextArea: surface1,
      // Healthcare-specific component themes
      HealthCard: {
        template: 'surface1',
      },
      MedicalButton: {
        template: 'surface3',
      },
      PatientCard: {
        template: 'surface1',
      },
      RecordItem: {
        template: 'surface1',
      },
    },
    {
      avoidNestingWithin: ['alt1', 'alt2'],
    }
  )

// --- themes ---

const themesIn = themeBuilder.build()

export type Theme = Record<keyof typeof templates.base, string> & typeof nonInherited.light
export type ThemesOut = Record<keyof typeof themesIn, Theme>
export const themes = themesIn as ThemesOut

// --- utils ---

export function postfixObjKeys<
  A extends { [key: string]: Variable<string> | string },
  B extends string,
>(
  obj: A,
  postfix: B
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]: Variable<string> | string
} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v])) as any
}

// a bit odd but keeping backward compat for values >8 while fixing below
export function sizeToSpace(v: number) {
  if (v === 0) return 0
  if (v === 2) return 0.5
  if (v === 4) return 1
  if (v === 8) return 1.5
  if (v <= 16) return Math.round(v * 0.333)
  return Math.floor(v * 0.7 - 12)
}

export function objectFromEntries<ARR_T extends EntriesType>(arr: ARR_T): EntriesToObject<ARR_T> {
  return Object.fromEntries(arr) as EntriesToObject<ARR_T>
}

export type EntriesType = [PropertyKey, unknown][] | ReadonlyArray<readonly [PropertyKey, unknown]>

export type DeepWritable<OBJ_T> = { -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]> }
export type UnionToIntersection<UNION_T> = // From https://stackoverflow.com/a/50375286
  (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void ? I : never

export type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> =
  DeepWritable<ARR_T> extends (infer R)[]
    ? R extends [infer key, infer val]
      ? { [prop in key & PropertyKey]: val }
      : never
    : never
export type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] }
export type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<
  UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>
>

export function objectKeys<O extends Object>(obj: O) {
  return Object.keys(obj) as Array<keyof O>
}
