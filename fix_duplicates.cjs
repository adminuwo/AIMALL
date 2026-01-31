const fs = require('fs');

const filePath = 'src/context/LanguageContext.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Function to remove duplicate keys from a language block
function removeDuplicatesFromBlock(block) {
    const lines = block.split('\n');
    const seenKeys = new Set();
    const result = [];
    let skipUntilComma = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if this line defines a key
        const keyMatch = line.match(/^\s+(\w+):\s*/);

        if (keyMatch) {
            const key = keyMatch[1];

            if (seenKeys.has(key)) {
                // Skip this line (it's a duplicate)
                console.log(`Removing duplicate key: ${key}`);
                skipUntilComma = true;
                continue;
            } else {
                seenKeys.add(key);
                result.push(line);
                skipUntilComma = false;
            }
        } else if (skipUntilComma) {
            // Skip lines that are part of the duplicate value
            // until we find a comma or another key
            if (line.trim().endsWith(',') || line.match(/^\s+\w+:/)) {
                skipUntilComma = false;
                if (!line.match(/^\s+\w+:/)) {
                    continue; // Skip the comma line of duplicate
                }
            } else {
                continue; // Skip continuation lines
            }
        }

        if (!skipUntilComma) {
            result.push(line);
        }
    }

    return result.join('\n');
}

// Split content into language blocks
const languagePattern = /(\s+)(\w+):\s*\{/g;
let match;
const blocks = [];
let lastIndex = 0;

while ((match = languagePattern.exec(content)) !== null) {
    if (lastIndex > 0) {
        blocks.push({
            start: lastIndex,
            end: match.index,
            content: content.substring(lastIndex, match.index)
        });
    }
    lastIndex = match.index + match[0].length;
}

// Process each block
console.log(`Found ${blocks.length} language blocks`);

// For now, let's just process the content as a whole
// and remove duplicates within each language object

const lines = content.split('\n');
const result = [];
let currentLangKeys = new Set();
let inLangBlock = false;
let braceDepth = 0;
let baseBraceDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we're entering a language block
    const langMatch = line.match(/^\s+(\w+):\s*\{/);
    if (langMatch && braceDepth === 1) {
        inLangBlock = true;
        currentLangKeys = new Set();
        baseBraceDepth = braceDepth;
        result.push(line);
        braceDepth++;
        continue;
    }

    // Track brace depth
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceDepth += openBraces - closeBraces;

    // Check if we're exiting the language block
    if (inLangBlock && braceDepth <= baseBraceDepth) {
        inLangBlock = false;
        currentLangKeys = new Set();
    }

    // If we're in a language block, check for duplicate keys
    if (inLangBlock) {
        const keyMatch = line.match(/^\s+(\w+):/);
        if (keyMatch) {
            const key = keyMatch[1];
            if (currentLangKeys.has(key)) {
                console.log(`Line ${i + 1}: Removing duplicate key "${key}"`);
                continue; // Skip this duplicate key
            }
            currentLangKeys.add(key);
        }
    }

    result.push(line);
}

// Write the result
const outputContent = result.join('\n');
fs.writeFileSync(filePath, outputContent, 'utf8');

console.log('\nDone! Duplicates removed.');
console.log(`Original lines: ${lines.length}`);
console.log(`New lines: ${result.length}`);
console.log(`Removed: ${lines.length - result.length} lines`);
