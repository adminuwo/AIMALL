// Quick script to find all duplicate keys in LanguageContext.jsx
const fs = require('fs');

const filePath = 'src/context/LanguageContext.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Split into language blocks
const languageBlocks = content.split(/\s+(\w+):\s*\{/).slice(1);

console.log('Checking for duplicate keys in each language...\n');

for (let i = 0; i < languageBlocks.length; i += 2) {
    const langCode = languageBlocks[i];
    const langContent = languageBlocks[i + 1];

    if (!langContent) continue;

    // Find the end of this language block
    let braceCount = 1;
    let endIndex = 0;
    for (let j = 0; j < langContent.length; j++) {
        if (langContent[j] === '{') braceCount++;
        if (langContent[j] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIndex = j;
                break;
            }
        }
    }

    const block = langContent.substring(0, endIndex);
    const lines = block.split('\n');

    const keys = new Map();
    const duplicates = [];

    lines.forEach((line, lineNum) => {
        const match = line.match(/^\s+(\w+):/);
        if (match) {
            const key = match[1];
            if (keys.has(key)) {
                duplicates.push({ key, lines: [keys.get(key), lineNum] });
            } else {
                keys.set(key, lineNum);
            }
        }
    });

    if (duplicates.length > 0) {
        console.log(`Language: ${langCode}`);
        duplicates.forEach(dup => {
            console.log(`  - Duplicate key "${dup.key}" at lines: ${dup.lines.join(', ')}`);
        });
        console.log('');
    }
}

console.log('Done!');
