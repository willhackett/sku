const locales = ['AU', 'NZ'];

module.exports = locales.map(locale => ({
  name: locale,
  env: {
    LOCALE: locale
  },
  entry: {
    client: 'src/client.js',
    render: 'src/render.js'
  },
  public: 'src/public',
  target: `dist/${locale}`
}));
