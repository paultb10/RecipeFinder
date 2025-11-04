const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'lodash') {
        return { type: 'empty' };
    }
    return context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: './global.css' });
