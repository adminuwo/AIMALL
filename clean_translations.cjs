const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/context/LanguageContext.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let newLines = [];
let currentLang = null;
let seenKeys = new Set();
let inTranslations = false;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const origLine = lines[i];
    const line = origLine.trimEnd();

    if (line.includes('const translations = {')) {
        inTranslations = true;
    }

    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;

    // Detect language block (e.g., "en: {") at depth 2 (inside translations and provider)
    const langMatch = line.match(/^\s{8}(\w+):\s*\{/);
    if (inTranslations && langMatch && braceDepth === 2) {
        currentLang = langMatch[1];
        seenKeys = new Set();
        console.log(`Processing ${currentLang}`);
    }

    // Detect translation key (e.g., "title: 'English',") at depth 3
    const keyMatch = line.match(/^\s{12}(\w+):/);
    if (inTranslations && currentLang && keyMatch && braceDepth === 3) {
        const key = keyMatch[1];
        if (seenKeys.has(key)) {
            console.log(`  Removing duplicate key: ${key} in ${currentLang}`);
            continue;
        }
        seenKeys.add(key);
    }

    newLines.push(origLine);
    braceDepth += openBraces - closeBraces;

    if (inTranslations && braceDepth <= 1 && line.includes('};')) {
        inTranslations = false;
    }
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Cleaned LanguageContext.jsx successfully!');
