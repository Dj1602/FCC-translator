const Translator = require('../components/translator.js');

module.exports = function (app) {
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      // Check if required fields are missing
      if (!locale || text === undefined || text === null) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Check if text is empty
      if (text.trim() === '') {
        return res.json({ error: 'No text to translate' });
      }

      // Validate locale field
      const validLocales = ['american-to-british', 'british-to-american'];
      if (!validLocales.includes(locale)) {
        return res.json({ error: 'Invalid value for locale field' });
      }

      let translation;
      if (locale === 'american-to-british') {
        translation = translator.AmericanBritishTranslator(text);
      } else if (locale === 'british-to-american') {
        translation = translator.BritishAmercianTranslator(text);
      }

      // If no translation was made, return 'Everything looks good to me!'
      if (translation && translation !== text) {
        return res.json({ text, translation });
      } else {
        return res.json({ text, translation: 'Everything looks good to me!' });
      }
    });
};
