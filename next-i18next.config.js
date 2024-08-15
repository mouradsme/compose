module.exports = {
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'fr', 'en'],
  },
  nonExplicitSupportedLngs: true,
  localePath:
    typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
};
