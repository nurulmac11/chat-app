module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        public: 'localhost:8080',
    },

    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
};
