
const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/Computer2/OneDrive/Desktop/AIMALL/AI_MALL_FRONTEND_C/src/context/LanguageContext.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Extract the translations object
// Iterate through languages and check for keys
// We expect keys: termsTitle, termsSubtitle, signupAgreeText, signupTerms, signupAnd, signupPrivacy

const languages = ['en', 'hi', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'ta', 'te', 'ur', 'ar', 'es', 'fr', 'de', 'ru', 'zh', 'ja', 'pt', 'sa'];
const requiredKeys = ['termsTitle', 'termsSubtitle', 'signupAgreeText', 'signupTerms', 'signupAnd', 'signupPrivacy'];

let missing = {};

languages.forEach(lang => {
    // Regex to find language block
    // This is a rough regex, assuming standard formatting
    const langRegex = new RegExp(`${lang}:\\s*{`, 'g');
    const match = langRegex.exec(content);

    if (!match) {
        console.log(`Language block not found: ${lang}`);
        return;
    }

    // Find the closing brace of the language object? Hard to parse with regex.
    // Let's just search for the keys within the file section that *likely* belongs to the language.
    // Actually, let's just search if the key exists *after* the lang declaration and *before* the next lang declaration.

    // Find next language index
    let nextLangIndex = content.length;
    languages.forEach(otherLang => {
        if (otherLang !== lang) {
            const rangeRegex = new RegExp(`${otherLang}:\\s*{`, 'g');
            const otherMatch = rangeRegex.exec(content);
            if (otherMatch && otherMatch.index > match.index && otherMatch.index < nextLangIndex) {
                nextLangIndex = otherMatch.index;
            }
        }
    });

    const block = content.substring(match.index, nextLangIndex);

    const missingKeysForLang = [];
    requiredKeys.forEach(key => {
        if (!block.includes(key + ':')) {
            missingKeysForLang.push(key);
        }
    });

    if (missingKeysForLang.length > 0) {
        missing[lang] = missingKeysForLang;
    }
});

console.log(JSON.stringify(missing, null, 2));
