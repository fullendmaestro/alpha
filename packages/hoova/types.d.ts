import { config } from '@hoova/config'

export type Conf = typeof config

declare module '@hoova/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
