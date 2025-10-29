import fs from 'fs'
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: 'Alpha Wallet',
  version: packageJson.version,
  description: packageJson.description || '',
  action: {
    default_icon: {
      '128': '/icons/icon-128.png',
    },
    default_popup: './src/popup/index.html',
  },
  devtools_page: './src/devtools/index.html',
  side_panel: {
    default_path: './src/popup/index.html',
  },
  options_page: './src/popup/index.html',
  background: {
    service_worker: './src/background/index.ts',
    type: 'module',
  },
  icons: {
    '16': '/icons/icon-16.png',
    '32': '/icons/icon-32.png',
    '48': '/icons/icon-48.png',
    '128': '/icons/icon-128.png',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Alt+A',
      },
    },
  },
  permissions: ['storage', 'sidePanel', 'tabs', 'alarms', 'notifications', 'nativeMessaging'],
  host_permissions: ['https://api.coingecko.com/*'],
}

export default manifest
