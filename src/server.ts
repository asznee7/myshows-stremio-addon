import serveHTTP from './stremio-addon-sdk-custom/serveHTTP.js'

import addon from './addon-manifest.js'
import catalogHandler from './handlers/catalog-handler.js'

addon.defineCatalogHandler(catalogHandler)

serveHTTP(addon.getInterface(), { port: 7032 })
