const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
    // Flip keys and values of an object (useful for British to American translation)
    flipObject(obj) {
        let flipped = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                flipped[obj[key]] = key;
            }
        }
        return flipped;
    }

    // Handle American to British Translation
    AmericanBritishTranslator(input) {
        let translated = input;

        // Handle American to British time format
        const timeRegex = /(\d{1,2}):(\d{2})/g; // American format HH:MM
        translated = translated.replace(timeRegex, (match, p1, p2) => {
            return `<span class="highlight">${p1}.${p2}</span>`;
        });

        // Handle American to British titles (e.g., Dr. -> Dr)
        for (const [americanTitle, britishTitle] of Object.entries(americanToBritishTitles)) {
            // Adjust regex to capture both 'Dr.' and 'Dr'
            const regex = new RegExp(`\\b(${americanTitle}\\.?)\\s+([A-Z][a-z]+)`, 'gi');
            translated = translated.replace(regex, (match, p1, p2) => {
                // Ensure title is properly converted and capitalized
                const title = britishTitle.charAt(0).toUpperCase() + britishTitle.slice(1);
                return `<span class="highlight">${title}</span> ${p2}`;
            });
        }
        // Translate American spellings to British spellings
        for (const [americanSpelling, britishSpelling] of Object.entries(americanToBritishSpelling)) {
            const regex = new RegExp(`\\b${americanSpelling}\\b`, 'gi');
            translated = translated.replace(regex, `<span class="highlight">${britishSpelling}</span>`);
        }

        // Translate American-only terms
        for (const [americanTerm, britishTerm] of Object.entries(americanOnly)) {
            const regex = new RegExp(`\\b${americanTerm}\\b`, 'gi');
            translated = translated.replace(regex, `<span class="highlight">${britishTerm}</span>`);
        }

        return this.capitalizeFirstLetter(translated);
    }

    // Handle British to American Translation
    BritishAmercianTranslator(input) {
        let translated = input;

        // Flip the american-british titles and spelling for British to American translation
        const britishToAmericanTitles = this.flipObject(americanToBritishTitles);
        const britishToAmericanSpelling = this.flipObject(americanToBritishSpelling);

        // Handle British to American time format
        const timeRegex = /(\d{1,2})\.(\d{2})/g; // British format HH.MM
        translated = translated.replace(timeRegex, (match, p1, p2) => {
            return `<span class="highlight">${p1}:${p2}</span>`;
        });

        // Handle British to American titles (e.g., Dr -> Dr.)
        for (const [britishTitle, americanTitle] of Object.entries(britishToAmericanTitles)) {
            const regex = new RegExp(`\\b(${britishTitle})(\\s+)([A-Z][a-z]+)`, 'gi');
            translated = translated.replace(regex, (match, p1, p2, p3) => {
                // Ensure there is only one period after the title
                const fixedAmericanTitle = americanTitle.replace(/\.$/, '') + '.';
                return `<span class="highlight">${fixedAmericanTitle.charAt(0).toUpperCase() + fixedAmericanTitle.slice(1)}</span>${p2}${p3}`;
            });
        }

        // Translate British spellings to American spellings
        for (const [britishSpelling, americanSpelling] of Object.entries(britishToAmericanSpelling)) {
            const regex = new RegExp(`\\b${britishSpelling}\\b`, 'gi');
            translated = translated.replace(regex, `<span class="highlight">${americanSpelling}</span>`);
        }

        // Translate British-only terms to American
        for (const [britishTerm, americanTerm] of Object.entries(britishOnly)) {
            const regex = new RegExp(`\\b${britishTerm}\\b`, 'gi');
            translated = translated.replace(regex, `<span class="highlight">${americanTerm}</span>`);
        }

        return this.capitalizeFirstLetter(translated);
    }

    // Capitalize the first letter of the translated string
    capitalizeFirstLetter(text) {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}

module.exports = Translator;
