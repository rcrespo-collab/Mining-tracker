/**
 * Babel config for Expo (Metro) and for jest-expo when running component tests.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
