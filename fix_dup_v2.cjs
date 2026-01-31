const fs = require('fs');

const content = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');
const lines = content.split('\n');

// Find all language blocks
const langBlocks = [];
let currentLang = null;
let braceDepth = 0;
let langStartLine = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect language block start
    const langMatch = line.match(/^\s+(\w+):\s*\{/);
    if (langMatch && braceDepth === 1) {
        if (currentLang) {
            langBlocks.push({
                lang: currentLang,
                start: langStartLine,
                end: i - 1
            });
        }
        currentLang = langMatch[1];
        langStartLine = i;
    }

    // Track braces
    braceDepth += (line.match(/\{/g) || []).length;
    braceDepth -= (line.match(/\}/g) || []).length;
}

console.log(`Found ${langBlocks.length} language blocks\n`);

// Process each language block
const result = [...lines];
const linesToRemove = new Set();

for (const block of langBlocks) {
    const keys = new Map();

    for (let i = block.start + 1; i <= block.end; i++) {
        const line = lines[i];
        const keyMatch = line.match(/^\s+(\w+):/);

        if (keyMatch) {
            const key = keyMatch[1];
            if (keys.has(key)) {
                console.log(`${block.lang}: Duplicate key "${key}" at line ${i + 1} (first at ${keys.get(key) + 1})`);
                linesToRemove.add(i);
            } else {
                keys.set(key, i);
            }
        }
    }
}

// Remove duplicate lines
const finalLines = lines.filter((_, index) => !linesToRemove.has(index));

fs.writeFileSync('src/context/LanguageContext.jsx', finalLines.join('\n'), 'utf8');

console.log(`\nRemoved ${linesToRemove.size} duplicate key lines`);
console.log('Done!');
