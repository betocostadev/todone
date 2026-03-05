const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Allow to import .sql
// For migrations to import
config.resolver.sourceExts.push('sql')

module.exports = withNativeWind(config, { input: './global.css' })
